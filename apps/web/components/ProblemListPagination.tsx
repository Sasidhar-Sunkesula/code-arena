"use client"

import { Button } from "@repo/ui/shad";

interface ProblemListPaginationProps {
    page: number;
    totalProblems: number;
    limit: number;
    setPage: React.Dispatch<React.SetStateAction<number>>
}
export function ProblemListPagination({ page, setPage, limit, totalProblems }: ProblemListPaginationProps) {
    const totalPages = Math.ceil(totalProblems / limit)
    return (
        <div className="flex justify-center">
            {
                Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index}
                        variant={page === index + 1 ? "default" : "outline"}
                        onClick={() => setPage(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))
            }
        </div>
    )
}