import { Timer } from "@/components/Timer";
import { SubmissionStatus } from "@prisma/client";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Progress } from "@repo/ui/shad";
import { TrophyIcon } from "lucide-react";
import Link from "next/link";

interface ContestDetailsProps {
    name: string;
    problemCount: number;
    endTime: Date;
    contributedBy: string;
    contestId: number;
    submissions: { problemId: number; status: SubmissionStatus }[];
}

export function ContestDetails({ name, contributedBy, contestId, problemCount, endTime, submissions }: ContestDetailsProps) {
    // Use a Map to track unique problem IDs with accepted submissions
    const problemStatusMap = new Map<number, boolean>();

    submissions.forEach((submission) => {
        if (submission.status === "Accepted") {
            problemStatusMap.set(submission.problemId, true);
        }
    });

    const solvedProblems = problemStatusMap.size;
    const completionPercentage = (solvedProblems / problemCount) * 100;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center underline">Contest Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold">Contest Name</h3>
                        <p>{name}</p>
                    </div>
                    <Badge variant={"secondary"} className="flex-col px-3 py-2">
                        <span>Contributed by</span>
                        <span>{contributedBy}</span>
                    </Badge>
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
            <CardFooter className="flex-col gap-y-3">
                <Button className="w-full" asChild>
                    <Link href={`/leaderboard/${contestId}`}>
                        Current Leaderboard
                        <TrophyIcon className="w-4 ml-2" />
                    </Link>
                </Button>
                <p className="text-sm">Note: Problem Status, Submissions and Acceptance Rate are contest specific.</p>
            </CardFooter>
        </Card>
    );
}