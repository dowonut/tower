/*
  Warnings:

  - You are about to drop the column `currentPlayer` on the `Party` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "currentPlayer" INTEGER;

-- AlterTable
ALTER TABLE "Party" DROP COLUMN "currentPlayer";
