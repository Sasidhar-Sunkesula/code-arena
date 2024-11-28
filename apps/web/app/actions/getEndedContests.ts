"use server";

import prisma from "@repo/db/client";

export async function getEndedContests(userId?: string) {
  try {
    const currentDate = new Date();

    // Fetch all ended contests
    const allContests = await prisma.contest.findMany({
      where: {
        closesOn: {
          lt: currentDate, // Contest has ended
        },
      },
      include: {
        _count: {
          select: {
            problems: true,
          },
        },
        users: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                userId: true,
              },
            }
          : false,
      },
      orderBy: {
        closesOn: "desc",
      },
    });

    // Map contests to include isRegistered flag
    const contests = allContests.map((contest) => ({
      ...contest,
      isRegistered: userId ? contest.users.length > 0 : false,
    }));

    // Remove users object from contests
    const sanitizedContests = contests.map(({ users, ...rest }) => rest);

    return {
      status: 200,
      contests: sanitizedContests,
    };
  } catch (error) {
    return {
      status: 500,
      msg: error instanceof Error ? error.message : "Unable to fetch contests",
    };
  }
}
