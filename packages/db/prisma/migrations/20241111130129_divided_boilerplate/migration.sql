/*
  Warnings:

  - Added the required column `initialFunction` to the `BoilerPlate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BoilerPlate" ADD COLUMN     "initialFunction" TEXT NOT NULL;
