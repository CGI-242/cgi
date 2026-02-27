import "dotenv/config";

import app from "./app";
import { initializeCollection } from "./services/rag/qdrant.service";
import { createLogger } from "./utils/logger";

const logger = createLogger("Server");
const PORT = Number(process.env.PORT) || 3004;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, async () => {
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
