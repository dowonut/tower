-- AlterTable
ALTER TABLE "Dungeon" ADD COLUMN     "completedTiles" JSONB[],
ADD COLUMN     "discoveredTiles" JSONB[];
