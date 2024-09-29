import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "@repo/ui/shad";
import { DifficultyLevel, SubmissionStatus } from "@prisma/client";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

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
    contestId: number;
}
const levelColor = {
    EASY: "text-green-500 bg-green-50 dark:bg-green-800",
    MEDIUM: "text-yellow-500 bg-yellow-50 dark:bg-yellow-800",
    HARD: "text-red-500 bg-red-50 dark:bg-red-800",
}
export function ProblemList({ problems, submissions, contestId }: ProblemListProps) {
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Problem Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Level</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem, index) => (
                        <TableRow key={problem.id}>
                            <TableCell className="font-medium">
                                <Link href={`/solve/${problem.id}?contestId=${contestId}`}>
                                    {problem.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {submissions?.[index]?.status === "Accepted" &&
                                    <CheckCircle className="text-green-500 w-5" />}
                            </TableCell>
                            <TableCell>
                                <Badge variant={"outline"} className={`${levelColor[problem.difficultyLevel]}`}>{problem.difficultyLevel}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}