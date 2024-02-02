/*
  Warnings:

  - You are about to drop the column `duration` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Passive` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Passive" DROP COLUMN "duration",
DROP COLUMN "source",
DROP COLUMN "target",
DROP COLUMN "type",
DROP COLUMN "value",
ADD COLUMN     "data" JSONB,
ADD COLUMN     "remDuration" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "preEncounter" JSONB;
