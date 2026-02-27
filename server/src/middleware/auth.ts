import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { TokenBlacklistService } from "../services/tokenBlacklist.service";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  orgId?: string;
  orgRole?: string;
  orgPermissions?: Record<string, boolean>;
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

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (!token) {
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
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (decoded.iat && TokenBlacklistService.isUserBlacklisted(payload.userId, decoded.iat)) {
      res.status(401).json({ error: "Session révoquée, veuillez vous reconnecter" });
      return;
    }

    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch {
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
export function setAuthCookies(res: Response, token: string, refreshToken: string): void {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    path: "/",
  });
}

/**
 * Supprime les cookies d'auth (logout web)
 */
export function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
}
