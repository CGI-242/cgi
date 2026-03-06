import "dotenv/config";

import app from "./app";
import prisma from "./utils/prisma";
import { initializeCollection } from "./services/rag/qdrant.service";
import { createLogger } from "./utils/logger";

const logger = createLogger("Server");
const PORT = Number(process.env.PORT) || 3004;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const server = app.listen(PORT, async () => {
  logger.info(`Serveur démarré sur ${BASE_URL}`);
  logger.info(`Environnement: ${process.env.NODE_ENV}`);
  logger.info(`API:      ${BASE_URL}/api`);
  logger.info(`Swagger:  ${BASE_URL}/api/docs`);
  logger.info(`Frontend: ${BASE_URL}`);

  // Initialiser la collection Qdrant (non-bloquant)
  try {
    await initializeCollection();
    logger.info("Qdrant initialisé");
  } catch (error) {
    logger.warn("Qdrant non disponible:", error);
  }
});

// Graceful shutdown — fermer proprement le serveur HTTP et la connexion Prisma (LOW-13)
function gracefulShutdown(signal: string) {
  logger.info(`${signal} reçu — arrêt gracieux en cours...`);
  server.close(async () => {
    logger.info("Serveur HTTP fermé");
    try {
      await prisma.$disconnect();
      logger.info("Connexion Prisma fermée");
    } catch (err) {
      logger.error("Erreur fermeture Prisma:", err);
    }
    process.exit(0);
  });

  // Forcer l'arrêt après 10 secondes si le serveur ne se ferme pas
  setTimeout(() => {
    logger.error("Arrêt forcé après timeout de 10s");
    process.exit(1);
  }, 10_000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
