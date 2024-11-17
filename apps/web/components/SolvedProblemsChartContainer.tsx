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
import { DifficultyLevel } from "@repo/common/types"

export type ChartData = {
    level: string,
    solved: number
}

export function SolvedProblemsChart({ chartData, solved, totalProblems }: { chartData: ChartData[], solved: number, totalProblems: number }) {
    return (
        <Card className="flex flex-col max-w-md rounded-sm shadow-sm">
            <CardHeader className="items-center">
                <CardTitle>Solved Problems Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
                <SolvedProblemsPieChart
                    chartData={chartData}
                    solved={solved}
                    totalProblems={totalProblems}
                />
                <div className="space-y-2">
                    <SolvedProblemsByLevel type={DifficultyLevel.EASY} solved={200} />
                    <SolvedProblemsByLevel type={DifficultyLevel.MEDIUM} solved={200} />
                    <SolvedProblemsByLevel type={DifficultyLevel.HARD} solved={200} />
                </div>
            </CardContent>
        </Card>
    )
}
