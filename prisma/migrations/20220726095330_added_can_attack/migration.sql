/*
  Warnings:

  - You are about to drop the column `enemyType` on the `Enemy` table. All the data in the column will be lost.
  - Added the required column `name` to the `Enemy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enemy" DROP COLUMN "enemyType",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "canAttack" BOOLEAN NOT NULL DEFAULT true;
