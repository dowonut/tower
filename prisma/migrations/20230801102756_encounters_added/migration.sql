/*
  Warnings:

  - You are about to drop the column `fighting` on the `Enemy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enemy" DROP COLUMN "fighting",
ADD COLUMN     "encounterId" INTEGER;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "encounterId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "embed_color" SET DEFAULT '2b2d31';

-- CreateTable
CREATE TABLE "Encounter" (
    "id" SERIAL NOT NULL,
    "turnsPassed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enemy" ADD CONSTRAINT "Enemy_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
