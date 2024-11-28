"use server";

import prisma from "@repo/db/client";

export async function getCurrentContests(userId?: string) {
  try {
    const currentDate = new Date();
    // Fetch all current contests
    const allContests = await prisma.contest.findMany({
      where: {
        startsOn: {
          lte: currentDate, // Contest has started
        },
        closesOn: {
          gte: currentDate, // Contest has not ended
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
        closesOn: "asc",
      },
    });
    if (!userId) {
      // If no userId is provided, return all contests without separating
      return {
        status: 200,
        contests: allContests.map((contest) => ({
          ...contest,
          isRegistered: false,
        })),
      };
    }
    // Map contests to include isRegistered flag
    const contests = allContests.map((contest) => ({
      ...contest,
      isRegistered: contest.users.length > 0,
    }));

    // Separate contests into registered and unregistered
    const registeredContests = contests
      .filter((contest) => contest.isRegistered)
      .map(({ users, ...rest }) => rest);
    const unregisteredContests = contests
      .filter((contest) => !contest.isRegistered)
      .map(({ users, ...rest }) => rest);

    return {
      status: 200,
      registeredContests: registeredContests,
      unregisteredContests: unregisteredContests,
    };
  } catch (error) {
    return {
      status: 500,
      msg: error instanceof Error ? error.message : "Unable to fetch contests",
    };
  }
}
