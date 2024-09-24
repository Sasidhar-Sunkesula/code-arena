import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const submitCodeSchema = z.object({
    problemId: z.number({ message: "Problem Id is missing" }),
    submittedCode: z.string({ message: "Code should not be empty" }),
    languageId: z.number({ message: "Language Id is required" }),
    contestId: z.number().optional()
})
export type SubmitCodeSchema = z.infer<typeof submitCodeSchema>;
interface BatchItem {
    language_id: number,
    source_code: string,
    stdin: string,
    expected_output: string,
    callback_url: string
}
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            msg: "You must be logged in to submit a problem"
        }, {
            status: 401
        })
    }
    try {
        const validatedInput = submitCodeSchema.parse(await req.json());
        const testCases = await prisma.testCase.findMany({
            where: {
                problemId: validatedInput.problemId
            }
        })
        if (!testCases || testCases.length === 0) {
            throw new Error("Incorrect problemId, unable to find the test cases");
        }
        const selectedLanguage = await prisma.language.findUnique({
            where: {
                id: validatedInput.languageId
            }
        });
        if (!selectedLanguage) {
            throw new Error("Error in finding the selected language from the db")
        }
        const newSubmission = await prisma.submission.create({
            data: {
                status: "Processing",
                submittedCode: validatedInput.submittedCode,
                languageId: selectedLanguage.id,
                createdAt: new Date(),
                userId: session.user.id,
                problemId: validatedInput.problemId,
                contestId: validatedInput?.contestId
            }
        })
        if (!newSubmission.id) {
            throw new Error("Error in creating the submission record")
        }
        const callbackUrl = `http://host.docker.internal:3000/api/judge0Callback/${newSubmission.id}`;
        const inputForJudge: BatchItem[] = testCases.map((testCase) => ({
            language_id: selectedLanguage.judge0Id,
            source_code: validatedInput.submittedCode,
            stdin: testCase.input,
            expected_output: testCase.expectedOutput,
            callback_url: callbackUrl
        }));
        const batchSubmissionResponse = await fetch(`${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                submissions: inputForJudge
            })
        });
        if (!batchSubmissionResponse.ok) {
            throw new Error("Could not reach judge0 server")
        }
        return NextResponse.json({
            submissionId: newSubmission.id
        }, {
            status: 201
        })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                msg: error.errors
            }, {
                status: 400
            })
        } else if (error instanceof Error) {
            return NextResponse.json({
                msg: error.message
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