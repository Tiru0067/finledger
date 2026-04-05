/*
  Warnings:

  - Changed the type of `category` on the `records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('revenue', 'salary', 'operations', 'marketing', 'utilities', 'rent', 'travel', 'equipment', 'taxes', 'other');

-- AlterTable
ALTER TABLE "records" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;
