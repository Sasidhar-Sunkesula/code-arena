import { SubmissionStatus } from "@prisma/client";
import { SubmissionResult, SubmissionStatusDisplay, SubmissionStatusEnum } from "@repo/common/types";
import { checkStatusSchema } from "@repo/common/zod";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const validatedInput = checkStatusSchema.parse(await req.json());

    // Construct the URL with tokens separated by commas
    const tokensParam = validatedInput.submissionTokens.join(",");

    const url = `${process.env.JUDGE0_URL}/submissions/batch?tokens=${tokensParam}&base64_encoded=false`;
    const getBatchSubmissions = await fetch(url);
    if (!getBatchSubmissions.ok) {
      throw new Error("Could not reach Judge0 server");
    }
    const batchSubmissions: { submissions: SubmissionResult[] } =
      await getBatchSubmissions.json();
    const isAnySubmissionInQueue = batchSubmissions.submissions.some(
      (result) =>
        result.status.description === SubmissionStatusDisplay.Processing ||
        result.status.description === SubmissionStatusDisplay.InQueue
    );
    if (isAnySubmissionInQueue) {
      return NextResponse.json({
        msg: "PENDING",
      });
    }
    let testCases: {
      input: string;
      expectedOutput: string;
    }[];
    // Get the input and expected output
    if (!validatedInput.testCases) {
      testCases = await prisma.testCase.findMany({
        where: {
          problemId: validatedInput.problemId,
        },
        select: {
          input: true,
          expectedOutput: true,
        },
      });
    } else {
      testCases = validatedInput.testCases;
    }
    // Modify the stdout, stderr, and time fields
    const formattedSubmissions = batchSubmissions.submissions.map(
      (submission, index) => {
        return {
          ...submission,
          testCase: {
            ...testCases[index],
          },
          time: parseFloat(submission.time),
          status:
            SubmissionStatusEnum[
              submission.status.description as keyof typeof SubmissionStatusEnum
            ],
        };
      },
    );
    const totalMemory = formattedSubmissions.reduce(
      (sum, curr) => sum + curr.memory,
      0,
    );
    const totalResults = formattedSubmissions.length;
    const totalTime = formattedSubmissions.reduce(
      (sum, curr) => sum + curr.time,
      0,
    );
    const averageMemory = totalMemory / totalResults;
    const averageTime = totalTime / totalResults;
    // Determine overall status
    const overallStatus = formattedSubmissions.every(
      (result) => result.status === SubmissionStatus.Accepted,
    )
      ? SubmissionStatus.Accepted
      : SubmissionStatus.WrongAnswer;
    return NextResponse.json(
      {
        data: {
          memory: averageMemory,
          runTime: averageTime,
          status: overallStatus,
          testCaseResults: formattedSubmissions,
        },
      },
      {
        status: 200,
      },
    );
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
    }
    if (error instanceof Error) {
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
        msg: "Unable to get the status",
      },
      {
        status: 500,
      },
    );
  }
}
