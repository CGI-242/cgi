import { Router } from "express";
import multer from "multer";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { resolveTenant } from "../middleware/tenant.middleware";
import { checkQuestionQuota } from "../middleware/subscription.middleware";
import { analyzeInvoice } from "../services/audit-facture.service";
import { createLogger } from "../utils/logger";

const logger = createLogger("AuditFacture");
const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format non supporte. Utilisez PDF, JPEG ou PNG."));
    }
  },
});

router.post(
  "/",
  requireAuth,
  resolveTenant,
  checkQuestionQuota,
  upload.single("file"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier fourni" });
      }

      logger.info(`Audit facture demande par user ${req.userId}, fichier: ${req.file.originalname} (${req.file.mimetype}, ${(req.file.size / 1024).toFixed(0)} Ko)`);

      const result = await analyzeInvoice(req.file.buffer, req.file.mimetype);

      return res.json(result);
    } catch (err: any) {
      logger.error("Erreur audit facture:", err.message);
      return res.status(500).json({ error: "Erreur lors de l'analyse de la facture" });
    }
  }
);

export default router;
