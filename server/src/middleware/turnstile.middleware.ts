import { Request, Response, NextFunction } from "express";
import { createLogger } from "../utils/logger";

const logger = createLogger("TurnstileMiddleware");

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Pas de clé configurée → skip (environnement dev sans Turnstile)
  if (!TURNSTILE_SECRET_KEY) {
    next();
    return;
  }

  // Turnstile est web-only — sur mobile natif, on skip
  if (req.headers["x-platform"] === "mobile") {
    delete req.body.turnstileToken;
    next();
    return;
  }

  const token: string | undefined = req.body.turnstileToken;

  if (!token) {
    res.status(403).json({ error: "Verification CAPTCHA requise" });
    return;
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: req.ip || "",
      }),
    });

    const result = (await response.json()) as { success: boolean };

    if (!result.success) {
      res.status(403).json({ error: "Verification CAPTCHA echouee" });
      return;
    }
  } catch (err) {
    // Fail-closed en production : si Cloudflare est injoignable, on bloque (CRIT-03)
    logger.error("Erreur lors de la verification Turnstile", err);
    if (process.env.NODE_ENV === "production") {
      res.status(503).json({ error: "Service de vérification indisponible, réessayez" });
      return;
    }
    // En dev/test, on laisse passer pour ne pas bloquer le développement
  }

  // Supprimer le token du body après vérification
  delete req.body.turnstileToken;
  next();
}
