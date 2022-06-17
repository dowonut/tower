-- AlterTable
ALTER TABLE "Enemy" ADD COLUMN     "fighting" INTEGER,
ALTER COLUMN "enemyType" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "fighting" INTEGER;
