-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
