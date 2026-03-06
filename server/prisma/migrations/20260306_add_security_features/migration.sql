-- MISS-02: Verrouillage de compte apres N tentatives echouees
ALTER TABLE "users" ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "lockedUntil" TIMESTAMP(3);

-- MISS-03: Adresse IP dans les logs d'audit
ALTER TABLE "audit_logs" ADD COLUMN "ipAddress" TEXT;

-- MISS-02: Nouvel evenement d'audit
ALTER TYPE "AuditAction" ADD VALUE 'ACCOUNT_LOCKED';
