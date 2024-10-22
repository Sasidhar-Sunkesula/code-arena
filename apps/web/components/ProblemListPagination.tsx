"use client"

import { Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/shad";

interface ProblemListPaginationProps {
    page: number;
    totalProblems: number;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>
    setPage: React.Dispatch<React.SetStateAction<number>>
}
export function ProblemListPagination({ page, setLimit, setPage, limit, totalProblems }: ProblemListPaginationProps) {
    const totalPages = Math.ceil(totalProblems / limit)
    return (
        <div className="flex justify-evenly items-center">
            <div className="flex items-center gap-x-3">
                <Label className="flex-shrink-0">Problems per page</Label>
                <Select onValueChange={(value) => setLimit(parseInt(value))} defaultValue={limit.toString()}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select number of problems per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-x-2">
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
        </div>
    )
}