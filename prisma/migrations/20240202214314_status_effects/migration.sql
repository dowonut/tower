/*
  Warnings:

  - You are about to drop the `Passive` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Passive" DROP CONSTRAINT "Passive_playerId_fkey";

-- DropTable
DROP TABLE "Passive";

-- CreateTable
CREATE TABLE "StatusEffect" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "remDuration" INTEGER,
    "data" JSONB,

    CONSTRAINT "StatusEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnemyStatusEffect" (
    "id" SERIAL NOT NULL,
    "enemyId" INTEGER NOT NULL,
    "remDuration" INTEGER,
    "data" JSONB,

    CONSTRAINT "EnemyStatusEffect_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StatusEffect" ADD CONSTRAINT "StatusEffect_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnemyStatusEffect" ADD CONSTRAINT "EnemyStatusEffect_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "Enemy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
