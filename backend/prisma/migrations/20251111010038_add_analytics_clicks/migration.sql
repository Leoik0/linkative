-- CreateTable
CREATE TABLE "Click" (
    "id" SERIAL NOT NULL,
    "linkId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "city" TEXT,
    "country" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Click_linkId_timestamp_idx" ON "Click"("linkId", "timestamp");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
