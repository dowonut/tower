/*
  Warnings:

  - You are about to drop the column `unlockedCommands` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "unlockedCommands";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "unlockedCommands" TEXT[];
