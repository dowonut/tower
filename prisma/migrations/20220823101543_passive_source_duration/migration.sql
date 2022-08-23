-- AlterTable
ALTER TABLE "Passive" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'skill';
