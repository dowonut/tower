/*
  Warnings:

  - You are about to drop the column `canAttack` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attack" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "canAttack";
