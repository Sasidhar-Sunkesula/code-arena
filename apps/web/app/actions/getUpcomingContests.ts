"use server"

import prisma from "@repo/db/client";

export async function getUpcomingContests(userId?: string) {
    try {
        const currentDate = new Date();
        const contests = await prisma.contest.findMany({
            where: {
                startsOn: {
                    gt: currentDate, // Contest has not started yet
                },
            },
            include: {
                _count: {
                    select: {
                        problems: true,
                    },
                },
                users: {
                    where: {
                        userId: userId,
                    },
                    select: {
                        userId: true,
                    },
                },
            },
            take: 10,
            orderBy: {
                startsOn: "asc", // Order by start date ascending
            },
        });
        const formattedContests = contests.map(contest => ({
            ...contest,
            isRegistered: contest.users.length > 0 ? true : false
        }))
        return {
            status: 200,
            contests: formattedContests
        }
    } catch (error) {
        return {
            status: 500,
            msg: error instanceof Error ? error.message : "Unable to fetch contests"
        }
    }
} 