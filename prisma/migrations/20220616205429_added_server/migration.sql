-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "serverId" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT E'-',

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_serverId_key" ON "Server"("serverId");
