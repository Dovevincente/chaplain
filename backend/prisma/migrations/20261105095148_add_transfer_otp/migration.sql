-- CreateEnum
CREATE TYPE "ResidencyStatus" AS ENUM ('RESIDENT', 'NON_RESIDENT');

-- CreateEnum
CREATE TYPE "TransferOtpChannel" AS ENUM ('EMAIL', 'PHONE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AccountType" ADD VALUE 'NON_RESIDENT';
ALTER TYPE "AccountType" ADD VALUE 'DOMICILIARY';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "residencyStatus" "ResidencyStatus";

-- CreateTable
CREATE TABLE "TransferOtpChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "TransferOtpChannel" NOT NULL,
    "otpHash" TEXT NOT NULL,
    "transferPayloadHash" TEXT NOT NULL,
    "destinationSnapshot" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "verifiedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferOtpChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransferOtpChallenge_userId_idx" ON "TransferOtpChallenge"("userId");

-- CreateIndex
CREATE INDEX "TransferOtpChallenge_expiresAt_idx" ON "TransferOtpChallenge"("expiresAt");

-- CreateIndex
CREATE INDEX "TransferOtpChallenge_consumedAt_idx" ON "TransferOtpChallenge"("consumedAt");

-- CreateIndex
CREATE INDEX "TransferOtpChallenge_userId_createdAt_idx" ON "TransferOtpChallenge"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "TransferOtpChallenge" ADD CONSTRAINT "TransferOtpChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
