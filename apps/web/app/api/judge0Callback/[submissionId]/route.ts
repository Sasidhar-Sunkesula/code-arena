import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
// We are not using zod here because, this endpoint will only be hit
// by judge0 server and there is no point of showing runtime error 
// messages to it. 
interface Status {
    id: number,
    description: string
}
interface Body {
    stdout: string | null,  // Puts in base64
    time: string,
    memory: number,
    stderr: string | null,  // Puts in base64
    status: Status
}
export async function PUT(req: NextRequest, { params }: { params: { submissionId: string } }) {
    const body: Body = await req.json();
    const submissionId = parseInt(params.submissionId);
    try {
        // Decode Base64 values
        const decodedStdout = body.stdout ? Buffer.from(body.stdout, 'base64').toString('utf-8') : null;
        const decodedStderr = body.stderr ? Buffer.from(body.stderr, 'base64').toString('utf-8') : null;
        await prisma.submission.update({
            data: {
                status: body.status.description,
                error: decodedStderr,
                memory: body.memory,
                output: decodedStdout,
                runTime: parseFloat(body.time)
            }, where: {
                id: submissionId
            }
        })
        return NextResponse.json({
            msg: "Success"
        }, {
            status: 204
        })
    } catch (error) {
        return NextResponse.json({
            msg: error instanceof Error ? error.message : "Error in updating the status"
        }, {
            status: 401
        })
    }
}