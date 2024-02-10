-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "dungeonId" INTEGER;

-- CreateTable
CREATE TABLE "Dungeon" (
    "id" SERIAL NOT NULL,
    "structure" JSONB NOT NULL,
    "discordMessageId" TEXT,
    "discordChannelId" TEXT,
    "x" INTEGER NOT NULL DEFAULT 1,
    "y" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Dungeon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_dungeonId_fkey" FOREIGN KEY ("dungeonId") REFERENCES "Dungeon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
