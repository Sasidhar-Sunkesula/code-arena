/*
  Warnings:

  - You are about to drop the column `submissionType` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "submissionType";

-- DropEnum
DROP TYPE "SubmissionType";
