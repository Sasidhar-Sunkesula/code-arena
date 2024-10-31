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
    boilerplateCodes: z.record(z.string()).refine(
        (codes) => Object.values(codes).some((code) => code.trim().length > 50),
        { message: "At least one boilerplate code must be provided." }
    ),
    testCases: z.array(z.object({
        input: z.string().min(1, { message: "Input is required" }),
        expectedOutput: z.string().min(1, { message: "Expected output is required" })
    })).min(4, { message: "At least 4 test cases are required" }),
    difficultyLevel: z.nativeEnum(DifficultyLevel)
});

function normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const contestFormSchema = z.object({
    contestName: z.string()
        .min(3, { message: "Contest name must be at least 3 characters." })
        .max(50, { message: "Contest name must be at most 50 characters." }),
    userName: z.string()
        .min(3, { message: "User name must be at least 3 characters." })
        .max(50, { message: "User name must be at most 50 characters." }),
    difficultyLevel: z.nativeEnum(ContestLevel),
    problemIds: z.array(z.number()),
    startsOn: z.date({
        required_error: "A start date is required."
    }).refine(date => normalizeDate(date) >= normalizeDate(new Date()), {
        message: "Start date cannot be in the past."
    }),
    endsOn: z.date({
        required_error: "An end date is required."
    })
}).superRefine((data, ctx) => {
    const normalizedStartsOn = normalizeDate(data.startsOn);
    const normalizedEndsOn = normalizeDate(data.endsOn);

    if (normalizedEndsOn < normalizedStartsOn) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after the start date.",
            path: ["endsOn"]
        });
    }
    if (normalizedEndsOn.getTime() === normalizedStartsOn.getTime()) {
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
    problemId: z.number(),
    submissionTokens: z.array(z.string())
})

// export const scoreSchema = z.object({
//     userId: z.string(),
//     score: z.number()
// })