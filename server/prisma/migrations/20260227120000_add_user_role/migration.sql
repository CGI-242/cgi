-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Promote existing admin (from ADMIN_EMAIL env var) if set
-- This is a one-time migration; the app will use the role field going forward.
-- Run manually after migration if needed:
-- UPDATE "users" SET "role" = 'ADMIN' WHERE "email" = 'your-admin@email.com';
