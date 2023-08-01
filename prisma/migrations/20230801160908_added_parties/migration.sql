-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_encounterId_fkey";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "partyId" INTEGER;

-- CreateTable
CREATE TABLE "Party" (
    "id" SERIAL NOT NULL,
    "leader" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Party_name_key" ON "Party"("name");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;
