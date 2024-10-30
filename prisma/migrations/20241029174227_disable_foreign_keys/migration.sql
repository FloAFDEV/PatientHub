/*
  Warnings:

  - You are about to drop the column `address` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `osteopathId` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Osteopath` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Osteopath` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cabinet" DROP CONSTRAINT "Cabinet_osteopathId_fkey";

-- DropForeignKey
ALTER TABLE "Osteopath" DROP CONSTRAINT "Osteopath_userId_fkey";

-- AlterTable
ALTER TABLE "Cabinet" DROP COLUMN "address",
DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "osteopathId",
DROP COLUMN "phone",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Osteopath" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_osteopathId_fkey" FOREIGN KEY ("osteopathId") REFERENCES "Osteopath"("id") ON DELETE SET NULL ON UPDATE CASCADE;
