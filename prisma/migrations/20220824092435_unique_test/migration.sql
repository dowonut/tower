/*
  Warnings:

  - A unique constraint covering the columns `[playerId,source,name,target,modifier,value,duration]` on the table `Passive` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Passive_playerId_source_name_target_modifier_value_duration_key" ON "Passive"("playerId", "source", "name", "target", "modifier", "value", "duration");
