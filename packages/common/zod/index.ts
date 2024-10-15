import { z } from "zod"
import { DifficultyLevel, SubmissionType } from "../types";

export const formSchema = z.object({
    problemName: z.string()
        .min(3, { message: "Problem name must be at least 3 characters." })
        .max(50, { message: "Problem name must be at most 50 characters." }),
    userName: z.string()
        .min(3, { message: "User name must be at least 3 characters." })
        .max(50, { message: "User name must be at most 50 characters." }),
    content: z.string()
        .min(50, { message: "Content must be at least 50 characters." })
        .max(750, { message: "Content must be at most 750 characters." }),
    boilerplateCodes: z.record(z.string()).refine(
        (codes) => Object.values(codes).some((code) => code.trim().length > 50),
        { message: "At least one boilerplate code must be provided." }
    ),
    testCases: z.array(z.object({
        input: z.string().min(1, { message: "Input is required" }),
        expected_output: z.string().min(1, { message: "Expected output is required" })
    })).min(4, { message: "At least 4 test cases are required" }),
    difficultyLevel: z.nativeEnum(DifficultyLevel)
});

export const paramsSchema = z.object({
    submissionId: z.string().refine((val) => !isNaN(parseInt(val)), {
        message: "submissionId must be a valid number",
    }),
});

export const submitCodeSchema = z.object({
    problemId: z.number().optional(),
    submittedCode: z.string({ message: "Code should not be empty" }),
    languageId: z.number({ message: "Language Id is required" }),
    contestId: z.number().optional(),
    type: z.nativeEnum(SubmissionType, {
        message: "Type must be either 'REGULAR', 'CONFIRMATION_TEST', or 'DEMO'"
    })
})

export const searchParamsSchema = z.object({
    type: z.enum(["contest", "problem"], {
        message: "Type must be either 'contest' or 'problem'",
    })
});

export const credentialSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 8 characters long" })
})
