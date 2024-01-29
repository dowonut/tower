/*
  Warnings:

  - You are about to drop the column `lastAttackMessageId` on the `Encounter` table. All the data in the column will be lost.
  - You are about to drop the `Attack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attack" DROP CONSTRAINT "Attack_playerId_fkey";

-- AlterTable
ALTER TABLE "Encounter" DROP COLUMN "lastAttackMessageId",
ADD COLUMN     "lastActionMessageId" TEXT;

-- DropTable
DROP TABLE "Attack";

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "remCooldown" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Action_playerId_name_key" ON "Action"("playerId", "name");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
