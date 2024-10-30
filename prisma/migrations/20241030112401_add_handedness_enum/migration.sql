/*
  Warnings:

  - The `handedness` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "handedness" AS ENUM ('LEFT', 'RIGHT', 'AMBIDEXTROUS');

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "handedness",
ADD COLUMN     "handedness" "handedness";
