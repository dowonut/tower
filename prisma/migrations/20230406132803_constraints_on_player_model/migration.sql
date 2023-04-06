/*
  Warnings:

  - A unique constraint covering the columns `[guildId,userId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_guildId_userId_key" ON "Player"("guildId", "userId");
