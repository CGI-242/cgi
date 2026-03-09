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

describe("Search History Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock user exists for requireAuth
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" });
  });

  describe("GET /api/search-history", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).get("/api/search-history");

      expect(res.status).toBe(401);
    });

    it("devrait retourner les résultats paginés", async () => {
      const token = createAuthToken();
      const mockSearches = [
        { id: "s-1", query: "TVA", createdAt: new Date(), article: null },
        { id: "s-2", query: "impôt", createdAt: new Date(), article: { id: "a-1", numero: "200", titre: "Article 200" } },
      ];

      mockPrisma.searchHistory.findMany.mockResolvedValue(mockSearches);
      mockPrisma.searchHistory.count.mockResolvedValue(2);

      const res = await request(app)
        .get("/api/search-history?page=1&limit=20")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.searches).toHaveLength(2);
      expect(res.body.total).toBe(2);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(20);
    });

    it("devrait utiliser la pagination par défaut", async () => {
      const token = createAuthToken();

      mockPrisma.searchHistory.findMany.mockResolvedValue([]);
      mockPrisma.searchHistory.count.mockResolvedValue(0);

      const res = await request(app)
        .get("/api/search-history")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.searches).toEqual([]);
      expect(res.body.total).toBe(0);
    });
  });

  describe("GET /api/search-history/popular", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).get("/api/search-history/popular");

      expect(res.status).toBe(401);
    });

    it("devrait retourner les recherches populaires", async () => {
      const token = createAuthToken();
      const mockPopular = [
        { query: "TVA", _count: { query: 15 } },
        { query: "impôt", _count: { query: 10 } },
        { query: "déduction", _count: { query: 5 } },
      ];

      mockPrisma.searchHistory.groupBy.mockResolvedValue(mockPopular);

      const res = await request(app)
        .get("/api/search-history/popular")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.popular).toHaveLength(3);
      expect(res.body.popular[0]).toEqual({ query: "TVA", count: 15 });
      expect(res.body.popular[1]).toEqual({ query: "impôt", count: 10 });
    });
  });

  describe("DELETE /api/search-history", () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await request(app).delete("/api/search-history");

      expect(res.status).toBe(401);
    });

    it("devrait purger l'historique et retourner le compte", async () => {
      const token = createAuthToken();

      mockPrisma.searchHistory.deleteMany.mockResolvedValue({ count: 42 });

      const res = await request(app)
        .delete("/api/search-history")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Historique supprimé");
      expect(res.body.count).toBe(42);
    });
  });
});
