/*
  Warnings:

  - You are about to drop the column `testCaseId` on the `TestCaseResult` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestCaseResult" DROP CONSTRAINT "TestCaseResult_testCaseId_fkey";

-- DropIndex
DROP INDEX "TestCaseResult_testCaseId_idx";

-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "testCaseId";
