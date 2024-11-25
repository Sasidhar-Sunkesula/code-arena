"use server"

import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client"
import { getServerSession } from "next-auth";

export async function unregisterFromContest(contestId: number) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return {
                status: 400,
                msg: "You need to be logged in to perform this action"
            }
        }
        const currentDate = new Date();
        const allowedToUnregister = await prisma.contest.findUnique({
            where: {
                id: contestId,
                closesOn: {
                    gte: currentDate
                },
                startsOn: {
                    gte: currentDate
                }
            }
        })
        if (!allowedToUnregister) {
            return {
                status: 400,
                msg: "Un-registrations are not allowed for this contest.",
            };
        }
        const leaderboardResponse = await fetch(`${process.env.LEADERBOARD_SERVER_URL}/api/leaderboard/un-register/${contestId}/${session.user.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!leaderboardResponse.ok) {
            const errorData = await leaderboardResponse.json();
            throw new Error(errorData.msg)
        }
        await prisma.userContest.delete({
            where: {
                userId_contestId: {
                    userId: session.user.id,
                    contestId
                }
            }
        })
        return {
            status: 200,
            msg: "You have un-registered for the contest!",
        };
    } catch (error) {
        return {
            status: 500,
            msg: error instanceof Error ? error.message : "Unable to un-register for the contest",
        };
    }
}