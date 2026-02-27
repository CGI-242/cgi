import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CGI-242 API",
      version: "1.0.0",
      description:
        "API REST du Code Général des Impôts du Congo — Intelligence Fiscale IA",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentification et gestion de session" },
      { name: "MFA", description: "Authentification multi-facteurs (2FA/TOTP)" },
      { name: "Chat", description: "Chat IA fiscal avec streaming SSE" },
      { name: "Organizations", description: "Gestion des organisations (tenants)" },
      { name: "Subscriptions", description: "Abonnements et quotas" },
      { name: "Permissions", description: "Permissions granulaires par membre" },
      { name: "Analytics", description: "Tableaux de bord et statistiques" },
      { name: "Audit", description: "Journal d'audit et conformité" },
      { name: "Alertes", description: "Alertes et échéances fiscales" },
      { name: "User", description: "Profil utilisateur" },
      { name: "Admin", description: "Administration plateforme" },
      { name: "Search History", description: "Historique de recherche" },
      { name: "Ingestion", description: "Ingestion d'articles CGI" },
      { name: "Notifications", description: "Notifications push" },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
