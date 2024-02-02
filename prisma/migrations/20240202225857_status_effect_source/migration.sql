/*
  Warnings:

  - Added the required column `sourceId` to the `EnemyStatusEffect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `StatusEffect` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnemyStatusEffect" ADD COLUMN     "sourceId" INTEGER NOT NULL,
ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'player';

-- AlterTable
ALTER TABLE "StatusEffect" ADD COLUMN     "sourceId" INTEGER NOT NULL,
ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'enemy';
