/*
  Warnings:

  - You are about to drop the column `address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `contraception` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `currentTreatment` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `digestiveProblems` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `entDoctorName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `entProblems` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `generalPractitioner` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `handedness` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `hasVisionCorrection` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `hdlm` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `isDeceased` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `isSmoker` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `ophtalmologistName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `rheumatologicalHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `surgicalHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `traumaHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Cabinet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Cabinet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Cabinet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Osteopath` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Osteopath` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_cabinetId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_osteopathId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_osteopathId_fkey";

-- AlterTable
ALTER TABLE "Cabinet" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "osteopathId" INTEGER,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Osteopath" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "address",
DROP COLUMN "avatarUrl",
DROP COLUMN "birthDate",
DROP COLUMN "contraception",
DROP COLUMN "currentTreatment",
DROP COLUMN "digestiveProblems",
DROP COLUMN "email",
DROP COLUMN "entDoctorName",
DROP COLUMN "entProblems",
DROP COLUMN "gender",
DROP COLUMN "generalPractitioner",
DROP COLUMN "handedness",
DROP COLUMN "hasVisionCorrection",
DROP COLUMN "hdlm",
DROP COLUMN "isDeceased",
DROP COLUMN "isSmoker",
DROP COLUMN "maritalStatus",
DROP COLUMN "occupation",
DROP COLUMN "ophtalmologistName",
DROP COLUMN "phone",
DROP COLUMN "rheumatologicalHistory",
DROP COLUMN "surgicalHistory",
DROP COLUMN "traumaHistory",
ALTER COLUMN "osteopathId" DROP NOT NULL,
ALTER COLUMN "cabinetId" DROP NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "osteopathId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_osteopathId_fkey" FOREIGN KEY ("osteopathId") REFERENCES "Osteopath"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cabinet" ADD CONSTRAINT "Cabinet_osteopathId_fkey" FOREIGN KEY ("osteopathId") REFERENCES "Osteopath"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_osteopathId_fkey" FOREIGN KEY ("osteopathId") REFERENCES "Osteopath"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
