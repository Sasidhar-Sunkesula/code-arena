import { z } from "zod";
import { contestFormSchema, problemFormSchema, submitCodeSchema } from "../zod";

export enum DifficultyLevel {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}
// Extract the TypeScript type from the Zod schema
export type ProblemFormType = z.infer<typeof problemFormSchema>;
export type ContestFormType = z.infer<typeof contestFormSchema>;
export type SubmitCodeSchema = z.infer<typeof submitCodeSchema>;

export enum SubmissionType {
    RUN = "RUN",
    SUBMIT = "SUBMIT",
}

export enum ContestLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED"
}