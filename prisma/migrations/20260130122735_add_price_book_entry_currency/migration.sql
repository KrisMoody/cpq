-- CreateTable
CREATE TABLE "PriceBookEntryCurrency" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "listPrice" DECIMAL(10,2) NOT NULL,
    "cost" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceBookEntryCurrency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceBookEntryCurrency_currencyId_idx" ON "PriceBookEntryCurrency"("currencyId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceBookEntryCurrency_entryId_currencyId_key" ON "PriceBookEntryCurrency"("entryId", "currencyId");

-- AddForeignKey
ALTER TABLE "PriceBookEntryCurrency" ADD CONSTRAINT "PriceBookEntryCurrency_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "PriceBookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceBookEntryCurrency" ADD CONSTRAINT "PriceBookEntryCurrency_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
