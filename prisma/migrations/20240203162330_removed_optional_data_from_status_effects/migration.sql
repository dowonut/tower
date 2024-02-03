/*
  Warnings:

  - You are about to drop the column `data` on the `EnemyStatusEffect` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `StatusEffect` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EnemyStatusEffect" DROP COLUMN "data";

-- AlterTable
ALTER TABLE "StatusEffect" DROP COLUMN "data";
