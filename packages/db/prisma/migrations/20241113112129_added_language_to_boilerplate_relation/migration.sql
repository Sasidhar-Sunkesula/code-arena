/*
  Warnings:

  - A unique constraint covering the columns `[languageId,problemId]` on the table `BoilerPlate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BoilerPlate_languageId_key";

-- CreateIndex
CREATE UNIQUE INDEX "BoilerPlate_languageId_problemId_key" ON "BoilerPlate"("languageId", "problemId");
