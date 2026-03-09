import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/requireAdmin";
import prisma from "../utils/prisma";

const mockPrisma = prisma as unknown as Record<string, Record<string, jest.Mock>>;

describe("Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("asyncHandler", () => {
    it("devrait attraper les erreurs et retourner 500", async () => {
      const handler = asyncHandler(async () => {
        throw new Error("Test error");
      });

      const req = { method: "GET", path: "/test" } as Request;
      const res = {
        headersSent: false,
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      handler(req as any, res, next);

      // Wait for promise to resolve
      await new Promise((r) => setTimeout(r, 50));

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });

    it("ne devrait pas envoyer de réponse si les headers sont déjà envoyés", async () => {
      const handler = asyncHandler(async () => {
        throw new Error("Test error");
      });

      const req = { method: "GET", path: "/test" } as Request;
      const res = {
        headersSent: true,
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      handler(req as any, res, next);

      await new Promise((r) => setTimeout(r, 50));

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("devrait appeler le handler normalement sans erreur", async () => {
      const mockFn = jest.fn().mockResolvedValue(undefined);
      const handler = asyncHandler(mockFn);

      const req = { method: "GET", path: "/test" } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      handler(req as any, res, next);

      await new Promise((r) => setTimeout(r, 50));

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe("requireAdmin", () => {
    it("devrait retourner 401 si pas de userId", async () => {
      const req = { userId: undefined } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Authentification requise" });
      expect(next).not.toHaveBeenCalled();
    });

    it("devrait retourner 401 si l'utilisateur n'existe pas", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const req = { userId: "user-1" } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Utilisateur introuvable" });
      expect(next).not.toHaveBeenCalled();
    });

    it("devrait retourner 403 si l'utilisateur n'est pas ADMIN", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        role: "USER",
      });

      const req = {
        userId: "user-1",
        originalUrl: "/api/admin/test",
        headers: {},
        connection: { remoteAddress: "127.0.0.1" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Acces refuse — droits administrateur requis",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("devrait appeler next() si l'utilisateur est ADMIN", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "admin@example.com",
        role: "ADMIN",
      });

      const req = { userId: "user-1" } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
