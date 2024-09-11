import { ProblemItem } from "./ProblemItem"

interface Problem {
    id: number
    name: string
    difficultyLevel: "EASY" | "MEDIUM" | "HARD"
}
interface Submissions {
    status: "SOLVED" | "UNSOLVED",
    problemId: number
}
interface ProblemListProps {
    problems: Problem[],
    submissions: Submissions[]
}

export function ProblemList({ problems, submissions }: ProblemListProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Problems</h2>
            {problems.map((problem, index) => (
                <ProblemItem key={problem.id} {...problem} status={submissions[index]?.status || "UNSOLVED"} />
            ))}
        </div>
    )
}