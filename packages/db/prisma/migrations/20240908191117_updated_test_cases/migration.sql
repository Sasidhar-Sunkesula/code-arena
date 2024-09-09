/*
  Warnings:

  - You are about to drop the column `content` on the `TestCase` table. All the data in the column will be lost.
  - Added the required column `expectedOutput` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "content",
ADD COLUMN     "expectedOutput" TEXT NOT NULL,
ADD COLUMN     "input" TEXT NOT NULL;
