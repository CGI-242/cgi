import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { createLogger } from "../utils/logger";

const logger = createLogger("TurnstileMiddleware");

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const MOBILE_API_SECRET = process.env.MOBILE_API_SECRET;
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

// Alerter au demarrage si les cles manquent
if (!TURNSTILE_SECRET_KEY) {
  if (IS_PRODUCTION) {
    logger.error("TURNSTILE_SECRET_KEY manquante en production — CAPTCHA desactive, risque de brute force !");
  } else {
    logger.warn("TURNSTILE_SECRET_KEY non configuree — CAPTCHA desactive (dev uniquement).");
  }
}
if (!MOBILE_API_SECRET && IS_PRODUCTION) {
  logger.warn("MOBILE_API_SECRET non configuree — les requetes mobiles natives seront bloquees par le CAPTCHA.");
}

/**
 * Verifie qu'une requete mobile est authentique via HMAC.
 * L'app mobile envoie :
 *   X-Platform: mobile
 *   X-Mobile-Timestamp: <unix_ms>
 *   X-Mobile-Signature: HMAC-SHA256(timestamp + ":" + body_json, MOBILE_API_SECRET)
 *
 * Protection contre le replay : le timestamp doit etre < 5 minutes.
 */
function isAuthenticMobileRequest(req: Request): boolean {
  if (req.headers["x-platform"] !== "mobile" || !MOBILE_API_SECRET) {
    return false;
  }

  const timestamp = req.headers["x-mobile-timestamp"] as string | undefined;
  const signature = req.headers["x-mobile-signature"] as string | undefined;

  if (!timestamp || !signature) {
    return false;
  }

  // Protection anti-replay : max 5 minutes
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Math.abs(Date.now() - ts) > 5 * 60 * 1000) {
    logger.warn(`Mobile signature expiree — IP: ${req.ip}, timestamp: ${timestamp}`);
    return false;
  }

  // Verifier le HMAC
  const payload = timestamp + ":" + JSON.stringify(req.body || {});
  const expected = crypto.createHmac("sha256", MOBILE_API_SECRET).update(payload).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) {
    logger.warn(`Mobile signature invalide — IP: ${req.ip}`);
    return false;
  }

  return true;
}

export async function verifyTurnstile(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Pas de cle configuree
  if (!TURNSTILE_SECRET_KEY) {
    if (IS_DEVELOPMENT) {
      next();
      return;
    }
    res.status(503).json({ error: "Service CAPTCHA non configure" });
    return;
  }

  // App mobile native : verifier via HMAC au lieu du CAPTCHA
  if (req.headers["x-platform"] === "mobile") {
    if (isAuthenticMobileRequest(req)) {
      delete req.body.turnstileToken;
      next();
      return;
    }
    // Signature invalide ou absente — bloquer
    res.status(403).json({ error: "Signature mobile invalide" });
    return;
  }

  // Web : verification Turnstile classique
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
    logger.error("Verification Turnstile impossible — requete bloquee", err);
    res.status(503).json({ error: "Service de verification indisponible, reessayez" });
    return;
  }

  delete req.body.turnstileToken;
  next();
}
