import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { formSchema } from "@repo/common/zod"
import prisma from "@repo/db/client";

export async function POST(req: NextRequest) {
    try {
        const validatedBody = formSchema.parse(await req.json());
        const createProblem = await prisma.problem.create({
            data: {
                name: validatedBody.problemName,
                content: validatedBody.content,
                contributedBy: validatedBody.userName,
                difficultyLevel: validatedBody.difficultyLevel
            }
        })
        return NextResponse.json({
            validatedBody
        }, {
            status: 200
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