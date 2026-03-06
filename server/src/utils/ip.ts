import { Request } from "express";

/**
 * Extrait l'adresse IP du client depuis la requete.
 * Utilise X-Forwarded-For (si reverse proxy) ou req.ip.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    // X-Forwarded-For peut contenir plusieurs IPs : client, proxy1, proxy2
    return forwarded.split(",")[0].trim();
  }
  return req.ip || "unknown";
}
