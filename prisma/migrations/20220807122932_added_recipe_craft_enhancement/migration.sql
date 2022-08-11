/*
  Warnings:

  - You are about to drop the `merchantStock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "merchantStock" DROP CONSTRAINT "merchantStock_playerId_fkey";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "crafted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "damage" INTEGER,
ADD COLUMN     "damageType" INTEGER;

-- DropTable
DROP TABLE "merchantStock";

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Craft" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "started" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Craft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enhancement" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Enhancement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantStock" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,

    CONSTRAINT "MerchantStock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enhancement" ADD CONSTRAINT "Enhancement_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantStock" ADD CONSTRAINT "MerchantStock_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
