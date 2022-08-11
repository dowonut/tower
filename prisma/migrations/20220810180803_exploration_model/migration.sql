/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enemyType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "enemyType";

-- CreateTable
CREATE TABLE "Exploration" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Exploration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exploration" ADD CONSTRAINT "Exploration_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
