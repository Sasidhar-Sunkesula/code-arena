import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/shad";
import { Progress } from "@repo/ui/shad";
import { Timer } from "@/components/Timer";
import { SubmissionStatus } from "@prisma/client";

interface ContestDetailsProps {
    name: string;
    problemCount: number;
    endTime: Date;
    submissions: { problemId: number; status: SubmissionStatus }[];
}

export function ContestDetails({ name, problemCount, endTime, submissions }: ContestDetailsProps) {
    // Use a Map to track unique problem IDs with accepted submissions
    const problemStatusMap = new Map<number, boolean>();

    submissions?.forEach((submission) => {
        if (submission.status === "Accepted") {
            problemStatusMap.set(submission.problemId, true);
        }
    });

    const solvedProblems = problemStatusMap.size;
    const completionPercentage = (solvedProblems / problemCount) * 100;
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
                {submissions && submissions.length > 0 && (
                    <div>
                        <h3 className="font-semibold">Completion Status</h3>
                        <Progress value={completionPercentage} className="mt-2" />
                        <p className="text-sm text-muted-foreground mt-1">
                            {solvedProblems} out of {problemCount} problems solved
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}