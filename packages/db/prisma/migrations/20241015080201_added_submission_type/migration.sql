-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('REGULAR', 'CONFIRMATION_TEST', 'DEMO');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "submissionType" "SubmissionType" NOT NULL DEFAULT 'REGULAR';
