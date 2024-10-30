/*
  Warnings:

  - The `contraception` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `handedness` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Handedness" AS ENUM ('LEFT', 'RIGHT', 'AMBIDEXTROUS');

-- CreateEnum
CREATE TYPE "Contraception" AS ENUM ('NONE', 'PILLS', 'CONDOM', 'IMPLANTS');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "contraception",
ADD COLUMN     "contraception" "Contraception",
DROP COLUMN "handedness",
ADD COLUMN     "handedness" "Handedness";

-- DropEnum
DROP TYPE "handedness";
