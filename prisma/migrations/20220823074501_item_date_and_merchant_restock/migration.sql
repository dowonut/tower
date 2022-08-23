-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "added" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MerchantStock" ADD COLUMN     "restocked" INTEGER;
