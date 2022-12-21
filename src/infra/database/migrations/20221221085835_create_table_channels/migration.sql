-- CreateTable
CREATE TABLE "channels" (
    "channel_id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "password" TEXT,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("channel_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channels_owner_id_key" ON "channels"("owner_id");
