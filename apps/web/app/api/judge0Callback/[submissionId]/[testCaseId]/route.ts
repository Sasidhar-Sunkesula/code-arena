import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { SubmissionStatus } from "@prisma/client";
import { calculatePoints } from "@/app/actions/calculatePoints";
import { ScoreSchema, SubmissionResult } from "@repo/common/types";

export function mapStatusDescriptionToEnum(description: string): SubmissionStatus {
    switch (description) {
        case "In Queue":
            return SubmissionStatus.InQueue;
        case "Processing":
            return SubmissionStatus.Processing;
        case "Accepted":
            return SubmissionStatus.Accepted;
        case "Wrong Answer":
            return SubmissionStatus.WrongAnswer;
        case "Time Limit Exceeded":
            return SubmissionStatus.TimeLimitExceeded;
        case "Compilation Error":
            return SubmissionStatus.CompilationError;
        case "Runtime Error (SIGSEGV)":
            return SubmissionStatus.RuntimeErrorSIGSEGV;
        case "Runtime Error (SIGXFSZ)":
            return SubmissionStatus.RuntimeErrorSIGXFSZ;
        case "Runtime Error (SIGFPE)":
            return SubmissionStatus.RuntimeErrorSIGFPE;
        case "Runtime Error (SIGABRT)":
            return SubmissionStatus.RuntimeErrorSIGABRT;
        case "Runtime Error (NZEC)":
            return SubmissionStatus.RuntimeErrorNZEC;
        case "Runtime Error (Other)":
            return SubmissionStatus.RuntimeErrorOther;
        case "Internal Error":
            return SubmissionStatus.InternalError;
        case "Exec Format Error":
            return SubmissionStatus.ExecFormatError;
        default:
            throw new Error(`Unknown status description: ${description}`);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { submissionId: string, testCaseId: string } }) {
    const body: SubmissionResult = await req.json();
    const submissionId = parseInt(params.submissionId);
    const testCaseId = parseInt(params.testCaseId);
    const searchParams = req.nextUrl.searchParams;
    const contestId = searchParams.get('contestId');
    const userId = searchParams.get('userId');
    if (isNaN(submissionId) || isNaN(testCaseId)) {
        return NextResponse.json({ error: "Invalid submission ID or test case ID" }, { status: 400 });
    }
    try {
        // Decode Base64 values
        const decodedStdout = body.stdout ? Buffer.from(body.stdout, 'base64').toString('utf-8') : null;
        const decodedStderr = body.stderr ? Buffer.from(body.stderr, 'base64').toString('utf-8') : null;
        // Map status description to enum
        const statusEnum = mapStatusDescriptionToEnum(body.status.description)
        // Insert a new test case result
        await prisma.testCaseResult.create({
            data: {
                testCaseId: testCaseId,
                submissionId: submissionId,
                stdout: decodedStdout,
                stderr: decodedStderr,
                time: parseFloat(body.time),
                memory: body.memory,
                status: statusEnum
            }
        });
        // Fetch the submission to get the problemId
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                problem: {
                    select: {
                        id: true,
                        difficultyLevel: true
                    }
                }
            }
        });

        if (!submission) {
            throw new Error("Submission not found")
        }

        const problemDetails = submission.problem
        // Fetch all test case results for the submission
        const testCaseResults = await prisma.testCaseResult.findMany({
            where: { submissionId: submissionId }
        });
        // Check if all test case results have been received
        const totalTestCases = await prisma.testCase.count({
            where: { problemId: problemDetails?.id }
        });
        if (testCaseResults.length === totalTestCases) {
            // Calculate average memory and runtime
            const totalMemory = testCaseResults.reduce((sum, result) => sum + result.memory, 0);
            const totalTime = testCaseResults.reduce((sum, result) => sum + result.time, 0);
            const averageMemory = totalMemory / testCaseResults.length;
            const averageTime = totalTime / testCaseResults.length;

            // Determine overall status
            const overallStatus = testCaseResults.every(result => result.status === SubmissionStatus.Accepted)
                ? SubmissionStatus.Accepted
                : SubmissionStatus.WrongAnswer;

            // Count the number of test cases passed
            const testCasesPassed = testCaseResults.filter(result => result.status === SubmissionStatus.Accepted).length;

            // Calculate points if the problem details are available and the overall status is "Accepted"
            const points = problemDetails && overallStatus === SubmissionStatus.Accepted
                ? calculatePoints(problemDetails.difficultyLevel)
                : 0;

            // Update the submission with the calculated values
            await prisma.submission.update({
                where: { id: submissionId },
                data: {
                    status: overallStatus,
                    memory: averageMemory,
                    runTime: averageTime,
                    testCasesPassed: testCasesPassed,
                    points: points
                }
            });

            // Add the score to leaderboard only if it is a contest
            if (contestId && userId) {
                // Fetch user details
                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }, select: {
                        location: true,
                        name: true
                    }
                })
                if (!user) throw new Error("Unable to get the user details to add in the leaderboard")
                const reqBody: ScoreSchema = {
                    userId: userId,
                    score: points,
                    country: user.location || "Unknown",
                    userName: user.name || "NA"
                }
                const response = await fetch(`${process.env.LEADERBOARD_SERVER_URL}/api/leaderboard/${contestId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reqBody)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg)
                }
            }
        }
        return NextResponse.json({
            msg: "Success"
        }, {
            status: 200
        })
    } catch (error) {
        console.log((error as Error).message);
        return NextResponse.json({
            msg: error instanceof Error ? error.message : "Error in updating the status"
        }, {
            status: 401
        })
    }
}