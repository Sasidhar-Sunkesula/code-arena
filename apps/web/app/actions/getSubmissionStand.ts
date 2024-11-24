"use server"

import { formatMemory, formatRunTime } from "@/lib/utils";
import prisma from "@repo/db/client";

export async function getSubmissionStand(problemId: number, contestId?: number) {
    try {
        const submissionData = await prisma.submission.findMany({
            where: {
                problemId,
                contestId,
                memory: {
                    not: null,
                },
                runTime: {
                    not: null,
                },
            },
            select: {
                memory: true,
                runTime: true,
            },
        });

        // Sort the data by runTime
        const sortedData = submissionData.sort((a, b) => (a.runTime ?? 0) - (b.runTime ?? 0));

        // Calculate the frequency of each runtime
        const runtimeFrequency: { [key: number]: number } = {};
        sortedData.forEach(submission => {
            const runTime = formatRunTime(submission.runTime);
            if (runTime && runtimeFrequency[runTime]) {
                runtimeFrequency[runTime]++;
            } else if (runTime) {
                runtimeFrequency[runTime] = 1;
            }
        });

        // Calculate the frequency of each memory usage
        const memoryFrequency: { [key: number]: number } = {};
        sortedData.forEach(submission => {
            const memory = formatMemory(submission.memory);
            if (memory && memoryFrequency[memory]) {
                memoryFrequency[memory]++;
            } else if (memory) {
                memoryFrequency[memory] = 1;
            }
        });

        // Convert frequencies to percentages
        const totalSubmissions = sortedData.length;
        const runtimePercentage = Object.keys(runtimeFrequency).map(runTime => ({
            runTime: parseFloat(runTime),
            percentage: parseFloat((((runtimeFrequency[parseFloat(runTime)] ?? 0) / totalSubmissions) * 100).toFixed(2)),
        }));

        const memoryPercentage = Object.keys(memoryFrequency).map(memory => ({
            memory: parseFloat(memory),
            percentage: parseFloat((((memoryFrequency[parseFloat(memory)] ?? 0) / totalSubmissions) * 100).toFixed(2)),
        }));
        return {
            status: 200,
            runtimePercentage,
            memoryPercentage,
        };
    } catch (error) {
        return {
            status: 400,
            msg: error instanceof Error ? error.message : "Error while fetching submissions data",
        };
    }
}