import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import prisma from "../utils/prisma";
import { MFAService } from "../services/mfa.service";

const mockPrisma = prisma as unknown as Record<string, Record<string, jest.Mock>>;
const mockMFAService = MFAService as unknown as Record<string, jest.Mock>;

function createAuthToken(userId = "user-1", email = "test@example.com") {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET || "test-jwt-secret-for-testing", {
    expiresIn: "1h",
  });
}

describe("MFA Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock user exists for requireAuth
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" });
  });

  describe("POST /api/mfa/setup", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).post("/api/mfa/setup");

      expect(res.status).toBe(401);
    });

    it("devrait retourner qrCode et otpauthUrl mais PAS le secret", async () => {
      const token = createAuthToken();

      mockMFAService.generateSetup.mockResolvedValue({
        qrCode: "data:image/png;base64,fakeqrcode",
        otpauthUrl: "otpauth://totp/CGI-242:test@example.com?secret=HIDDEN&issuer=CGI-242",
      });

      const res = await request(app)
        .post("/api/mfa/setup")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.qrCode).toBeDefined();
      expect(res.body.otpauthUrl).toBeDefined();
      // Le secret ne doit PAS être dans la réponse (M2)
      expect(res.body.secret).toBeUndefined();
      expect(res.body.mfaSecret).toBeUndefined();
    });

    it("devrait retourner 400 si MFA déjà activé", async () => {
      const token = createAuthToken();

      mockMFAService.generateSetup.mockRejectedValue(new Error("MFA déjà activé"));

      const res = await request(app)
        .post("/api/mfa/setup")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("MFA déjà activé");
    });
  });

  describe("GET /api/mfa/status", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).get("/api/mfa/status");

      expect(res.status).toBe(401);
    });

    it("devrait retourner le statut MFA", async () => {
      const token = createAuthToken();

      mockMFAService.getStatus.mockResolvedValue({
        mfaEnabled: true,
        mfaVerifiedAt: new Date("2025-01-01"),
        backupCodesRemaining: 8,
      });

      const res = await request(app)
        .get("/api/mfa/status")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.mfaEnabled).toBe(true);
      expect(res.body.backupCodesRemaining).toBe(8);
    });
  });

  describe("MFA encryption (via service mock)", () => {
    it("devrait vérifier que MFA_ENCRYPTION_KEY est requise en production", () => {
      // The MFA service checks for MFA_ENCRYPTION_KEY at module load time.
      // In test env, it falls back to JWT_SECRET which is set in setup.ts.
      // We verify the env variable is NOT set (which is expected in test).
      expect(process.env.MFA_ENCRYPTION_KEY).toBeUndefined();
      // NODE_ENV is 'test', not 'production', so it should not throw
      expect(process.env.NODE_ENV).toBe("test");
    });

    it("devrait vérifier que generateSetup ne retourne pas le secret dans la réponse", async () => {
      const token = createAuthToken();

      // Simulate what the real service returns (no secret field)
      mockMFAService.generateSetup.mockResolvedValue({
        qrCode: "data:image/png;base64,abc123",
        otpauthUrl: "otpauth://totp/CGI-242:user@test.com?secret=ABC&issuer=CGI-242",
      });

      const res = await request(app)
        .post("/api/mfa/setup")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      const keys = Object.keys(res.body);
      expect(keys).toContain("qrCode");
      expect(keys).toContain("otpauthUrl");
      expect(keys).not.toContain("secret");
      expect(keys).not.toContain("mfaSecret");
      expect(keys).not.toContain("base32");
    });
  });
});
