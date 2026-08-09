-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_businessId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_providerId_fkey";

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "businessNameSnapshot" TEXT,
ADD COLUMN     "providerNameSnapshot" TEXT,
ALTER COLUMN "businessId" DROP NOT NULL,
ALTER COLUMN "providerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
