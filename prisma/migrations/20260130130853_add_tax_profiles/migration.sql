-- AlterTable
ALTER TABLE "PriceBook" ADD COLUMN     "taxProfileId" TEXT;

-- CreateTable
CREATE TABLE "TaxProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "country" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxProfileRate" (
    "id" TEXT NOT NULL,
    "taxProfileId" TEXT NOT NULL,
    "taxRateId" TEXT NOT NULL,

    CONSTRAINT "TaxProfileRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaxProfile_isActive_idx" ON "TaxProfile"("isActive");

-- CreateIndex
CREATE INDEX "TaxProfileRate_taxRateId_idx" ON "TaxProfileRate"("taxRateId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxProfileRate_taxProfileId_taxRateId_key" ON "TaxProfileRate"("taxProfileId", "taxRateId");

-- AddForeignKey
ALTER TABLE "PriceBook" ADD CONSTRAINT "PriceBook_taxProfileId_fkey" FOREIGN KEY ("taxProfileId") REFERENCES "TaxProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxProfileRate" ADD CONSTRAINT "TaxProfileRate_taxProfileId_fkey" FOREIGN KEY ("taxProfileId") REFERENCES "TaxProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxProfileRate" ADD CONSTRAINT "TaxProfileRate_taxRateId_fkey" FOREIGN KEY ("taxRateId") REFERENCES "TaxRate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
