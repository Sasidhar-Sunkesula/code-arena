import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/shad"
import { Progress } from "@repo/ui/shad"
import { Timer } from "@/components/Timer"

interface ContestDetailsProps {
    name: string
    problemCount: number
    endTime: Date
    submissions: { status: "SOLVED" | "UNSOLVED" }[]
}

export function ContestDetails({ name, problemCount, endTime, submissions }: ContestDetailsProps) {
    const solvedProblems = submissions.filter((submission) => submission.status === "SOLVED").length
    const completionPercentage = (solvedProblems / problemCount) * 100

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contest Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold">Contest Name</h3>
                    <p>{name}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Number of Problems</h3>
                    <p>{problemCount}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Remaining Time</h3>
                    <Timer endTime={endTime} />
                </div>
                <div>
                    <h3 className="font-semibold">Completion Status</h3>
                    <Progress value={completionPercentage} className="mt-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                        {solvedProblems} out of {problemCount} problems solved
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}