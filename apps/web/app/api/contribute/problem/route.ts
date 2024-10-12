import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { formSchema } from "@repo/common/zod"

export async function POST(req: NextRequest) {
    try {
        const validatedBody = formSchema.parse(await req.json());
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