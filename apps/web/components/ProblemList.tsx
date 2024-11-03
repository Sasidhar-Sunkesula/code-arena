import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "@repo/ui/shad";
import { DifficultyLevel, SubmissionStatus } from "@prisma/client";
import Link from "next/link";
import { Check, CircleAlert } from "lucide-react";

export interface Problem {
    id: number;
    name: string;
    difficultyLevel: DifficultyLevel;
    submissions: Submission[];
    acceptanceRate: string;
    totalSubmissions: number;
}

interface Submission {
    status: SubmissionStatus;
    userId: string;
}

export interface ProblemListProps {
    problems: Problem[];
    contestId: number | null;
    userId: string | null;
}

const levelColor = {
    EASY: "text-green-500 bg-green-50 dark:bg-green-800",
    MEDIUM: "text-yellow-500 bg-yellow-50 dark:bg-yellow-800",
    HARD: "text-red-500 bg-red-50 dark:bg-red-800",
};

export function ProblemList({ problems, contestId, userId }: ProblemListProps) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Problem Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Acceptance Rate</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.length > 0 &&
                        problems.map((problem) => {
                            const userSubmissions = problem.submissions.filter(submission => submission.userId === userId);
                            let statusIcon;
                            if (userId === null) {
                                statusIcon = "NA";
                            } else if (userSubmissions.length === 0) {
                                statusIcon = null; // Show nothing if there are no submissions
                            } else if (userSubmissions.some(submission => submission.status === "Accepted")) {
                                statusIcon = <Check className="w-5" />;
                            } else {
                                statusIcon = <CircleAlert className="text-yellow-500 w-5" />;
                            }
                            return (
                                <TableRow key={problem.id}>
                                    <TableCell className="font-medium">
                                        <Link className="font-semibold hover:underline" href={`/solve/${problem.id}${contestId ? `?contestId=${contestId}` : ''}`}>
                                            {problem.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{statusIcon}</TableCell>
                                    <TableCell>
                                        <Badge variant={"outline"} className={`${levelColor[problem.difficultyLevel]}`}>
                                            {problem.difficultyLevel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{problem.totalSubmissions}</TableCell>
                                    <TableCell>{problem.acceptanceRate}</TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
            {
                problems.length === 0 && <div className="h-28 text-sm border flex justify-center items-center">
                    No problems found
                </div>
            }
        </div>
    );
}