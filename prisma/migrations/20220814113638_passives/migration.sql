-- CreateTable
CREATE TABLE "Passive" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Passive_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Passive" ADD CONSTRAINT "Passive_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
