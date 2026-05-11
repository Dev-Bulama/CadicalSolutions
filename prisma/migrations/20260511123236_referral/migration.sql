-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "referrerFullName" TEXT NOT NULL,
    "referrerDesignation" TEXT NOT NULL,
    "referrerFacility" TEXT NOT NULL,
    "referrerFacilityType" TEXT NOT NULL,
    "referrerPhone" TEXT NOT NULL,
    "referrerEmail" TEXT,
    "referrerState" TEXT NOT NULL,
    "referrerLGA" TEXT,
    "referrerAddress" TEXT,
    "clientFacilityName" TEXT NOT NULL,
    "clientType" TEXT NOT NULL,
    "clientContactPerson" TEXT,
    "clientPhone" TEXT NOT NULL,
    "clientEmail" TEXT,
    "clientState" TEXT NOT NULL,
    "clientLGA" TEXT,
    "clientAddress" TEXT,
    "reasonForRequest" TEXT NOT NULL,
    "supplyCategory" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "specificTests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "urgencyLevel" TEXT NOT NULL,
    "quantity" TEXT,
    "deliveryMethod" TEXT,
    "additionalNotes" TEXT,
    "affiliateId" TEXT,
    "referredVia" TEXT,
    "paymentPreference" TEXT,
    "estimatedValue" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referral_refId_key" ON "Referral"("refId");
