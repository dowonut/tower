/*
  Warnings:

  - Added the required column `name` to the `Dungeon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dungeon" ADD COLUMN     "name" TEXT NOT NULL;
