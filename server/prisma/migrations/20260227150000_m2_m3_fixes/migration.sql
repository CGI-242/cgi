-- M2: Ajouter tokenRevokedAt pour persister la révocation globale des sessions
ALTER TABLE "users" ADD COLUMN "tokenRevokedAt" TIMESTAMP(3);

-- M3: Ajouter les actions d'audit manquantes
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'REGISTER';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'PASSWORD_RESET_REQUESTED';
