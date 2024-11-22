"use server"

import { formatMemory, formatRunTime } from "@/lib/utils"
import prisma from "@repo/db/client"

export async function getSubmissionStand(problemId: number, contestId?: number) {
    try {
        const submissionData = await prisma.submission.findMany({
            where: {
                problemId,
                contestId,
                memory: {
                    not: null
                },
                runTime: {
                    not: null
                }
            },
            select: {
                memory: true,
                runTime: true
            }
        })
        const formattedData = submissionData.map(submission => {
            return {
                runTime: formatRunTime(submission.runTime),
                memory: formatMemory(submission.memory)
            }
        })
        return {
            status: 200,
            formattedData
        }
    } catch (error) {
        return {
            status: 400,
            msg: "Unable to fetch submissions data"
        }
    }
} 