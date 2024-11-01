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
        return {
            status: 200,
            contests
        }
    } catch (error) {
        return {
            status: 500,
            msg: error instanceof Error ? error.message : "Unable to fetch contests"
        }
    }
} 