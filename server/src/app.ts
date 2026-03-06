import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { globalLimiter, authLimiter, sensitiveLimiter, chatLimiter } from "./middleware/rateLimit.middleware";
import { csrfProtection } from "./middleware/csrf.middleware";
import authRoutes from "./routes/auth";
import mfaRoutes from "./routes/mfa.routes";
import chatRoutes from "./routes/chat";
import organizationRoutes from "./routes/organization.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import permissionRoutes from "./routes/permission.routes";
import analyticsRoutes from "./routes/analytics.routes";
import auditRoutes from "./routes/audit.routes";
import alertesFiscalesRoutes from "./routes/alertes-fiscales.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import ingestionRoutes from "./routes/ingestion.routes";
import searchHistoryRoutes from "./routes/search-history.routes";
import userStatsRoutes from "./routes/user-stats.routes";
import notificationRoutes from "./routes/notifications.routes";
import { startReminderCron } from "./services/reminder.service";
import prisma from "./utils/prisma";
import { createLogger } from "./utils/logger";

const logger = createLogger("App");
const app = express();

// Faire confiance au reverse proxy Nginx (nécessaire pour express-rate-limit + X-Forwarded-For)
app.set("trust proxy", 1);

// Origins autorisées (supporte plusieurs domaines séparés par des virgules)
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3004")
  .split(",")
  .map(o => o.trim());
// En dev, ajouter automatiquement les ports locaux courants
if (process.env.NODE_ENV !== "production") {
  const devOrigins = ["http://localhost:8081", "http://localhost:3000", "http://localhost:3004"];
  devOrigins.forEach(o => { if (!allowedOrigins.includes(o)) allowedOrigins.push(o); });
}

// Middleware sécurité — CSP activé car le serveur sert aussi le SPA (LOW-09)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      // Clients sans Origin (mobile natif, curl, monitoring) :
      // autoriser la requête mais sans en-têtes CORS (inutiles pour ces clients)
      callback(null, false);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} non autorisée par CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Organization-ID", "X-Platform", "X-CSRF-Token"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Middleware de logging des requêtes HTTP via Winston (LOW-08)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Protection CSRF (double-submit cookie) — apres cookieParser
app.use(csrfProtection);

// Rate limiting global
app.use(globalLimiter);

// Swagger UI — intentionnellement désactivé en production uniquement pour la sécurité.
// En dev/staging, Swagger reste accessible pour faciliter le développement et les tests. (LOW-03)
if (process.env.NODE_ENV !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (_req, res) => res.json(swaggerSpec));
}

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/mfa", sensitiveLimiter, mfaRoutes);
app.use("/api/chat", chatLimiter, chatRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/subscription", sensitiveLimiter, subscriptionRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/alertes-fiscales", alertesFiscalesRoutes);
app.use("/api/user/stats", userStatsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", sensitiveLimiter, adminRoutes);
app.use("/api/ingestion", sensitiveLimiter, ingestionRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/notifications", notificationRoutes);

// Démarrer le cron des rappels (expiration abonnement + échéances fiscales)
startReminderCron();

// Health check complet — vérifie PostgreSQL et Qdrant
app.get("/health", async (_req, res) => {
  const checks: Record<string, string> = {};
  let overall = "ok";

  // Vérifier PostgreSQL
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.postgresql = "ok";
  } catch {
    checks.postgresql = "down";
    overall = "degraded";
  }

  // Vérifier Qdrant
  try {
    const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const resp = await fetch(`${qdrantUrl}/healthz`, { signal: controller.signal });
    clearTimeout(timeout);
    checks.qdrant = resp.ok ? "ok" : "down";
  } catch {
    checks.qdrant = "down";
    overall = "degraded";
  }

  // Vérifier SMTP (config présente)
  checks.smtp = process.env.SMTP_HOST ? "configured" : "not_configured";

  const statusCode = overall === "ok" ? 200 : 503;
  res.status(statusCode).json({ status: overall, service: "cgi-242", checks });
});

// Catch-all pour routes /api/* inexistantes — retourne 404 JSON (MED-03)
app.all("/api/{*splat}", (_req, res) => {
  res.status(404).json({ error: "Route API introuvable" });
});

// Gestionnaire d'erreurs global — empêche l'exposition de stack traces (HIGH-01)
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("Erreur non gérée:", err);
  if (err.message?.includes("non autorisée par CORS")) {
    res.status(403).json({ error: "Origin non autorisée" });
    return;
  }
  res.status(500).json({ error: "Erreur interne du serveur" });
});

// Servir le frontend web (Expo build) — après les routes API
const webDistPath = path.resolve(__dirname, "../../mobile/dist");
const webIndexPath = path.join(webDistPath, "index.html");

if (fs.existsSync(webIndexPath)) {
  app.use(express.static(webDistPath));
  // SPA fallback : toute route non-API renvoie index.html
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(webIndexPath);
  });
}

export default app;
