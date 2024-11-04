import { contestFormSchema } from "@repo/common/zod";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
    try {
        const validatedBody = contestFormSchema.parse(await req.json());
        const result = await prisma.$transaction(async () => {
            const createContest = await prisma.contest.create({
                data: {
                    name: validatedBody.contestName,
                    contributedBy: validatedBody.userName,
                    level: validatedBody.difficultyLevel,
                    startsOn: validatedBody.startsOn,
                    closesOn: validatedBody.endsOn
                },
                select: {
                    id: true
                }
            })
            const contestId = createContest.id;
            const problemIdsWithContestId = validatedBody.problemIds.map(problemId => ({
                contestId,
                problemId
            }));
            const contestProblems = await prisma.contestProblem.createMany({
                data: problemIdsWithContestId
            })
            return { createContest, contestProblems }
        })
        const leaderboardResponse = await fetch(`${process.env.LEADERBOARD_SERVER_URL}/api/leaderboard/initialize/${result.createContest.id}`);
        if (!leaderboardResponse.ok) {
            const errorData = await leaderboardResponse.json();
            throw new Error(errorData.msg)
        }
        return NextResponse.json({
            createdContestId: result.createContest.id
        }, {
            status: 200
        })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                msg: error.errors[0]?.message
            }, {
                status: 400
            })
        } else if (error instanceof Error) {
            return NextResponse.json({
                msg: error.message.length < 50 ? error.message : "Unable to create the contest"
            }, {
                status: 500
            })
        }
        return NextResponse.json({
            msg: "An unknown error occurred"
        }, {
            status: 500
        })
    }
}