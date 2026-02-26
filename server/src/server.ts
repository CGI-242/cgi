import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { initializeCollection } from "./services/rag/qdrant.service";

const PORT = Number(process.env.PORT) || 3004;

app.listen(PORT, async () => {
  console.log(`[CGI-242] Serveur démarré sur le port ${PORT}`);
  console.log(`[CGI-242] Environnement: ${process.env.NODE_ENV}`);

  // Initialiser la collection Qdrant (non-bloquant)
  try {
    await initializeCollection();
    console.log(`[CGI-242] Qdrant initialisé`);
  } catch (error) {
    console.warn(`[CGI-242] Qdrant non disponible:`, error);
  }
});
