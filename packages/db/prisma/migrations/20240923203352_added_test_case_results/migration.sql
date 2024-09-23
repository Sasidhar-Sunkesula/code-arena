-- CreateTable
CREATE TABLE "TestCaseResult" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "stdout" TEXT,
    "stderr" TEXT,
    "time" DOUBLE PRECISION NOT NULL,
    "memory" DOUBLE PRECISION NOT NULL,
    "status" "SubmissionStatus" NOT NULL,

    CONSTRAINT "TestCaseResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestCaseResult_submissionId_idx" ON "TestCaseResult"("submissionId");

-- AddForeignKey
ALTER TABLE "TestCaseResult" ADD CONSTRAINT "TestCaseResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
