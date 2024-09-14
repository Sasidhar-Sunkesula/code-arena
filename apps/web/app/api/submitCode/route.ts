import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const submitCodeSchema = z.object({
    problemId: z.number({ message: "Problem Id is missing" }),
    fullCode: z.string({ message: "Code should not be empty" }),
    languageId: z.number({ message: "Language Id is required" })
})
interface BatchItem {
    language_id: number,
    source_code: string,
    stdin: string,
    expected_output: string
}
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //     return NextResponse.json({
    //         msg: "You must be logged in to submit a problem"
    //     }, {
    //         status: 401
    //     })
    // }
    try {
        const validatedInput = submitCodeSchema.parse(await req.json());
        const { problemId, fullCode, languageId } = validatedInput;
        const testCases = await prisma.testCase.findMany({
            where: {
                problemId: problemId
            }
        })
        if (!testCases || testCases.length === 0) {
            throw new Error("Incorrect problemId, unable to find the test cases");
        }
        const inputForJudge: BatchItem[] = testCases.map((testCase) => ({
            language_id: languageId,
            source_code: fullCode,
            stdin: testCase.input,
            expected_output: testCase.expectedOutput
        }));
        const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/judge0-callback?submissionId=${submissionId}`;
        const batchSubmissionResponse = await fetch(`${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                submissions: inputForJudge,
                callback_url: callbackUrl
            })
        });
        const batchSubmissionTokens = await batchSubmissionResponse.json();
        return NextResponse.json(batchSubmissionTokens)
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                msg: error.errors
            }, {
                status: 401
            })
        } else if (error instanceof Error) {
            return NextResponse.json({
                msg: error.message
            }, {
                status: 401
            })
        }
        return NextResponse.json({
            msg: "An unknown error occurred"
        }, {
            status: 401
        })
    }
}