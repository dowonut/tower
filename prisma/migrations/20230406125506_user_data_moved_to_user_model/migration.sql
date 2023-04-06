/*
  Warnings:

  - You are about to drop the column `discordId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `discriminator` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `pfp` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Player` table. All the data in the column will be lost.
  - Added the required column `guildId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discriminator` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pfp` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Player_discordId_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "discordId",
DROP COLUMN "discriminator",
DROP COLUMN "pfp",
DROP COLUMN "username",
ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discriminator" TEXT NOT NULL,
ADD COLUMN     "pfp" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
