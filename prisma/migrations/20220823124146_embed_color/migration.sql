/*
  Warnings:

  - You are about to drop the column `embedColor` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "embedColor",
ADD COLUMN     "embed_color" TEXT NOT NULL DEFAULT '2f3136';
