"use server"

import prisma from "@repo/db/client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getProblems(searchKey: string) {
    try {
        const session = await getServerSession(authOptions);
        const problemList = await prisma.problem.findMany({
            where: {
                name: {
                    contains: searchKey,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                name: true,
                difficultyLevel: true,
                _count: {
                    select: {
                        submissions: true // Count total submissions for each problem
                    }
                },
                submissions: {
                    where: {
                        status: "Accepted",
                        ...(session?.user.id && { userId: session.user.id })
                    },
                    select: {
                        status: true // Just to check if there is any accepted submission
                    }
                }
            }
        });
        const problemCount = await prisma.problem.count();
        const formattedProblemList = problemList.map(problem => ({
            id: problem.id,
            name: problem.name,
            difficultyLevel: problem.difficultyLevel,
            _count: problem._count,
            submissions: session?.user.id ? problem.submissions : []
        }));
        return {
            formattedProblemList,
            problemCount
        }
    } catch (error) {
        return {
            msg: error instanceof Error ? error.message : "An unknown error occurred while getting problems"
        }
    }
}