-- AlterTable: ajouter colonne pays sur organizations
ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "pays" TEXT NOT NULL DEFAULT '242';
