"use server";

import prisma from "@repo/db/client";

export async function getSolvedProblemsByLevel(userId: string) {
  try {
    // Query for the total number of problems grouped by difficulty level
    const totalProblemsByLevel = await prisma.problem.groupBy({
      by: ["difficultyLevel"],
      _count: {
        _all: true,
      },
    });
    const totalProblems = totalProblemsByLevel.reduce(
      (acc, curr) => acc + curr._count._all,
      0,
    );

    // Query for the number of solved problems grouped by difficulty level
    const solvedProblems = await prisma.submission.findMany({
      where: {
        userId: userId,
        status: "Accepted",
        contestId: null,
      },
      distinct: ["problemId"],
      select: {
        problemId: true,
        createdAt: true,
        problem: {
          select: {
            name: true,
            difficultyLevel: true,
          },
        },
      },
    });
    return {
      totalProblemsByLevel,
      totalProblems,
      solvedProblems,
    };
  } catch (error) {
    return {
      msg: "Unable to fetch profile metrics",
    };
  }
}
