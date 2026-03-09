import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import prisma from "../utils/prisma";
import * as subscriptionService from "../services/subscription.service";
import { cacheService } from "../utils/cache";

const mockPrisma = prisma as unknown as Record<string, Record<string, jest.Mock>>;
const mockSubscriptionService = subscriptionService as unknown as Record<string, jest.Mock>;

function createAuthToken(userId = "user-1", email = "test@example.com") {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET || "test-jwt-secret-for-testing", {
    expiresIn: "1h",
  });
}

/**
 * Helper to set up auth + tenant middleware mocks.
 * The subscription routes require: requireAuth -> resolveTenant -> requireOrg
 * resolveTenant reads X-Organization-ID header and calls organizationMember.findUnique
 */
function setupTenantMocks(role = "OWNER") {
  // requireAuth: user exists
  mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" });

  // resolveTenant: member found with organization
  mockPrisma.organizationMember.findUnique.mockResolvedValue({
    userId: "user-1",
    organizationId: "org-1",
    role,
    permissions: null,
    organization: { id: "org-1", name: "Test SARL", deletedAt: null },
  });
}

describe("Subscription Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear tenant cache to avoid stale role data between tests
    cacheService.clear();
  });

  describe("GET /api/subscription/quota", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).get("/api/subscription/quota");

      expect(res.status).toBe(401);
    });

    it("devrait retourner 400 sans header X-Organization-ID", async () => {
      const token = createAuthToken();
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" });

      const res = await request(app)
        .get("/api/subscription/quota")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("X-Organization-ID");
    });

    it("devrait retourner les informations de quota", async () => {
      const token = createAuthToken();
      setupTenantMocks("MEMBER");

      mockSubscriptionService.checkQuota.mockResolvedValue({
        plan: "PRO",
        questionsUsed: 5,
        questionsLimit: 100,
        remaining: 95,
        percentUsed: 5,
      });

      const res = await request(app)
        .get("/api/subscription/quota")
        .set("Authorization", `Bearer ${token}`)
        .set("X-Organization-ID", "org-1");

      expect(res.status).toBe(200);
      expect(res.body.plan).toBe("PRO");
      expect(res.body.questionsUsed).toBe(5);
      expect(res.body.remaining).toBe(95);
    });

    it("devrait retourner 404 si abonnement introuvable", async () => {
      const token = createAuthToken();
      setupTenantMocks("MEMBER");

      mockSubscriptionService.checkQuota.mockRejectedValue(
        new Error("Abonnement introuvable")
      );

      const res = await request(app)
        .get("/api/subscription/quota")
        .set("Authorization", `Bearer ${token}`)
        .set("X-Organization-ID", "org-1");

      expect(res.status).toBe(404);
      expect(res.body.error).toContain("introuvable");
    });
  });

  describe("POST /api/subscription/upgrade", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app)
        .post("/api/subscription/upgrade")
        .send({ plan: "PRO" });

      expect(res.status).toBe(401);
    });

    it("devrait retourner 400 si le plan est invalide", async () => {
      const token = createAuthToken();
      setupTenantMocks("OWNER");

      const res = await request(app)
        .post("/api/subscription/upgrade")
        .set("Authorization", `Bearer ${token}`)
        .set("X-Organization-ID", "org-1")
        .send({ plan: "INVALID_PLAN" });

      expect(res.status).toBe(400);
    });

    it("devrait retourner 400 sans paramètre plan", async () => {
      const token = createAuthToken();
      setupTenantMocks("OWNER");

      const res = await request(app)
        .post("/api/subscription/upgrade")
        .set("Authorization", `Bearer ${token}`)
        .set("X-Organization-ID", "org-1")
        .send({});

      expect(res.status).toBe(400);
    });

    it("devrait upgrader l'abonnement avec un plan valide", async () => {
      const token = createAuthToken();
      setupTenantMocks("OWNER");

      mockSubscriptionService.upgradePlan.mockResolvedValue({
        id: "sub-1",
        plan: "PRO",
        status: "ACTIVE",
        organizationId: "org-1",
      });

      const res = await request(app)
        .post("/api/subscription/upgrade")
        .set("Authorization", `Bearer ${token}`)
        .set("X-Organization-ID", "org-1")
        .send({ plan: "PRO" });

      expect(res.status).toBe(200);
      expect(res.body.plan).toBe("PRO");
    });

    it("devrait retourner 403 si le rôle n'est pas OWNER", async () => {
      const token = createAuthToken();
      setupTenantMocks("MEMBER");

      const res = await request(app)
        .post("/api/subscription/upgrade")
        .set("Authorization", `Bearer ${token}`)
        .set("X-Organization-ID", "org-1")
        .send({ plan: "PRO" });

      expect(res.status).toBe(403);
    });
  });
});
