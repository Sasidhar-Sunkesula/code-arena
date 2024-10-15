import { z } from "zod";
import { formSchema, submitCodeSchema } from "../zod";

export enum DifficultyLevel {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}
// Extract the TypeScript type from the Zod schema
export type FormData = z.infer<typeof formSchema>;

export type SubmitCodeSchema = z.infer<typeof submitCodeSchema>;

export enum SubmissionType {
    REGULAR = "REGULAR",
    CONFIRMATION_TEST = "CONFIRMATION_TEST",
    DEMO = "DEMO"
}