import { Button } from "@repo/ui/shad"
import { Card, CardContent, CardFooter } from "@repo/ui/shad"
import { Badge } from "@repo/ui/shad"

interface ProblemItemProps {
    name: string
    difficultyLevel: "EASY" | "MEDIUM" | "HARD"
    // status: "Solved" | "Attempted"
}

export function ProblemItem({ name, difficultyLevel, status }: ProblemItemProps) {
    const levelColor = {
        EASY: "bg-green-500",
        MEDIUM: "bg-yellow-500",
        HARD: "bg-red-500",
    }

    const statusColor = {
        Solved: "bg-green-200 text-green-800",
        Attempted: "bg-yellow-200 text-yellow-800",
        "Not Started": "bg-gray-200 text-gray-800",
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <Badge className={`${levelColor[difficultyLevel]} text-white`}>{difficultyLevel}</Badge>
                </div>
                {/* <Badge className={`mt-2 ${statusColor[status]}`}>{status}</Badge> */}
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full">Solve</Button>
            </CardFooter>
        </Card>
    )
}