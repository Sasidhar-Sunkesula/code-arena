/*
  Warnings:

  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `createdAt` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memory` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runTime` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testCasesPassed` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('REJECTED', 'ACCEPTED', 'PENDING');

-- AlterTable
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "error" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "memory" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "output" TEXT,
ADD COLUMN     "runTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "testCasesPassed" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL,
ADD CONSTRAINT "Submission_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "ProblemStatus";

-- CreateIndex
CREATE INDEX "Submission_userId_problemId_idx" ON "Submission"("userId", "problemId");
