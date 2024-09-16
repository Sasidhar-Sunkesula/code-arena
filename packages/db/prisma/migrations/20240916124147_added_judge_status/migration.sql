-- CreateEnum
CREATE TYPE "Judge0Status" AS ENUM ('InQueue', 'Processing', 'Accepted', 'WrongAnswer', 'TimeLimitExceeded', 'CompilationError', 'RuntimeErrorSIGSEGV', 'RuntimeErrorSIGXFSZ', 'RuntimeErrorSIGFPE', 'RuntimeErrorSIGABRT', 'RuntimeErrorNZEC', 'RuntimeErrorOther', 'InternalError', 'ExecFormatError');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "detailedStatus" "Judge0Status" NOT NULL DEFAULT 'WrongAnswer';
