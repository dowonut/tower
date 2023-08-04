/*
  Warnings:

  - A unique constraint covering the columns `[playerId,name]` on the table `Attack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId,name]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enemyId,name]` on the table `enemyAttack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attack_playerId_name_key" ON "Attack"("playerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_playerId_name_key" ON "Recipe"("playerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "enemyAttack_enemyId_name_key" ON "enemyAttack"("enemyId", "name");
