-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "childrenAges" INTEGER[],
ADD COLUMN     "hasChildren" BOOLEAN NOT NULL DEFAULT false;
