/*
  Warnings:

  - You are about to drop the column `SV` on the `Enemy` table. All the data in the column will be lost.
  - You are about to drop the column `SV` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enemy" DROP COLUMN "SV";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "SV";
