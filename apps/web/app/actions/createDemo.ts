"use server"

import prisma from "@repo/db/client";
import { ZodError } from "zod";

export async function createDemo() {
    try {
        const demoEmail = "demo" + Math.floor(Math.random() * 654321) + "@gmail.com";
        const demoPass = Math.floor(Math.random() * 654321).toString()
        const demoUser = await prisma.user.create({
            data: {
                email: demoEmail,
                password: demoPass
            }
        })
        // Fetch all problem IDs
        const problemIds = await prisma.problem.findMany({
            select: { id: true }
        })
        // Select a random problem ID
        const randomProblemId = problemIds[Math.floor(Math.random() * problemIds.length)]?.id;
        return {
            id: demoUser.id,
            problemId: randomProblemId,
            status: 200
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                msg: error.errors[0]?.message,
                status: 400
            }
        }
        if (error instanceof Error) {
            return {
                msg: error.message,
                status: 500
            }
        }
        return {
            msg: "Unable to create a demo at the moment",
            status: 500
        }
    }
}