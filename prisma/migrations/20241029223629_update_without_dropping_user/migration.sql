/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_cabinetId_fkey";

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "cabinetId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone";

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
