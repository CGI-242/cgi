import { Request, Response, NextFunction } from "express";
import { createLogger } from "../utils/logger";

const logger = createLogger("TurnstileMiddleware");

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

// Alerter au demarrage si la cle Turnstile manque
if (!TURNSTILE_SECRET_KEY) {
  if (IS_PRODUCTION) {
    logger.error("TURNSTILE_SECRET_KEY manquante en production — CAPTCHA desactive, risque de brute force !");
  } else {
    logger.warn("TURNSTILE_SECRET_KEY non configuree — CAPTCHA desactive (dev uniquement).");
  }
}

export async function verifyTurnstile(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Pas de cle configuree
  if (!TURNSTILE_SECRET_KEY) {
    if (IS_DEVELOPMENT) {
      // En dev strict uniquement, on laisse passer
      next();
      return;
    }
    // En production ou staging, bloquer si pas de cle
    res.status(503).json({ error: "Service CAPTCHA non configure" });
    return;
  }

  const token: string | undefined = req.body.turnstileToken;

  if (!token) {
    res.status(403).json({ error: "Verification CAPTCHA requise" });
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: req.ip || "",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const result = (await response.json()) as { success: boolean; "error-codes"?: string[] };

    if (!result.success) {
      logger.warn(`CAPTCHA echoue — IP: ${req.ip}, errors: ${result["error-codes"]?.join(", ") || "aucune"}`);
      res.status(403).json({ error: "Verification CAPTCHA echouee" });
      return;
    }
  } catch (err) {
    // Fail-closed : si Cloudflare est injoignable, on bloque toujours
    logger.error("Verification Turnstile impossible — requete bloquee", err);
    res.status(503).json({ error: "Service de verification indisponible, reessayez" });
    return;
  }

  // Supprimer le token du body apres verification
  delete req.body.turnstileToken;
  next();
}
