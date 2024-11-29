/*
  Warnings:

  - You are about to drop the column `contraception` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `currentTreatment` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `digestiveDoctorName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `digestiveProblems` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `entDoctorName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `entProblems` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `generalPractitioner` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `handedness` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `hasVisionCorrection` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `hdlm` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `isDeceased` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `isSmoker` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `ophtalmologistName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `rheumatologicalHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `surgicalHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `traumaHistory` on the `Patient` table. All the data in the column will be lost.
  - The `hasChildren` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `firstName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'CANCELED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AppointmentStatus" ADD VALUE 'NO_SHOW';
ALTER TYPE "AppointmentStatus" ADD VALUE 'RESCHEDULED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Contraception" ADD VALUE 'DIAPHRAGM';
ALTER TYPE "Contraception" ADD VALUE 'IUD';
ALTER TYPE "Contraception" ADD VALUE 'INJECTION';
ALTER TYPE "Contraception" ADD VALUE 'PATCH';
ALTER TYPE "Contraception" ADD VALUE 'RING';
ALTER TYPE "Contraception" ADD VALUE 'NATURAL_METHODS';
ALTER TYPE "Contraception" ADD VALUE 'STERILIZATION';

-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'Other';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MaritalStatus" ADD VALUE 'ENGAGED';
ALTER TYPE "MaritalStatus" ADD VALUE 'PARTNERED';

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "isCancelled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "contraception",
DROP COLUMN "currentTreatment",
DROP COLUMN "digestiveDoctorName",
DROP COLUMN "digestiveProblems",
DROP COLUMN "entDoctorName",
DROP COLUMN "entProblems",
DROP COLUMN "gender",
DROP COLUMN "generalPractitioner",
DROP COLUMN "handedness",
DROP COLUMN "hasVisionCorrection",
DROP COLUMN "hdlm",
DROP COLUMN "isDeceased",
DROP COLUMN "isSmoker",
DROP COLUMN "name",
DROP COLUMN "occupation",
DROP COLUMN "ophtalmologistName",
DROP COLUMN "rheumatologicalHistory",
DROP COLUMN "surgicalHistory",
DROP COLUMN "traumaHistory",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION,
DROP COLUMN "hasChildren",
ADD COLUMN     "hasChildren" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "consultationId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentHistory" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "consultationId" INTEGER NOT NULL,

    CONSTRAINT "TreatmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_consultationId_key" ON "Invoice"("consultationId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentHistory" ADD CONSTRAINT "TreatmentHistory_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
