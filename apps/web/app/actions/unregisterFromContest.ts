"use server"

import { ActionType, ScoreSchema } from "@repo/common/types";
import prisma from "@repo/db/client"

export async function unregisterFromContest(userId: string, contestId: number) {
    try {
        const currentDate = new Date();
        const allowedToUnregister = await prisma.contest.findUnique({
            where: {
                id: contestId,
                closesOn: {
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
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }, select: {
                username: true,
                location: true
            }
        })
        if (!user) throw new Error("Unable to get the user details")
        const reqBody: ScoreSchema = {
            userId: userId,
            userName: user.username,
            score: 0,
            country: user.location || "NA"
        }
        const leaderboardResponse = await fetch(`${process.env.LEADERBOARD_SERVER_URL}/api/leaderboard/${contestId}?type=${ActionType.New}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody)
        })
        if (!leaderboardResponse.ok) {
            const errorData = await leaderboardResponse.json();
            throw new Error(errorData.msg)
        }
        await prisma.userContest.delete({
            where: {
                userId_contestId: {
                    userId,
                    contestId
                }
            }
        })
        // Remove the user from Redis
        await fetch(`${process.env.LEADERBOARD_SERVER_URL}/api/leaderboard/${contestId}?type=${ActionType.Remove}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId })
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