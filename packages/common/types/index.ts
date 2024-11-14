import { z } from "zod";
import { contestFormSchema, credentialSchema, problemFormSchema, scoreSchema, submitCodeSchema } from "../zod";

export enum DifficultyLevel {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}
// Extract the TypeScript type from the Zod schema
export type ProblemFormType = z.infer<typeof problemFormSchema>;
export type ContestFormType = z.infer<typeof contestFormSchema>;
export type SubmitCodeSchema = z.infer<typeof submitCodeSchema>;
export type ScoreSchema = z.infer<typeof scoreSchema>;
export type CredentialSchema = z.infer<typeof credentialSchema>;

export enum SubmissionType {
    RUN = "RUN",
    SUBMIT = "SUBMIT",
}

export enum ContestLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED"
}

interface Status {
    id: number,
    description: string
}

export interface SubmissionResult {
    stdout: string | null,  // Puts in base64
    time: string,
    memory: number,
    stderr: string | null,  // Puts in base64
    status: Status
}

export enum ActionType {
    New = "new",
    Update = "update"
}