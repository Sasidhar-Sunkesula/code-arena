"use server"

import prisma from "@repo/db/client"

export async function registerToContest(userId: string, contestId: number) {
    try {
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