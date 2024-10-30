/*
  Warnings:

  - Made the column `osteopathId` on table `Cabinet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `osteopathId` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cabinetId` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Cabinet" DROP CONSTRAINT "Cabinet_osteopathId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_cabinetId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_osteopathId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_osteopathId_fkey";

-- AlterTable
ALTER TABLE "Cabinet" ALTER COLUMN "osteopathId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "contraception" TEXT,
ADD COLUMN     "currentTreatment" TEXT,
ADD COLUMN     "digestiveProblems" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "entDoctorName" TEXT,
ADD COLUMN     "entProblems" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "generalPractitioner" TEXT,
ADD COLUMN     "handedness" TEXT,
ADD COLUMN     "hasVisionCorrection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hdlm" TEXT,
ADD COLUMN     "isDeceased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSmoker" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "ophtalmologistName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "rheumatologicalHistory" TEXT,
ADD COLUMN     "surgicalHistory" TEXT,
ADD COLUMN     "traumaHistory" TEXT,
ALTER COLUMN "osteopathId" SET NOT NULL,
ALTER COLUMN "cabinetId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- AddForeignKey
ALTER TABLE "Osteopath" ADD CONSTRAINT "Osteopath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cabinet" ADD CONSTRAINT "Cabinet_osteopathId_fkey" FOREIGN KEY ("osteopathId") REFERENCES "Osteopath"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_osteopathId_fkey" FOREIGN KEY ("osteopathId") REFERENCES "Osteopath"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
