/*
  Warnings:

  - The `maritalStatus` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED');

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus";
