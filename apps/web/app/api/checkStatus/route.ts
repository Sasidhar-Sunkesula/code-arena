import { checkStatusSchema } from "@repo/common/zod";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod"

export async function POST(req: NextRequest) {
    try {
        const validatedInput = checkStatusSchema.parse(await req.json());

        // Construct the URL with tokens separated by commas
        const tokensParam = validatedInput.submissionTokens.join(',');
        
        const url = `${process.env.JUDGE0_URL}/submissions/batch?tokens=${tokensParam}&base64_encoded=false`;
        const getBatchSubmissions = await fetch(url);
        if (!getBatchSubmissions.ok) {
            throw new Error("Could not reach Judge0 server");
        }
        const batchSubmissions = await getBatchSubmissions.json();
        return NextResponse.json(batchSubmissions, { status: 200 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                msg: error.errors
            }, {
                status: 400
            })
        }
        if (error instanceof Error) {
            return NextResponse.json({
                msg: error.message
            }, {
                status: 500
            })
        }
        return NextResponse.json({
            msg: "Unable to get the status"
        }, {
            status: 500
        })
    }
}