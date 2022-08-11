/*
  Warnings:

  - Added the required column `playerId` to the `Craft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Craft" ADD COLUMN     "playerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
