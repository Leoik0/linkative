/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_slug_key" ON "Admin"("slug");
