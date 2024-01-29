/*
  Warnings:

  - You are about to drop the `enemyAttack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "enemyAttack" DROP CONSTRAINT "enemyAttack_enemyId_fkey";

-- DropTable
DROP TABLE "enemyAttack";

-- CreateTable
CREATE TABLE "EnemyAction" (
    "id" SERIAL NOT NULL,
    "enemyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "remCooldown" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EnemyAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnemyAction_enemyId_name_key" ON "EnemyAction"("enemyId", "name");

-- AddForeignKey
ALTER TABLE "EnemyAction" ADD CONSTRAINT "EnemyAction_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "Enemy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
