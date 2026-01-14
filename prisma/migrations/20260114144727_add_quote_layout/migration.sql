-- CreateTable
CREATE TABLE "QuoteLayout" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "sections" JSONB NOT NULL,
    "summaryConfig" JSONB NOT NULL,
    "theme" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteLayout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuoteLayout_entityId_idx" ON "QuoteLayout"("entityId");

-- CreateIndex
CREATE INDEX "QuoteLayout_isTemplate_idx" ON "QuoteLayout"("isTemplate");
