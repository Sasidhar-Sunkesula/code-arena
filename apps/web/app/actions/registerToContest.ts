"use server"

import { authOptions } from "@/lib/auth";
import { ScoreSchema } from "@repo/common/types";
import prisma from "@repo/db/client"
import { getServerSession } from "next-auth";

export async function registerToContest(contestId: number) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return {
                status: 400,
                msg: "You need to be logged in to perform this action"
            }
        }
        const userId = session.user.id;
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
        const leaderboardResponse = await fetch(`${process.env.LEADERBOARD_SERVER_URL}/api/leaderboard/register/${contestId}`, {
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
            msg: error instanceof Error ? error.message : "Unable to register for the contest",
        };
    }
}