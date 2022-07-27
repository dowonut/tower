/*
  Warnings:

  - You are about to drop the column `cooldown` on the `Attack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attack" DROP COLUMN "cooldown",
ADD COLUMN     "remCooldown" INTEGER NOT NULL DEFAULT 0;
