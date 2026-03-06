import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { TokenBlacklistService } from "../services/tokenBlacklist.service";
import { generateCsrfToken, setCsrfCookie, clearCsrfCookie } from "./csrf.middleware";
import { createLogger } from "../utils/logger";
import prisma from "../utils/prisma";

const logger = createLogger("Auth");

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  orgId?: string;
  orgRole?: string;
  orgPermissions?: Record<string, boolean>;
  quotaIncremented?: boolean;
}

/**
 * Extrait le token depuis :
 * 1. Header Authorization: Bearer ... (mobile)
 * 2. Cookie httpOnly accessToken (web)
 */
function extractToken(req: AuthRequest): string | null {
  // 1. Header Authorization (mobile / API)
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }

  // 2. Cookie httpOnly (web)
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (!token) {
    logger.warn(`[401] Token manquant — ${req.method} ${req.originalUrl} — cookies: ${JSON.stringify(Object.keys(req.cookies || {}))} — auth header: ${!!req.headers.authorization}`);
    res.status(401).json({ error: "Token manquant" });
    return;
  }

  try {
    // Vérifier si le token est blacklisté
    if (TokenBlacklistService.isBlacklisted(token)) {
      res.status(401).json({ error: "Token révoqué" });
      return;
    }

    const payload = verifyAccessToken(token);

    // Vérifier si tous les tokens de l'utilisateur ont été révoqués (logout-all)
    // Utilise la version async qui vérifie aussi la base de données (M2)
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (decoded.iat && await TokenBlacklistService.isUserBlacklistedAsync(payload.userId, decoded.iat)) {
      res.status(401).json({ error: "Session révoquée, veuillez vous reconnecter" });
      return;
    }

    // Vérifier que l'utilisateur existe toujours en base
    const userExists = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } });
    if (!userExists) {
      res.status(401).json({ error: "Compte supprimé ou inexistant" });
      return;
    }

    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    logger.warn(`[401] Token invalide — ${req.method} ${req.originalUrl} — ${err instanceof Error ? err.message : "unknown"}`);
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

/**
 * Détecte si le client est web (cookie) ou mobile (Bearer)
 * Le client mobile envoie X-Platform: mobile
 */
export function isWebClient(req: Request): boolean {
  return req.headers["x-platform"] !== "mobile";
}

/**
 * Set les cookies httpOnly pour le client web
 */
export function setAuthCookies(res: Response, token: string, refreshToken: string, rememberMe?: boolean): void {
  // Détecter HTTPS via le proxy (X-Forwarded-Proto) ou NODE_ENV
  const req = (res as Response & { req?: Request }).req;
  const isSecure = req?.headers["x-forwarded-proto"] === "https" || req?.secure || process.env.NODE_ENV === "production";

  const cookieOpts = {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax" as const,
    path: "/",
  };

  const accessMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000; // 7j ou 15min
  const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30j ou 7j

  res.cookie("accessToken", token, {
    ...cookieOpts,
    maxAge: accessMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOpts,
    maxAge: refreshMaxAge,
  });

  // CSRF double-submit cookie (non-httpOnly, lisible par le JS client)
  const csrfToken = generateCsrfToken();
  setCsrfCookie(res, csrfToken);

  logger.info(`Cookies set — secure: ${isSecure}, sameSite: lax, rememberMe: ${!!rememberMe}`);
}

/**
 * Supprime les cookies d'auth (logout web)
 */
export function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  clearCsrfCookie(res);
}
