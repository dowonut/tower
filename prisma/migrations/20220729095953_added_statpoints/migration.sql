/*
  Warnings:

  - You are about to drop the column `skillpoints` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "skillpoints",
ADD COLUMN     "statpoints" INTEGER NOT NULL DEFAULT 0;
