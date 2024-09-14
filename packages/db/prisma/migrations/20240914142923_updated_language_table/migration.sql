/*
  Warnings:

  - You are about to drop the column `displayName` on the `Language` table. All the data in the column will be lost.
  - Added the required column `judge0Id` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judge0Name` to the `Language` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Language" DROP COLUMN "displayName",
ADD COLUMN     "judge0Id" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "judge0Name" TEXT NOT NULL DEFAULT 'default_name';
