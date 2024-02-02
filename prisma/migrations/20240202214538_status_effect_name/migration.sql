/*
  Warnings:

  - Added the required column `name` to the `EnemyStatusEffect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `StatusEffect` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnemyStatusEffect" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StatusEffect" ADD COLUMN     "name" TEXT NOT NULL;
