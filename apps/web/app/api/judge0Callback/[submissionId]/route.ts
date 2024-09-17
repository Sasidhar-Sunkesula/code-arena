import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { SubmissionStatus } from "@prisma/client";

function mapStatusDescriptionToEnum(description: string): SubmissionStatus {
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
    if (!submissionId) {
        return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }
    try {
        // Decode Base64 values
        const decodedStdout = body.stdout ? Buffer.from(body.stdout, 'base64').toString('utf-8') : null;
        const decodedStderr = body.stderr ? Buffer.from(body.stderr, 'base64').toString('utf-8') : null;
        // Map status description to enum
        const statusEnum = mapStatusDescriptionToEnum(body.status.description)
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: statusEnum,
                error: decodedStderr,
                memory: body.memory,
                output: decodedStdout,
                runTime: parseFloat(body.time)
            }
        });
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