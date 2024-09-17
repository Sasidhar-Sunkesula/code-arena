import { ProblemItem } from "./ProblemItem"
import { DifficultyLevel, SubmissionStatus } from "@prisma/client";

interface Problem {
    id: number;
    name: string;
    difficultyLevel: DifficultyLevel;
}

interface Submission {
    status: SubmissionStatus;
}

interface ProblemListProps {
    problems: Problem[];
    submissions: Submission[];
}

export function ProblemList({ problems, submissions }: ProblemListProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Problems</h2>
            {problems.map((problem, index) => (
                <ProblemItem key={problem.id} {...problem} status={submissions?.[index]?.status!} />
            ))}
        </div>
    )
}