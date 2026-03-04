import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { generateOtp } from "../utils/otp";
import prisma from "../utils/prisma";
import { requireAuth, AuthRequest, isWebClient, setAuthCookies, clearAuthCookies } from "../middleware/auth";
import { sensitiveLimiter } from "../middleware/rateLimit.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerBody, loginBody, verifyOtpBody, sendOtpEmailBody, forgotPasswordBody, resetPasswordBody, refreshTokenBody, checkEmailBody } from "../schemas/auth.schema";
import { TokenBlacklistService } from "../services/tokenBlacklist.service";
import { EmailService } from "../services/email.service";
import { AuditService } from "../services/audit.service";
import { createLogger } from "../utils/logger";

const logger = createLogger("AuthRoutes");
const router = Router();

/**
 * Envoie les tokens selon la plateforme :
 * - Web : cookies httpOnly (token NON visible par JS)
 * - Mobile : tokens dans le body JSON
 */
function sendTokens(req: Request, res: Response, token: string, refreshToken: string, body: Record<string, unknown>, rememberMe?: boolean): void {
  if (isWebClient(req)) {
    // Web : cookies httpOnly — pas de tokens dans le body
    setAuthCookies(res, token, refreshToken, rememberMe);
    res.json(body);
  } else {
    // Mobile : tokens dans le body
    res.json({ ...body, token, refreshToken });
  }
}

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Inscription d'un utilisateur avec création d'organisation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [entrepriseNom, nom, prenom, email, password]
 *             properties:
 *               entrepriseNom:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec organisation
 *       400:
 *         description: Champs obligatoires manquants
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/register
router.post("/register", validate({ body: registerBody }), async (req: Request, res: Response) => {
  try {
    const { entrepriseNom, nom, prenom, email, telephone, password, invitationToken, pays } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Cet email est déjà utilisé" });
      return;
    }

    // Chercher une invitation : par token explicite OU par email PENDING
    let invitation = null;
    if (invitationToken) {
      invitation = await prisma.invitation.findUnique({ where: { token: invitationToken } });
      if (!invitation || invitation.status !== "PENDING") {
        res.status(400).json({ error: "Invitation invalide ou expirée" });
        return;
      }
      if (invitation.expiresAt < new Date()) {
        await prisma.invitation.update({ where: { id: invitation.id }, data: { status: "EXPIRED" } });
        res.status(400).json({ error: "Cette invitation a expiré" });
        return;
      }
    } else {
      // Chercher une invitation PENDING pour cet email
      invitation = await prisma.invitation.findFirst({
        where: { email, status: "PENDING", expiresAt: { gt: new Date() } },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: prenom,
        lastName: nom,
        phone: telephone || null,
        emailVerifyToken: otp,
        emailVerifyExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    let organization;

    if (invitation) {
      // Auto-join : rejoindre l'organisation existante, PAS de création org/abo
      organization = await prisma.organization.findUnique({ where: { id: invitation.organizationId } });
      if (!organization) {
        res.status(400).json({ error: "Organisation de l'invitation introuvable" });
        return;
      }

      await prisma.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: invitation.role,
        },
      });

      // Marquer l'invitation comme acceptée
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      });

      logger.info(`Inscription avec invitation: ${email} a rejoint org ${organization.name} (rôle: ${invitation.role})`);
    } else {
      // Flux normal : créer org + abo FREE
      const slug = entrepriseNom!.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      organization = await prisma.organization.create({
        data: { name: entrepriseNom!, slug: `${slug}-${Date.now()}`, pays: pays || "242" },
      });

      await prisma.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "OWNER",
        },
      });

      // Créer un abonnement FREE (essai 7 jours, 5 questions)
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);
      await prisma.subscription.create({
        data: {
          type: "ORGANIZATION",
          organizationId: organization.id,
          plan: "FREE",
          status: "TRIALING",
          questionsPerMonth: 5,
          currentPeriodEnd: trialEnd,
          trialEndsAt: trialEnd,
        },
      });
    }

    // Envoyer OTP par email
    EmailService.sendOtp(email, otp).catch(() => {});

    AuditService.log({
      actorId: user.id,
      actorEmail: email,
      action: "REGISTER",
      entityType: "USER",
      entityId: user.id,
      organizationId: organization.id,
      changes: { email, organization: organization.name, viaInvitation: !!invitation },
    });

    res.status(201).json({
      user: {
        id: user.id,
        nom: user.lastName,
        prenom: user.firstName,
        email: user.email,
        telephone: user.phone,
        is_verified: user.isEmailVerified,
      },
      entreprise: {
        id: organization.id,
        nom: organization.name,
      },
      otpCode: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    logger.error("[register]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion avec email et mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, OTP envoyé par email
 *       400:
 *         description: Email et mot de passe requis
 *       401:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/login
router.post("/login", validate({ body: loginBody }), async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Identifiants incorrects" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      AuditService.log({
        actorId: user.id,
        actorEmail: email,
        action: "LOGIN_FAILED",
        entityType: "USER",
        entityId: user.id,
        changes: null,
        metadata: { reason: "invalid_password" },
      });
      res.status(401).json({ error: "Identifiants incorrects" });
      return;
    }

    const otp = generateOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: otp,
        emailVerifyExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Envoyer OTP par email
    EmailService.sendOtp(email, otp).catch(() => {});

    // Récupérer l'entreprise
    const membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    res.json({
      user: {
        id: user.id,
        nom: user.lastName,
        prenom: user.firstName,
        email: user.email,
        telephone: user.phone,
        role: membership?.role,
        entreprise_id: membership?.organizationId,
        entreprise_nom: membership?.organization.name,
        is_verified: user.isEmailVerified,
      },
      rememberMe: !!rememberMe,
      otpCode: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    logger.error("[login]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Vérification du code OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP vérifié, tokens retournés (ou requireMFA si MFA activé)
 *       400:
 *         description: Code invalide
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/verify-otp
router.post("/verify-otp", validate({ body: verifyOtpBody }), async (req: Request, res: Response) => {
  try {
    const { email, otp, rememberMe } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.emailVerifyToken !== otp) {
      res.status(400).json({ error: "Code invalide" });
      return;
    }

    // Vérifier l'expiration de l'OTP
    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      res.status(400).json({ error: "Code expiré, veuillez en demander un nouveau" });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });

    // Si MFA activé, retourner un token temporaire MFA au lieu des vrais tokens
    if (user.mfaEnabled) {
      const secret = process.env.JWT_SECRET!;
      const mfaToken = jwt.sign(
        { userId: user.id, email: user.email, mfa: true },
        secret,
        { expiresIn: "5m" }
      );

      res.json({ requireMFA: true, mfaToken });
      return;
    }

    // Pas de MFA → émettre les tokens normalement
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Invalider toutes les sessions précédentes (1 seul poste à la fois)
    TokenBlacklistService.blacklistAllUserTokens(user.id);

    const token = generateAccessToken({ userId: user.id, email: user.email }, rememberMe);
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email }, rememberMe);

    const membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    AuditService.log({
      actorId: user.id,
      actorEmail: user.email,
      action: "LOGIN_SUCCESS",
      entityType: "USER",
      entityId: user.id,
      changes: null,
    });

    sendTokens(req, res, token, refreshToken, {
      user: {
        id: user.id,
        nom: user.lastName,
        prenom: user.firstName,
        email: user.email,
        role: membership?.role,
        globalRole: user.role,
        entreprise_id: membership?.organizationId,
        entreprise_nom: membership?.organization.name,
        is_verified: true,
      },
    }, rememberMe);
  } catch (err) {
    logger.error("[verify-otp]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /auth/send-otp-email:
 *   post:
 *     tags: [Auth]
 *     summary: Renvoi du code OTP par email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Code OTP envoyé (si le compte existe)
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/send-otp-email
router.post("/send-otp-email", sensitiveLimiter, validate({ body: sendOtpEmailBody }), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.json({ message: "Si le compte existe, un code a été envoyé" });
      return;
    }

    const otp = user.emailVerifyToken || generateOtp();
    if (!user.emailVerifyToken) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifyToken: otp,
          emailVerifyExpires: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
    }

    // Envoyer l'email
    await EmailService.sendOtp(email, otp);

    res.json({
      message: "Code envoyé",
      devCode: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    logger.error("[send-otp-email]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Demande de réinitialisation de mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Code de réinitialisation envoyé (si le compte existe)
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/forgot-password
router.post("/forgot-password", sensitiveLimiter, validate({ body: forgotPasswordBody }), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const otp = generateOtp();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: otp,
          resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      // Envoyer l'email de réinitialisation
      EmailService.sendPasswordReset(email, otp).catch(() => {});

      AuditService.log({
        actorId: user.id,
        actorEmail: email,
        action: "PASSWORD_RESET_REQUESTED",
        entityType: "USER",
        entityId: user.id,
        changes: null,
      });

      res.json({
        message: "Si le compte existe, un code a été envoyé",
        devCode: process.env.NODE_ENV === "development" ? otp : undefined,
      });
      return;
    }

    res.json({ message: "Si le compte existe, un code a été envoyé" });
  } catch (err) {
    logger.error("[forgot-password]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Réinitialisation du mot de passe avec code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *       400:
 *         description: Champs manquants, code invalide ou expiré
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/reset-password
router.post("/reset-password", sensitiveLimiter, validate({ body: resetPasswordBody }), async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetPasswordToken !== code) {
      res.status(400).json({ error: "Code invalide" });
      return;
    }
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      res.status(400).json({ error: "Code expiré" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    AuditService.log({
      actorId: user.id,
      actorEmail: email,
      action: "PASSWORD_CHANGED",
      entityType: "USER",
      entityId: user.id,
      changes: null,
    });

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    logger.error("[reset-password]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Renouvellement du JWT via refresh token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token (mobile uniquement, lu depuis cookie pour le web)
 *     responses:
 *       200:
 *         description: Nouveaux tokens générés
 *       401:
 *         description: Refresh token manquant, invalide, expiré ou révoqué
 */
// POST /api/auth/refresh-token
router.post("/refresh-token", validate({ body: refreshTokenBody }), async (req: Request, res: Response) => {
  try {
    // Lire le refresh token depuis le body (mobile) ou le cookie (web)
    const refreshTokenValue = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshTokenValue) {
      res.status(401).json({ error: "Refresh token manquant" });
      return;
    }

    // Vérifier si blacklisté
    if (TokenBlacklistService.isBlacklisted(refreshTokenValue)) {
      res.status(401).json({ error: "Refresh token révoqué" });
      return;
    }

    const payload = verifyRefreshToken(refreshTokenValue);

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      res.status(401).json({ error: "Utilisateur introuvable" });
      return;
    }

    // Vérifier blacklist globale utilisateur
    const decoded = JSON.parse(Buffer.from(refreshTokenValue.split('.')[1], 'base64').toString());
    if (decoded.iat && TokenBlacklistService.isUserBlacklisted(payload.userId, decoded.iat)) {
      res.status(401).json({ error: "Session révoquée" });
      return;
    }

    // Générer de nouveaux tokens
    const newToken = generateAccessToken({ userId: user.id, email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // Blacklister l'ancien refresh token (rotation)
    TokenBlacklistService.blacklistToken(refreshTokenValue);

    if (isWebClient(req)) {
      setAuthCookies(res, newToken, newRefreshToken);
      res.json({ message: "Token renouvelé" });
    } else {
      res.json({ token: newToken, refreshToken: newRefreshToken });
    }
  } catch (err) {
    logger.error("[refresh-token]", err);
    res.status(401).json({ error: "Refresh token invalide ou expiré" });
  }
});

/**
 * @swagger
 * /auth/check-email:
 *   post:
 *     tags: [Auth]
 *     summary: Vérifier si un email existe déjà
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Résultat de la vérification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/check-email
router.post("/check-email", sensitiveLimiter, validate({ body: checkEmailBody }), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Déconnexion de la session courante
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/clear-session — Clear cookies sans auth (session révoquée)
router.post("/clear-session", (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ message: "Session nettoyée" });
});

// POST /api/auth/logout
router.post("/logout", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ")
      ? header.split(" ")[1]
      : req.cookies?.accessToken;

    if (token) {
      TokenBlacklistService.blacklistToken(token);
    }

    // Supprimer les cookies web
    clearAuthCookies(res);

    AuditService.log({
      actorId: req.userId!,
      actorEmail: req.userEmail!,
      action: "LOGOUT",
      entityType: "USER",
      entityId: req.userId!,
      changes: null,
    });

    res.json({ message: "Déconnexion réussie" });
  } catch (err) {
    logger.error("[logout]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     tags: [Auth]
 *     summary: Révocation de toutes les sessions de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Toutes les sessions ont été révoquées
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
// POST /api/auth/logout-all
router.post("/logout-all", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ")
      ? header.split(" ")[1]
      : req.cookies?.accessToken;

    if (token) {
      TokenBlacklistService.blacklistToken(token);
    }

    // Invalider tous les tokens de l'utilisateur
    TokenBlacklistService.blacklistAllUserTokens(req.userId!);

    // Supprimer les cookies web
    clearAuthCookies(res);

    AuditService.log({
      actorId: req.userId!,
      actorEmail: req.userEmail!,
      action: "LOGOUT_ALL",
      entityType: "USER",
      entityId: req.userId!,
      changes: null,
    });

    res.json({ message: "Toutes les sessions ont été révoquées" });
  } catch (err) {
    logger.error("[logout-all]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
