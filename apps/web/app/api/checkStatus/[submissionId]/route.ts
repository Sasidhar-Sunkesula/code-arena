import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const paramsSchema = z.object({
    submissionId: z.string().refine((val) => !isNaN(parseInt(val)), {
        message: "submissionId must be a valid number",
    }),
});

export async function GET(req: NextRequest, { params }: { params: { submissionId: string } }) {
    try {
        const parseResult = paramsSchema.parse(params);
        const submissionId = parseInt(parseResult.submissionId);
        const submissionResult = await prisma.submission.findUnique({
            where: {
                id: submissionId
            }
        })
        if (!submissionResult) {
            throw new Error("Unable to find the submission")
        }
        if (submissionResult.status === "Processing" || submissionResult.status === "InQueue") {
            return NextResponse.json({
                msg: "PENDING"
            })
        }
        return NextResponse.json({
            data: submissionResult
        })
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