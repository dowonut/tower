-- CreateTable
CREATE TABLE "enemyAttack" (
    "id" SERIAL NOT NULL,
    "enemyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "remCooldown" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "enemyAttack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "enemyAttack" ADD CONSTRAINT "enemyAttack_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "Enemy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
