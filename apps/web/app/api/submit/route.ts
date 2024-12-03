import { authOptions } from "@/lib/auth";
import { SubmissionType } from "@repo/common/types";
import { submitCodeSchema } from "@repo/common/zod";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export interface BatchItem {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
  callback_url: string;
}
async function fetchTestCases(problemId: number) {
  const testCases = await prisma.testCase.findMany({
    where: {
      problemId: problemId,
    },
  });
  if (!testCases || testCases.length === 0) {
    throw new Error("Unable to find the test cases for this problem");
  }
  return testCases;
}
async function fetchBoilerPlate(problemId: number, languageId: number) {
  const boilerPlateCode = await prisma.boilerPlate.findFirst({
    where: {
      problemId: problemId,
      languageId: languageId,
    },
    select: {
      boilerPlateCode: true,
      languageId: true,
    },
  });
  if (!boilerPlateCode) {
    throw new Error("Unable to find the boiler plate for this problem");
  }
  return boilerPlateCode;
}
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const validatedInput = submitCodeSchema.parse(await req.json());
    const selectedLanguage = await prisma.language.findUnique({
      where: {
        id: validatedInput.languageId,
      },
    });
    if (!selectedLanguage) {
      throw new Error("Error in finding the selected language from the db");
    }
    if (validatedInput.type === SubmissionType.SUBMIT) {
      const userId = session?.user?.id || validatedInput.tempId;
      if (!userId) {
        return NextResponse.json(
          {
            msg: "You need credibility to submit a problem!",
          },
          {
            status: 401,
          },
        );
      }
      if (!validatedInput.problemId) {
        throw new Error("Problem Id is required for making a submission");
      }
      const testCases = await fetchTestCases(validatedInput.problemId);
      const newSubmission = await prisma.submission.create({
        data: {
          status: "Processing",
          submittedCode: validatedInput.submittedCode,
          languageId: selectedLanguage.id,
          createdAt: new Date(),
          userId: userId,
          problemId: validatedInput.problemId,
          contestId: validatedInput?.contestId,
        },
      });
      const boilerPlate = await fetchBoilerPlate(
        validatedInput.problemId,
        validatedInput.languageId,
      );
      const inputForJudge: BatchItem[] = testCases.map((testCase) => {
        const baseUrl = `${process.env.NODE_ENV === "development" ? "http://host.docker.internal:3000" : process.env.NEXT_PUBLIC_BASE_URL}/api/judge0Callback/${newSubmission.id}/${testCase.id}`;
        const queryParams = new URLSearchParams();
        if (validatedInput.contestId) {
          queryParams.append("contestId", validatedInput.contestId.toString());
          queryParams.append("userId", userId);
        }
        const callbackUrl = `${baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        // ensure that there is exactly one newline between the user's code and the boilerplate code,
        const fullCode = `${validatedInput.submittedCode.trim()}\n${boilerPlate.boilerPlateCode.trim()}`;

        return {
          language_id: selectedLanguage.judge0Id,
          source_code: fullCode,
          stdin: testCase.input,
          expected_output: testCase.expectedOutput,
          callback_url: callbackUrl,
        };
      });
      const batchSubmissionResponse = await fetch(
        `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submissions: inputForJudge,
          }),
        },
      );
      if (!batchSubmissionResponse.ok) {
        throw new Error("Could not reach judge0 server");
      }
      return NextResponse.json(
        {
          submissionId: newSubmission.id,
        },
        {
          status: 201,
        },
      );
    } else if (validatedInput.type === SubmissionType.RUN) {
      let testCases;
      let boilerPlate: { languageId: number; boilerPlateCode: string };
      let fullCode: string;
      // If problemId is present, user is running a problem.
      if (validatedInput.problemId) {
        testCases = await fetchTestCases(validatedInput.problemId);
        boilerPlate = await fetchBoilerPlate(
          validatedInput.problemId,
          validatedInput.languageId,
        );
        fullCode = `${validatedInput.submittedCode.trim()}\n${boilerPlate.boilerPlateCode.trim()}`;
        // If test cases were given, then user is testing his problem
      } else if (validatedInput.testCases) {
        testCases = validatedInput.testCases;
        fullCode = validatedInput.submittedCode;
      } else {
        throw new Error("No test cases provided");
      }
      const inputForJudge: Omit<BatchItem, "callback_url">[] = testCases.map(
        (testCase) => {
          return {
            language_id: selectedLanguage.judge0Id,
            source_code: fullCode,
            stdin: testCase.input,
            expected_output: testCase.expectedOutput,
          };
        },
      );
      const batchSubmissionResponse = await fetch(
        `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submissions: inputForJudge,
          }),
        },
      );
      if (!batchSubmissionResponse.ok) {
        throw new Error("Could not reach judge0 server");
      }
      return NextResponse.json(
        {
          submissionTokens: await batchSubmissionResponse.json(),
        },
        {
          status: 201,
        },
      );
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          msg: error.errors[0]?.message,
        },
        {
          status: 400,
        },
      );
    } else if (error instanceof Error) {
      return NextResponse.json(
        {
          msg: error.message,
        },
        {
          status: 500,
        },
      );
    }
    return NextResponse.json(
      {
        msg: "An unknown error occurred",
      },
      {
        status: 500,
      },
    );
  }
}
