"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";

export async function getSubmissions(problemId: number, contestId?: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return {
        msg: "Please login to view your submissions",
      };
    }
    const submissions = await prisma.submission.findMany({
      where: {
        problemId: problemId,
        contestId: contestId,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        submittedCode: true,
        createdAt: true,
        runTime: true,
        memory: true,
        points: true,
        testCasesPassed: true,
        problem: {
          select: {
            _count: {
              select: {
                testcases: true,
              },
            },
          },
        },
      },
    });

    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      status: submission.status,
      submittedCode: submission.submittedCode,
      createdAt: submission.createdAt,
      runTime: submission.runTime,
      memory: submission.memory,
      testCasesPassed: submission.testCasesPassed,
      points: submission.points,
      testCaseCount: submission?.problem?._count.testcases ?? 0,
    }));

    return {
      submissions: formattedSubmissions,
    };
  } catch (error) {
    return {
      msg: "An error occurred while fetching submissions. Please try again later.",
    };
  }
}
