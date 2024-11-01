"use server"

import prisma from "@repo/db/client";

export async function getOpenContests(userId?: string) {
    try {
        const currentDate = new Date();
        const contests = await prisma.contest.findMany({
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
                        problems: true
                    }
                },
                users: {
                    where: {
                        userId: userId
                    },
                    select: {
                        userId: true
                    }
                }
            },
            take: 10,
            orderBy: {
                closesOn: "asc",
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