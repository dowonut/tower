/*
  Warnings:

  - Added the required column `time` to the `Craft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Craft" ADD COLUMN     "time" INTEGER NOT NULL;
