import { contestFormSchema } from "@repo/common/zod";
import prisma from "@repo/db/client";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest){
    try {
        const validatedBody = contestFormSchema.parse(await req.json());
        const result = await prisma.$transaction(async () => {
            const createContest = await prisma.contest.create({
                data: {
                    name: validatedBody.contestName,
                    contributedBy: validatedBody.userName,
                    level: validatedBody.difficultyLevel,
                    
                }
            })
        })
    }
}