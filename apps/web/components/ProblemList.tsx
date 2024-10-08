import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "@repo/ui/shad";
import { DifficultyLevel, SubmissionStatus } from "@prisma/client";
import Link from "next/link";
import { CheckCircle, CircleXIcon } from "lucide-react";

interface Problem {
    id: number;
    name: string;
    difficultyLevel: DifficultyLevel;
    _count: {
        submissions: number;
    };
    submissions: Submission[];
}

interface Submission {
    status: SubmissionStatus;
}

interface ProblemListProps {
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
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Problem Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Submissions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => {
                        let statusIcon;
                        if (userId === null) {
                            statusIcon = "NA";
                        } else if (problem._count.submissions === 0) {
                            statusIcon = null; // Show nothing if there are no submissions
                        } else if (problem.submissions?.some(submission => submission.status === "Accepted")) {
                            statusIcon = <CheckCircle className="text-green-500 w-5" />;
                        } else {
                            statusIcon = <CircleXIcon className="text-yellow-500 w-5" />;
                        }
                        return (
                            <TableRow key={problem.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/solve/${problem.id}${contestId ? `?contestId=${contestId}` : ''}`}>
                                        {problem.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {statusIcon}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={"outline"} className={`${levelColor[problem.difficultyLevel]}`}>
                                        {problem.difficultyLevel}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {problem._count.submissions}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}