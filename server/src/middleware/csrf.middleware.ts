import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { createLogger } from "../utils/logger";

const logger = createLogger("CSRF");

/**
 * Routes publiques d'auth exemptées du controle CSRF.
 * Ces routes sont soit en lecture seule (GET), soit des flux d'authentification
 * initiaux qui ne sont pas encore proteges par un cookie de session.
 */
const CSRF_EXEMPT_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-otp",
  "/api/auth/refresh-token",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/send-otp-email",
  "/api/auth/check-email",
  "/api/auth/clear-session",
  "/api/mfa/verify",
];

/**
 * Genere un token CSRF aleatoire (32 octets hex = 64 caracteres).
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Pose le cookie csrf-token (non-httpOnly, lisible par le JS client).
 * A appeler lors du login/refresh quand on set les cookies d'auth.
 */
export function setCsrfCookie(res: Response, token: string): void {
  const req = (res as Response & { req?: Request }).req;
  const isSecure = req?.headers["x-forwarded-proto"] === "https" || req?.secure || process.env.NODE_ENV === "production";

  res.cookie("csrf-token", token, {
    httpOnly: false, // Le JS client doit pouvoir le lire
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
  });
}

/**
 * Supprime le cookie CSRF (a appeler au logout).
 */
export function clearCsrfCookie(res: Response): void {
  res.clearCookie("csrf-token", { path: "/" });
}

/**
 * Middleware de verification CSRF (double-submit cookie pattern).
 *
 * Logique :
 * 1. Ne s'applique qu'aux requetes web (pas de header X-Platform: mobile)
 * 2. Ne s'applique qu'aux methodes qui modifient l'etat (POST, PUT, DELETE)
 * 3. Verifie que le header X-CSRF-Token correspond au cookie csrf-token
 * 4. Ignore les routes publiques d'auth (login, register, etc.)
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // 1. Skip pour les clients mobiles (ils utilisent Bearer tokens, pas de cookies)
  if (req.headers["x-platform"] === "mobile") {
    next();
    return;
  }

  // 2. Skip pour les methodes safe (GET, HEAD, OPTIONS)
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  // 3. Skip pour les routes publiques d'auth
  const path = req.path;
  if (CSRF_EXEMPT_PATHS.some(exempt => path === exempt || path.startsWith(exempt + "/"))) {
    next();
    return;
  }

  // 4. Skip si pas de cookie d'auth (pas de session web active)
  if (!req.cookies?.accessToken) {
    next();
    return;
  }

  // 5. Verifier le double-submit : header X-CSRF-Token === cookie csrf-token
  const headerToken = req.headers["x-csrf-token"] as string | undefined;
  const cookieToken = req.cookies?.["csrf-token"] as string | undefined;

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    logger.warn(`CSRF validation echouee — ${req.method} ${req.originalUrl} — header: ${!!headerToken}, cookie: ${!!cookieToken}`);
    res.status(403).json({ error: "Token CSRF invalide" });
    return;
  }

  next();
}
