-- CreateTable
CREATE TABLE "MerchantStock" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "MerchantStock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MerchantStock" ADD CONSTRAINT "MerchantStock_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
