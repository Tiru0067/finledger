/*
  Warnings:

  - The primary key for the `records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `records` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "records" DROP CONSTRAINT "records_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "records_pkey" PRIMARY KEY ("id");
