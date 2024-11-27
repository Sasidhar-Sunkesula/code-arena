"use client";

import { ChartData } from "@/app/user/[userName]/page";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@repo/ui/shad";
import { Label, Pie, PieChart } from "recharts";

const chartConfig: {
    [key: string]: {
        label: string,
        color: string
    }
} = {
    EASY: {
        label: "Easy",
        color: "hsl(var(--chart-2))",
    },
    MEDIUM: {
        label: "Medium",
        color: "hsl(var(--chart-4))",
    },
    HARD: {
        label: "Hard",
        color: "hsl(var(--chart-1))",
    }
} satisfies ChartConfig;

export function SolvedProblemsPieChart({ chartData, solved, totalProblems }: { chartData: ChartData[], solved: number, totalProblems: number }) {
    const chartDataWithFill = chartData.map(data => {
        return {
            ...data,
            fill: chartConfig[data.level]?.color
        }
    });

    // Add a placeholder data point if solved is 0
    const displayData = solved === 0 ? [{ level: "NONE", solved: 1, fill: "hsl(var(--chart-1))" }] : chartDataWithFill;

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square min-w-[240px] max-h-[240px]"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                />
                <Pie
                    data={displayData}
                    dataKey="solved"
                    nameKey="level"
                    innerRadius={85}
                    strokeWidth={10}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-medium"
                                        >
                                            {solved} / {totalProblems}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Solved
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}