"use server"

import prisma from "@repo/db/client"

export async function registerToContest(userId: string, contestId: number) {
    try {
        const currentDate = new Date();
        const isOpenToRegister = await prisma.contest.findUnique({
            where: {
                id: contestId,
                startsOn: {
                    gte: currentDate
                }
            }
        })
        if (!isOpenToRegister) {
            return {
                status: 400,
                msg: "Registration is closed for this contest.",
            };
        }
        await prisma.userContest.create({
            data: {
                userId,
                contestId
            }
        })
        return {
            status: 200,
            msg: "You have registered for the contest successfully!",
        };
    } catch (error) {
        return {
            status: 500,
            msg: error instanceof Error ? error.message : "An unknown error occurred while registering for the contest",
        };
    }
}