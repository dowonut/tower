/*
  Warnings:

  - Added the required column `category` to the `MerchantStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `MerchantStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MerchantStock" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "floor" INTEGER NOT NULL;
