/*
  Warnings:

  - Added the required column `languageId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedCode` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "languageId" INTEGER NOT NULL,
ADD COLUMN     "submittedCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BoilerPlate" (
    "id" SERIAL NOT NULL,
    "boilerPlateCode" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,

    CONSTRAINT "BoilerPlate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "monacoName" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoilerPlate_languageId_key" ON "BoilerPlate"("languageId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoilerPlate" ADD CONSTRAINT "BoilerPlate_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoilerPlate" ADD CONSTRAINT "BoilerPlate_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
