/*
  Warnings:

  - You are about to drop the column `search_vector` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TierType" ADD VALUE 'GRADUATED';
ALTER TYPE "TierType" ADD VALUE 'VOLUME_DISCOUNT_PERCENT';

-- DropIndex
DROP INDEX "product_search_idx";

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "AttributeGroup" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "PriceBook" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "PriceTier" ADD COLUMN     "discountPercent" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "search_vector",
ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ProductAffinity" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Questionnaire" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "QuoteLayout" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TaxRate" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "UnitOfMeasure" ADD COLUMN     "introducedInPhase" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Attribute_introducedInPhase_idx" ON "Attribute"("introducedInPhase");

-- CreateIndex
CREATE INDEX "AttributeGroup_introducedInPhase_idx" ON "AttributeGroup"("introducedInPhase");

-- CreateIndex
CREATE INDEX "Contract_introducedInPhase_idx" ON "Contract"("introducedInPhase");

-- CreateIndex
CREATE INDEX "Customer_introducedInPhase_idx" ON "Customer"("introducedInPhase");

-- CreateIndex
CREATE INDEX "Discount_introducedInPhase_idx" ON "Discount"("introducedInPhase");

-- CreateIndex
CREATE INDEX "PriceBook_introducedInPhase_idx" ON "PriceBook"("introducedInPhase");

-- CreateIndex
CREATE INDEX "Product_introducedInPhase_idx" ON "Product"("introducedInPhase");

-- CreateIndex
CREATE INDEX "ProductAffinity_introducedInPhase_idx" ON "ProductAffinity"("introducedInPhase");

-- CreateIndex
CREATE INDEX "Questionnaire_introducedInPhase_idx" ON "Questionnaire"("introducedInPhase");

-- CreateIndex
CREATE INDEX "Quote_introducedInPhase_idx" ON "Quote"("introducedInPhase");

-- CreateIndex
CREATE INDEX "QuoteLayout_introducedInPhase_idx" ON "QuoteLayout"("introducedInPhase");

-- CreateIndex
CREATE INDEX "Rule_introducedInPhase_idx" ON "Rule"("introducedInPhase");

-- CreateIndex
CREATE INDEX "TaxRate_introducedInPhase_idx" ON "TaxRate"("introducedInPhase");

-- CreateIndex
CREATE INDEX "UnitOfMeasure_introducedInPhase_idx" ON "UnitOfMeasure"("introducedInPhase");
