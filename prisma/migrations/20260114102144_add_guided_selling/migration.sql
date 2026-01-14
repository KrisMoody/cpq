-- CreateEnum
CREATE TYPE "AffinityType" AS ENUM ('CROSS_SELL', 'UPSELL', 'ACCESSORY', 'REQUIRED', 'FREQUENTLY_BOUGHT', 'SUBSCRIPTION_ADDON');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANGE', 'YES_NO');

-- CreateEnum
CREATE TYPE "RecommendationSource" AS ENUM ('RULE_BASED', 'AI_GENERATED', 'QUESTIONNAIRE', 'MANUAL');

-- CreateEnum
CREATE TYPE "RecommendationAction" AS ENUM ('SHOWN', 'ACCEPTED', 'DISMISSED');

-- CreateTable
CREATE TABLE "ProductAffinity" (
    "id" TEXT NOT NULL,
    "sourceProductId" TEXT,
    "targetProductId" TEXT,
    "sourceCategoryId" TEXT,
    "targetCategoryId" TEXT,
    "type" "AffinityType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "conditions" JSONB,
    "sourceBillingFrequency" "BillingFrequency",
    "targetBillingFrequency" "BillingFrequency",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAffinity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "branchLogic" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionProductMapping" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerValue" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "QuestionProductMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationLog" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "source" "RecommendationSource" NOT NULL,
    "action" "RecommendationAction" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductAffinity_sourceProductId_idx" ON "ProductAffinity"("sourceProductId");

-- CreateIndex
CREATE INDEX "ProductAffinity_targetProductId_idx" ON "ProductAffinity"("targetProductId");

-- CreateIndex
CREATE INDEX "ProductAffinity_sourceCategoryId_idx" ON "ProductAffinity"("sourceCategoryId");

-- CreateIndex
CREATE INDEX "ProductAffinity_targetCategoryId_idx" ON "ProductAffinity"("targetCategoryId");

-- CreateIndex
CREATE INDEX "ProductAffinity_type_idx" ON "ProductAffinity"("type");

-- CreateIndex
CREATE INDEX "Question_questionnaireId_idx" ON "Question"("questionnaireId");

-- CreateIndex
CREATE INDEX "QuestionProductMapping_questionId_idx" ON "QuestionProductMapping"("questionId");

-- CreateIndex
CREATE INDEX "QuestionProductMapping_productId_idx" ON "QuestionProductMapping"("productId");

-- CreateIndex
CREATE INDEX "RecommendationLog_quoteId_idx" ON "RecommendationLog"("quoteId");

-- CreateIndex
CREATE INDEX "RecommendationLog_productId_idx" ON "RecommendationLog"("productId");

-- CreateIndex
CREATE INDEX "RecommendationLog_createdAt_idx" ON "RecommendationLog"("createdAt");

-- AddForeignKey
ALTER TABLE "ProductAffinity" ADD CONSTRAINT "ProductAffinity_sourceProductId_fkey" FOREIGN KEY ("sourceProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAffinity" ADD CONSTRAINT "ProductAffinity_targetProductId_fkey" FOREIGN KEY ("targetProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAffinity" ADD CONSTRAINT "ProductAffinity_sourceCategoryId_fkey" FOREIGN KEY ("sourceCategoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAffinity" ADD CONSTRAINT "ProductAffinity_targetCategoryId_fkey" FOREIGN KEY ("targetCategoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionProductMapping" ADD CONSTRAINT "QuestionProductMapping_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionProductMapping" ADD CONSTRAINT "QuestionProductMapping_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
