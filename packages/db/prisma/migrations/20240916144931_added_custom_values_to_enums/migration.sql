/*
  Warnings:

  - The values [InQueue,WrongAnswer,TimeLimitExceeded,CompilationError,RuntimeErrorSIGSEGV,RuntimeErrorSIGXFSZ,RuntimeErrorSIGFPE,RuntimeErrorSIGABRT,RuntimeErrorNZEC,RuntimeErrorOther,InternalError,ExecFormatError] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('In Queue', 'Processing', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error (SIGSEGV)', 'Runtime Error (SIGXFSZ)', 'Runtime Error (SIGFPE)', 'Runtime Error (SIGABRT)', 'Runtime Error (NZEC)', 'Runtime Error (Other)', 'Internal Error', 'Exec Format Error');
ALTER TABLE "Submission" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
COMMIT;
