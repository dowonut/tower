/*
  Warnings:

  - You are about to drop the `MerchantStock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MerchantStock" DROP CONSTRAINT "MerchantStock_playerId_fkey";

-- DropTable
DROP TABLE "MerchantStock";

-- CreateTable
CREATE TABLE "merchantStock" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "merchantStock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "merchantStock" ADD CONSTRAINT "merchantStock_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
