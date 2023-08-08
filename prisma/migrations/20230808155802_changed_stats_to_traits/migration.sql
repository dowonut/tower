/*
  Warnings:

  - You are about to drop the column `statpoints` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "statpoints",
ADD COLUMN     "traitPoints" INTEGER NOT NULL DEFAULT 0;
