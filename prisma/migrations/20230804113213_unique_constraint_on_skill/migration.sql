/*
  Warnings:

  - A unique constraint covering the columns `[playerId,name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Skill_playerId_name_key" ON "Skill"("playerId", "name");
