/*
  Warnings:

  - The values [REJECTED,ACCEPTED,PENDING] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `detailedStatus` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('InQueue', 'Processing', 'Accepted', 'WrongAnswer', 'TimeLimitExceeded', 'CompilationError', 'RuntimeErrorSIGSEGV', 'RuntimeErrorSIGXFSZ', 'RuntimeErrorSIGFPE', 'RuntimeErrorSIGABRT', 'RuntimeErrorNZEC', 'RuntimeErrorOther', 'InternalError', 'ExecFormatError');
ALTER TABLE "Submission" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "detailedStatus",
ALTER COLUMN "status" SET DEFAULT 'WrongAnswer';

-- DropEnum
DROP TYPE "Judge0Status";
