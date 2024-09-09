/*
  Warnings:

  - The values [Beginner,Intermediate,Advanced] on the enum `ContestLevel` will be removed. If these variants are still used in the database, this will fail.
  - The values [Easy,Medium,Hard] on the enum `DifficultyLevel` will be removed. If these variants are still used in the database, this will fail.
  - The values [Unsolved,Solved] on the enum `ProblemStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_ContestProblems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserContests` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContestLevel_new" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
ALTER TABLE "Contest" ALTER COLUMN "level" TYPE "ContestLevel_new" USING ("level"::text::"ContestLevel_new");
ALTER TYPE "ContestLevel" RENAME TO "ContestLevel_old";
ALTER TYPE "ContestLevel_new" RENAME TO "ContestLevel";
DROP TYPE "ContestLevel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DifficultyLevel_new" AS ENUM ('EASY', 'MEDIUM', 'HARD');
ALTER TABLE "Problem" ALTER COLUMN "difficultyLevel" TYPE "DifficultyLevel_new" USING ("difficultyLevel"::text::"DifficultyLevel_new");
ALTER TYPE "DifficultyLevel" RENAME TO "DifficultyLevel_old";
ALTER TYPE "DifficultyLevel_new" RENAME TO "DifficultyLevel";
DROP TYPE "DifficultyLevel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProblemStatus_new" AS ENUM ('UNSOLVED', 'SOLVED');
ALTER TABLE "Submission" ALTER COLUMN "status" TYPE "ProblemStatus_new" USING ("status"::text::"ProblemStatus_new");
ALTER TYPE "ProblemStatus" RENAME TO "ProblemStatus_old";
ALTER TYPE "ProblemStatus_new" RENAME TO "ProblemStatus";
DROP TYPE "ProblemStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_ContestProblems" DROP CONSTRAINT "_ContestProblems_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContestProblems" DROP CONSTRAINT "_ContestProblems_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserContests" DROP CONSTRAINT "_UserContests_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserContests" DROP CONSTRAINT "_UserContests_B_fkey";

-- DropTable
DROP TABLE "_ContestProblems";

-- DropTable
DROP TABLE "_UserContests";

-- CreateTable
CREATE TABLE "UserContest" (
    "userId" TEXT NOT NULL,
    "contestId" INTEGER NOT NULL,

    CONSTRAINT "UserContest_pkey" PRIMARY KEY ("userId","contestId")
);

-- CreateTable
CREATE TABLE "ContestProblem" (
    "problemId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,

    CONSTRAINT "ContestProblem_pkey" PRIMARY KEY ("problemId","contestId")
);

-- AddForeignKey
ALTER TABLE "UserContest" ADD CONSTRAINT "UserContest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContest" ADD CONSTRAINT "UserContest_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
