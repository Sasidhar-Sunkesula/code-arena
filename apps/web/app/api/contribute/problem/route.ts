import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { problemFormSchema } from "@repo/common/zod"
import prisma from "@repo/db/client";

export async function POST(req: NextRequest) {
    try {
        const validatedBody = problemFormSchema.parse(await req.json());
        const result = await prisma.$transaction(async () => {
            const createProblem = await prisma.problem.create({
                data: {
                    name: validatedBody.problemName,
                    content: validatedBody.content,
                    contributedBy: validatedBody.userName,
                    difficultyLevel: validatedBody.difficultyLevel
                }
            });

            const boilerplateData = await Promise.all(
                Object.entries(validatedBody.boilerplateCodes).map(async ([languageName, code]) => {
                    const language = await prisma.language.findFirst({
                        where: { judge0Name: languageName }
                    });

                    if (!language) {
                        throw new Error(`Language not found: ${languageName}`);
                    }

                    return {
                        languageId: language.id,
                        boilerPlateCode: code,
                        problemId: createProblem.id
                    };
                })
            );

            const createBoilerplateCodes = await prisma.boilerPlate.createMany({
                data: boilerplateData
            });

            const createTestCases = await prisma.testCase.createMany({
                data: validatedBody.testCases.map(testCase => ({
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    problemId: createProblem.id
                }))
            });

            return { createProblem, createBoilerplateCodes, createTestCases };
        });
        return NextResponse.json({
            createdProblemId: result.createProblem.id
        }, {
            status: 200
        })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                mdg: error.errors[0]?.message
            }, {
                status: 400
            })
        } else if (error instanceof Error) {
            return NextResponse.json({
                msg: error.message.length < 50 ? error.message : "Unable to create the problem"
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