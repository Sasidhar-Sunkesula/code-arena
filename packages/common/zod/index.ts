import { z } from "zod"
import { ContestLevel, DifficultyLevel, SubmissionType } from "../types";

export const problemFormSchema = z.object({
    problemName: z.string()
        .min(3, { message: "Problem name must be at least 3 characters." })
        .max(50, { message: "Problem name must be at most 50 characters." }),
    userName: z.string()
        .min(3, { message: "User name must be at least 3 characters." })
        .max(50, { message: "User name must be at most 50 characters." }),
    content: z.string()
        .min(50, { message: "Content must be at least 50 characters." })
        .max(750, { message: "Content must be at most 750 characters." }),
    boilerplateCodes: z.array(z.object({
        judge0Name: z.string(),
        initialFunction: z.string(),
        callerCode: z.string()
    })).refine(
        (codes) => codes.some(code => code.initialFunction.trim().length > 0 && code.callerCode.trim().length > 0),
        { message: "At least one boilerplate code must be provided." }
    ),
    testCases: z.array(z.object({
        input: z.string().min(1, { message: "Input is required" }),
        expectedOutput: z.string().min(1, { message: "Expected output is required" })
    })).min(4, { message: "At least 4 test cases are required" }),
    difficultyLevel: z.nativeEnum(DifficultyLevel)
});

export const contestFormSchema = z.object({
    contestName: z.string()
        .min(3, { message: "Contest name must be at least 3 characters." })
        .max(50, { message: "Contest name must be at most 50 characters." }),
    userName: z.string()
        .min(3, { message: "User name must be at least 3 characters." })
        .max(50, { message: "User name must be at most 50 characters." }),
    difficultyLevel: z.nativeEnum(ContestLevel),
    problemIds: z.array(z.number()),
    startsOn: z.string({
        required_error: "A start date is required."
    }).refine(dateStr => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date >= new Date();
    }, {
        message: "Start date cannot be in the past."
    }),
    endsOn: z.string({
        required_error: "An end date is required."
    }).refine(dateStr => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date >= new Date();
    }, {
        message: "End date cannot be in the past."
    })
}).superRefine((data, ctx) => {
    const startsOn = new Date(data.startsOn)
    const endsOn = new Date(data.endsOn)

    if (startsOn >= endsOn) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after the start date.",
            path: ["endsOn"]
        });
    }
    if (startsOn === endsOn) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start date and end date cannot be the same.",
            path: ["endsOn"]
        });
    }
});

export const paramsSchema = z.object({
    submissionId: z.string().refine((val) => !isNaN(parseInt(val)), {
        message: "submissionId must be a valid number",
    }),
});

export const submitCodeSchema = z.object({
    problemId: z.number().optional(),
    testCases: z.array(z.object({
        input: z.string(),
        expectedOutput: z.string()
    })).optional(),
    tempId: z.string().optional(),
    submittedCode: z.string({ message: "Code should not be empty" }),
    languageId: z.number({ message: "Language Id is required" }),
    contestId: z.number().optional(),
    type: z.nativeEnum(SubmissionType, {
        message: "Type must be either 'RUN' or 'SUBMIT"
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

export const checkStatusSchema = z.object({
    problemId: z.number().optional(),
    testCases: z.array(z.object({
        input: z.string(),
        expectedOutput: z.string()
    })).optional(),
    submissionTokens: z.array(z.string())
})

export const scoreSchema = z.object({
    userId: z.string(),
    score: z.number(),
    userName: z.string(),
    country: z.string()
})