"use client"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Card, CardHeader, CardTitle, CardContent } from "@repo/ui/shad";
import { format } from "date-fns";
import Link from "next/link";

export type RecentACProblems = {
    id: number;
    name: string;
    difficultyLevel: string;
    submittedOn: Date
}
export function RecentAC({ problems }: {
    problems: RecentACProblems[]
}) {
    return (
        <Card className="rounded-sm shadow-sm">
            <CardHeader>
                <CardTitle>
                    Recent Accepted Problems
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Problem Name</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Submitted On</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            problems.map(problem => (
                                <TableRow key={problem.id}>
                                    <TableCell className="font-medium">
                                        <Link className="font-semibold hover:underline" href={`/solve/${problem.id}`}>
                                            {problem.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {problem.difficultyLevel}
                                    </TableCell>
                                    <TableCell>
                                        {format(problem.submittedOn, "yyyy-mm-dd")}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}