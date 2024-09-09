/*
  Warnings:

  - The values [BEGINNER,INTERMEDIATE,ADVANCED] on the enum `ContestLevel` will be removed. If these variants are still used in the database, this will fail.
  - The values [EASY,MEDIUM,HARD] on the enum `DifficultyLevel` will be removed. If these variants are still used in the database, this will fail.
  - The values [UNSOLVED,SOLVED] on the enum `ProblemStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContestLevel_new" AS ENUM ('Beginner', 'Intermediate', 'Advanced');
ALTER TABLE "Contest" ALTER COLUMN "level" TYPE "ContestLevel_new" USING ("level"::text::"ContestLevel_new");
ALTER TYPE "ContestLevel" RENAME TO "ContestLevel_old";
ALTER TYPE "ContestLevel_new" RENAME TO "ContestLevel";
DROP TYPE "ContestLevel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DifficultyLevel_new" AS ENUM ('Easy', 'Medium', 'Hard');
ALTER TABLE "Problem" ALTER COLUMN "difficultyLevel" TYPE "DifficultyLevel_new" USING ("difficultyLevel"::text::"DifficultyLevel_new");
ALTER TYPE "DifficultyLevel" RENAME TO "DifficultyLevel_old";
ALTER TYPE "DifficultyLevel_new" RENAME TO "DifficultyLevel";
DROP TYPE "DifficultyLevel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProblemStatus_new" AS ENUM ('Unsolved', 'Solved');
ALTER TABLE "Submission" ALTER COLUMN "status" TYPE "ProblemStatus_new" USING ("status"::text::"ProblemStatus_new");
ALTER TYPE "ProblemStatus" RENAME TO "ProblemStatus_old";
ALTER TYPE "ProblemStatus_new" RENAME TO "ProblemStatus";
DROP TYPE "ProblemStatus_old";
COMMIT;
