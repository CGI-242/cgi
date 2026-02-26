import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { generateOtp } from "../utils/otp";

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { entrepriseNom, nom, prenom, email, telephone, password } = req.body;

    if (!entrepriseNom || !nom || !prenom || !email || !password) {
      res.status(400).json({ error: "Tous les champs obligatoires sont requis" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Cet email est déjà utilisé" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    // Créer l'organisation (entreprise)
    const slug = entrepriseNom.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const organization = await prisma.organization.create({
      data: { name: entrepriseNom, slug: `${slug}-${Date.now()}` },
    });

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: prenom,
        lastName: nom,
        phone: telephone || null,
        emailVerifyToken: otp,
      },
    });

    // Ajouter comme OWNER de l'organisation
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "OWNER",
      },
    });

    // Créer un abonnement FREE
    await prisma.subscription.create({
      data: {
        type: "ORGANIZATION",
        organizationId: organization.id,
        plan: "FREE",
        questionsPerMonth: 10,
      },
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
      otpCode: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (err) {
    console.error("[register]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Identifiants incorrects" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Identifiants incorrects" });
      return;
    }

    const otp = generateOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken: otp },
    });

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
      otpCode: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (err) {
    console.error("[login]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.emailVerifyToken !== otp) {
      res.status(400).json({ error: "Code invalide" });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        lastLoginAt: new Date(),
      },
    });

    const token = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

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
        role: membership?.role,
        entreprise_id: membership?.organizationId,
        entreprise_nom: membership?.organization.name,
        is_verified: true,
      },
      token,
      refreshToken,
    });
  } catch (err) {
    console.error("[verify-otp]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/auth/send-otp-email
router.post("/send-otp-email", async (req: Request, res: Response) => {
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
        data: { emailVerifyToken: otp },
      });
    }

    // TODO: Envoyer l'email avec nodemailer
    console.log(`[OTP] Code pour ${email}: ${otp}`);

    res.json({
      message: "Code envoyé",
      devCode: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (err) {
    console.error("[send-otp-email]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req: Request, res: Response) => {
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
      console.log(`[RESET] Code pour ${email}: ${otp}`);

      res.json({
        message: "Si le compte existe, un code a été envoyé",
        devCode: process.env.NODE_ENV !== "production" ? otp : undefined,
      });
      return;
    }

    res.json({ message: "Si le compte existe, un code a été envoyé" });
  } catch (err) {
    console.error("[forgot-password]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      res.status(400).json({ error: "Tous les champs sont requis" });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
      return;
    }

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

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    console.error("[reset-password]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/auth/check-email
router.post("/check-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
