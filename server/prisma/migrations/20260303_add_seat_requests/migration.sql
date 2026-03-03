-- CreateEnum
CREATE TYPE "SeatRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "seat_requests" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "additionalSeats" INTEGER NOT NULL,
    "currentSeats" INTEGER NOT NULL,
    "totalSeatsAfter" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "plan" TEXT NOT NULL,
    "status" "SeatRequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seat_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seat_requests_organizationId_idx" ON "seat_requests"("organizationId");

-- CreateIndex
CREATE INDEX "seat_requests_status_idx" ON "seat_requests"("status");

-- AddForeignKey
ALTER TABLE "seat_requests" ADD CONSTRAINT "seat_requests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat_requests" ADD CONSTRAINT "seat_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
