/*
  Warnings:

  - You are about to drop the column `type` on the `Passive` table. All the data in the column will be lost.
  - Added the required column `target` to the `Passive` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Passive" DROP COLUMN "type",
ADD COLUMN     "target" TEXT NOT NULL;
