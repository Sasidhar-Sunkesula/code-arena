import { ProblemItem } from "./ProblemItem"

interface Problem {
    id: number
    name: string
    difficultyLevel: "EASY" | "MEDIUM" | "HARD"
}

interface ProblemListProps {
    problems: Problem[]
}

export function ProblemList({ problems }: ProblemListProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Problems</h2>
            {problems.map((problem) => (
                <ProblemItem key={problem.id} {...problem} />
            ))}
        </div>
    )
}