/*
  Warnings:

  - You are about to drop the column `error` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "error",
DROP COLUMN "output";
