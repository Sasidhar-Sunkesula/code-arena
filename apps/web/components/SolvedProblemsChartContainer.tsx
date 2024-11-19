"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@repo/ui/shad"
import { SolvedProblemsPieChart } from "./SolvedProblemsPieChart"
import { SolvedProblemsByLevel } from "./SolvedProblemsByLevel"
import { ChartData } from "@/app/user/[userName]/page"

export function SolvedProblemsChart({ chartData, solved, totalProblems }: { chartData: ChartData[], solved: number, totalProblems: number }) {
    return (
        <Card className="flex flex-col max-w-md rounded-sm shadow-sm">
            <CardHeader className="items-center mb-0 pb-0">
                <CardTitle>Solved Problems Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
                <SolvedProblemsPieChart
                    chartData={chartData}
                    solved={solved}
                    totalProblems={totalProblems}
                />
                <div className="flex items-center gap-x-3">
                    {
                        chartData.map(level => (
                            <SolvedProblemsByLevel
                                key={level.level}
                                type={level.level}
                                solved={level.solved}
                                total={level.total}
                            />
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}
