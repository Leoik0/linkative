-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "lastPaymentId" TEXT,
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "planUntil" TIMESTAMP(3);
