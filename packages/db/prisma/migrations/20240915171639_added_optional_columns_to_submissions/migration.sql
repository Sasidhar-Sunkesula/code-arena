/*
  Warnings:

  - The values [Beginner,Intermediate,Advanced] on the enum `ContestLevel` will be removed. If these variants are still used in the database, this will fail.
  - The values [Easy,Medium,Hard] on the enum `DifficultyLevel` will be removed. If these variants are still used in the database, this will fail.

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

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "memory" DROP NOT NULL,
ALTER COLUMN "runTime" DROP NOT NULL,
ALTER COLUMN "testCasesPassed" DROP NOT NULL;
