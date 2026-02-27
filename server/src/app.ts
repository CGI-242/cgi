import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { globalLimiter, authLimiter } from "./middleware/rateLimit.middleware";
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
import { startReminderCron } from "./services/reminder.service";

const app = express();

// Origins autorisées
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3004")
  .split(",")
  .map(o => o.trim());
// Ajouter Expo web dev server automatiquement en dev
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:8081");
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
app.use(express.json());
app.use(cookieParser());

// Rate limiting global
app.use(globalLimiter);

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/mfa", mfaRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/alertes-fiscales", alertesFiscalesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ingestion", ingestionRoutes);

// Démarrer le cron des rappels (expiration abonnement + échéances fiscales)
startReminderCron();

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "cgi-242" });
});

export default app;
