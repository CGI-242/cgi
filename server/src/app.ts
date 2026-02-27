import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { globalLimiter, authLimiter, sensitiveLimiter, chatLimiter } from "./middleware/rateLimit.middleware";
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

const app = express();

// Origins autorisées (supporte plusieurs domaines séparés par des virgules)
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3004")
  .split(",")
  .map(o => o.trim());
// En dev, ajouter automatiquement les ports locaux courants
if (process.env.NODE_ENV !== "production") {
  const devOrigins = ["http://localhost:8081", "http://localhost:3000", "http://localhost:3004"];
  devOrigins.forEach(o => { if (!allowedOrigins.includes(o)) allowedOrigins.push(o); });
}

// Middleware sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // API REST JSON — CSP géré par le frontend
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (mobile, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} non autorisée par CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Organization-ID", "X-Platform"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate limiting global
app.use(globalLimiter);

// Swagger UI — protégé en production
if (process.env.NODE_ENV !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (_req, res) => res.json(swaggerSpec));
}

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/mfa", sensitiveLimiter, mfaRoutes);
app.use("/api/chat", chatLimiter, chatRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/alertes-fiscales", alertesFiscalesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ingestion", ingestionRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/user/stats", userStatsRoutes);
app.use("/api/notifications", notificationRoutes);

// Démarrer le cron des rappels (expiration abonnement + échéances fiscales)
startReminderCron();

// Health check complet — vérifie PostgreSQL et Qdrant
app.get("/health", async (_req, res) => {
  const checks: Record<string, string> = {};
  let overall = "ok";

  // Vérifier PostgreSQL
  try {
    const prisma = (await import("./utils/prisma")).default;
    await prisma.$queryRawUnsafe("SELECT 1");
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

// Servir le frontend web (Expo build) — après les routes API
const webDistPath = path.resolve(__dirname, "../../mobile/dist");
app.use(express.static(webDistPath));
// SPA fallback : toute route non-API renvoie index.html
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(webDistPath, "index.html"));
});

export default app;
