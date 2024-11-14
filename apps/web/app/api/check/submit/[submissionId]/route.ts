import { paramsSchema } from "@repo/common/zod";
import prisma from "@repo/db/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET({ params }: { params: { submissionId: string } }) {
    try {
        const parseResult = paramsSchema.parse(params);
        const submissionId = parseInt(parseResult.submissionId);
        const submissionResult = await prisma.submission.findUnique({
            where: {
                id: submissionId
            },
            include: {
                testCaseResults: {
                    include: {
                        testCase: true
                    }
                }
            }
        });

        if (!submissionResult) {
            throw new Error("Unable to find the submission");
        }

        if (submissionResult.status === "Processing" || submissionResult.status === "InQueue") {
            return NextResponse.json({
                msg: "PENDING"
            });
        }

        return NextResponse.json({
            data: submissionResult
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                msg: error.errors[0]?.message
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