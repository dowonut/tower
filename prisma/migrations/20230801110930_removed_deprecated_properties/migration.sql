/*
  Warnings:

  - You are about to drop the column `fighting` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `inCombat` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "fighting",
DROP COLUMN "inCombat";
