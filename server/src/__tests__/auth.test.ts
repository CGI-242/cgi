import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import prisma from "../utils/prisma";

const mockPrisma = prisma as unknown as Record<string, Record<string, jest.Mock>>;

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("devrait créer un utilisateur et retourner 201", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.invitation.findFirst.mockResolvedValue(null);
      mockPrisma.organization.create.mockResolvedValue({ id: "org-1", name: "Test SARL", slug: "test-sarl" });
      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "Jean",
        lastName: "Dupont",
        phone: null,
        isEmailVerified: false,
      });
      mockPrisma.organizationMember.create.mockResolvedValue({});
      mockPrisma.subscription.create.mockResolvedValue({});
      mockPrisma.auditLog.create.mockResolvedValue({});

      const res = await request(app).post("/api/auth/register").send({
        entrepriseNom: "Test SARL",
        nom: "Dupont",
        prenom: "Jean",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.entreprise).toBeDefined();
    });

    it("devrait retourner 400 si des champs sont manquants", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("devrait retourner 409 si l'email existe déjà", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "existing" });

      const res = await request(app).post("/api/auth/register").send({
        entrepriseNom: "Test SARL",
        nom: "Dupont",
        prenom: "Jean",
        email: "existing@example.com",
        password: "password123",
      });

      expect(res.status).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    it("devrait retourner l'utilisateur avec OTP", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        firstName: "Jean",
        lastName: "Dupont",
        phone: null,
        isEmailVerified: true,
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.organizationMember.findFirst.mockResolvedValue({
        role: "OWNER",
        organizationId: "org-1",
        organization: { name: "Test SARL" },
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
    });

    it("devrait retourner 400 si email/password manquants", async () => {
      const res = await request(app).post("/api/auth/login").send({});

      expect(res.status).toBe(400);
    });

    it("devrait retourner 401 si identifiants incorrects", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("devrait retourner 401 sans refresh token", async () => {
      const res = await request(app).post("/api/auth/refresh-token").send({});

      expect(res.status).toBe(401);
      expect(res.body.error).toContain("Refresh token");
    });
  });

  describe("POST /api/auth/check-email", () => {
    it("devrait retourner exists: true si l'email existe", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" });

      const res = await request(app).post("/api/auth/check-email").send({
        email: "test@example.com",
      });

      expect(res.status).toBe(200);
      expect(res.body.exists).toBe(true);
    });

    it("devrait retourner exists: false si l'email n'existe pas", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post("/api/auth/check-email").send({
        email: "unknown@example.com",
      });

      expect(res.status).toBe(200);
      expect(res.body.exists).toBe(false);
    });
  });
});
