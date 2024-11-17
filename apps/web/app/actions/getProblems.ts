"use server"

import prisma from "@repo/db/client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getProblems(searchKey: string, page: number, limit: number) {
    try {
        const session = await getServerSession(authOptions);
        const offset = (page - 1) * limit;
        const problemList = await prisma.problem.findMany({
            take: limit,
            skip: offset,
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
                        submissions: {
                            where: {
                                contestId: null
                            }
                        } // Count total submissions for each problem
                    }
                },
                submissions: {
                    where: {
                        contestId: null
                    }, select: {
                        status: true,
                        userId: true // Include userId to filter user's submissions later
                    }
                }
            }
        });
        const problemCount = await prisma.problem.count({
            where: {
                name: {
                    contains: searchKey,
                    mode: "insensitive"
                }
            }
        });
        const formattedProblemList = problemList.map(problem => {
            const totalSubmissions = problem._count.submissions;
            const acceptedSubmissions = problem.submissions.filter(submission => submission.status === "Accepted").length;
            const acceptanceRate = totalSubmissions > 0
                ? (acceptedSubmissions / totalSubmissions * 100).toFixed(2) + ' %'
                : 'NA';

            return {
                id: problem.id,
                name: problem.name,
                difficultyLevel: problem.difficultyLevel,
                totalSubmissions,
                acceptanceRate,
                submissions: session?.user.id ? problem.submissions : []
            };
        });
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