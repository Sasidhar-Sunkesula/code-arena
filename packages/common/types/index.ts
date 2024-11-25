import { z } from "zod";
import { contestFormSchema, credentialSchema, problemFormSchema, scoreSchema, submitCodeSchema } from "../zod";
import { SubmissionStatus } from "@prisma/client";

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
export const SubmissionStatusDisplay: { [key in SubmissionStatus]: string } = {
    [SubmissionStatus.InQueue]: "In Queue",
    [SubmissionStatus.Processing]: "Processing",
    [SubmissionStatus.Accepted]: "Accepted",
    [SubmissionStatus.WrongAnswer]: "Wrong Answer",
    [SubmissionStatus.TimeLimitExceeded]: "Time Limit Exceeded",
    [SubmissionStatus.CompilationError]: "Compilation Error",
    [SubmissionStatus.RuntimeErrorSIGSEGV]: "Runtime Error (SIGSEGV)",
    [SubmissionStatus.RuntimeErrorSIGXFSZ]: "Runtime Error (SIGXFSZ)",
    [SubmissionStatus.RuntimeErrorSIGFPE]: "Runtime Error (SIGFPE)",
    [SubmissionStatus.RuntimeErrorSIGABRT]: "Runtime Error (SIGABRT)",
    [SubmissionStatus.RuntimeErrorNZEC]: "Runtime Error (NZEC)",
    [SubmissionStatus.RuntimeErrorOther]: "Runtime Error (Other)",
    [SubmissionStatus.InternalError]: "Internal Error",
    [SubmissionStatus.ExecFormatError]: "Exec Format Error"
};
export const SubmissionStatusEnum = {
    "In Queue": SubmissionStatus.InQueue,
    "Processing": SubmissionStatus.Processing,
    "Accepted": SubmissionStatus.Accepted,
    "Wrong Answer": SubmissionStatus.WrongAnswer,
    "Time Limit Exceeded": SubmissionStatus.TimeLimitExceeded,
    "Compilation Error": SubmissionStatus.CompilationError,
    "Runtime Error (SIGSEGV)": SubmissionStatus.RuntimeErrorSIGSEGV,
    "Runtime Error (SIGXFSZ)": SubmissionStatus.RuntimeErrorSIGXFSZ,
    "Runtime Error (SIGFPE)": SubmissionStatus.RuntimeErrorSIGFPE,
    "Runtime Error (SIGABRT)": SubmissionStatus.RuntimeErrorSIGABRT,
    "Runtime Error (NZEC)": SubmissionStatus.RuntimeErrorNZEC,
    "Runtime Error (Other)": SubmissionStatus.RuntimeErrorOther,
    "Internal Error": SubmissionStatus.InternalError,
    "Exec Format Error": SubmissionStatus.ExecFormatError
};