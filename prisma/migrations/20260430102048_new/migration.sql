-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "equipmentType" TEXT,
    "issueType" TEXT,
    "urgency" TEXT,
    "consultType" TEXT,
    "format" TEXT,
    "callerType" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "orgName" TEXT,
    "role" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "bookingType" TEXT NOT NULL,
    "prefDate" TEXT,
    "selectedSlot" TEXT,
    "callbackDate" TEXT,
    "callWindow" TEXT,
    "callbackPhone" TEXT,
    "notes" TEXT,
    "ref" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_ref_key" ON "Booking"("ref");
