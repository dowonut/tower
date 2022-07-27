-- CreateTable
CREATE TABLE "Attack" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cooldown" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Attack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
