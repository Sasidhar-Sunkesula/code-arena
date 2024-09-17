import { Card, CardContent, CardFooter } from "@repo/ui/shad"
import { Badge } from "@repo/ui/shad"
import { CheckCircle } from "lucide-react"
import { ButtonClient } from "./ButtonClient"
import { DifficultyLevel, SubmissionStatus } from "@prisma/client";

interface ProblemItemProps {
    id: number;
    name: string;
    difficultyLevel: DifficultyLevel;
    status: SubmissionStatus;
}

export function ProblemItem({ id, name, difficultyLevel, status }: ProblemItemProps) {
    const levelColor = {
        EASY: "bg-green-500",
        MEDIUM: "bg-yellow-600",
        HARD: "bg-red-500",
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center gap-x-3">
                        {name}
                        {status === "Accepted" && (
                            <CheckCircle className="text-green-500 w-5" />
                        )}
                    </h3>
                    <Badge className={`${levelColor[difficultyLevel]} text-white`}>{difficultyLevel}</Badge>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <ButtonClient linkTo={`/solve/${id}`} text="Solve" />
            </CardFooter>
        </Card>
    )
}