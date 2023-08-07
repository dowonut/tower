/*
  Warnings:

  - You are about to drop the column `damage` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `damageType` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `modifier` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `defence` on the `Player` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Passive_playerId_source_name_target_modifier_value_duration_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "damage",
DROP COLUMN "damageType",
ADD COLUMN     "grade" TEXT NOT NULL DEFAULT 'common',
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "materials" TEXT[] DEFAULT ARRAY['steel']::TEXT[];

-- AlterTable
ALTER TABLE "Passive" DROP COLUMN "modifier",
DROP COLUMN "name",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'flat',
ALTER COLUMN "source" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "defence",
ADD COLUMN     "defense" INTEGER NOT NULL DEFAULT 0;
