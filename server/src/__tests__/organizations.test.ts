import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import prisma from "../utils/prisma";

const mockPrisma = prisma as unknown as Record<string, Record<string, jest.Mock>>;

function createAuthToken(userId = "user-1", email = "test@example.com") {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET || "test-jwt-secret-for-testing", {
    expiresIn: "1h",
  });
}

describe("Organization Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/organizations", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).get("/api/organizations");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/organizations", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app)
        .post("/api/organizations")
        .send({ name: "Test Org" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/organizations/:id", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).get("/api/organizations/org-1");

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/organizations/:id", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app)
        .put("/api/organizations/org-1")
        .send({ name: "Updated" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/organizations/:id", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).delete("/api/organizations/org-1");

      expect(res.status).toBe(401);
    });
  });
});
