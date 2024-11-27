"use client"

import { getSuffix } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ChartContainer,
} from "@repo/ui/shad";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

interface ChartConfig {
    runTime: {
        label: string;
        color: string;
    };
    memory: {
        label: string;
        color: string;
    };
}
interface ChartData {
    runTime: number,
    memory: number,
    runTimePercentage: number,
    memoryPercentage: number
}
const chartConfig = {
    runTime: {
        label: "Runtime",
        color: "hsl(var(--chart-1))",
    },
    memory: {
        label: "Memory",
        color: "hsl(var(--chart-2))",
    },
}
export function SubmissionStand({ chartData, currentSubmission }: { chartData: ChartData[], currentSubmission: { [K in keyof ChartConfig]: number } }) {
    const [activeChart, setActiveChart] = useState<keyof ChartConfig>("runTime")
    const percentageKey = activeChart === "runTime" ? "runTimePercentage" : "memoryPercentage";
    // Calculate beatsInRunTime and beatsInMemory
    const totalSubmissions = chartData.length;
    const slowerSubmissions = chartData.filter(data => data.runTime > currentSubmission.runTime).length;
    const beatsInRunTime = ((slowerSubmissions / totalSubmissions) * 100).toFixed(2);

    const higherMemorySubmissions = chartData.filter(data => data.memory > currentSubmission.memory).length;
    const beatsInMemory = ((higherMemorySubmissions / totalSubmissions) * 100).toFixed(2);

    return (
        <Card className="rounded-sm shadow-sm min-h-[50vh]">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>
                        {activeChart === "runTime"
                            ? `Beats ${beatsInRunTime}% of people in Runtime`
                            : `Beats ${beatsInMemory}% of people in Memory`}
                    </CardTitle>
                    <CardDescription>
                        Showing total accepted submissions data since the first one
                    </CardDescription>
                </div>
                <div className="flex">
                    {["runTime", "memory"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {currentSubmission[chart] + getSuffix(chart)}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-0 py-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={activeChart}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                return value.toFixed(2) + getSuffix(activeChart)
                            }}
                        />
                        <YAxis
                            width={30}
                            tickLine={false}
                            axisLine={true}
                            tickFormatter={(value) => value.toFixed(1)}
                        />
                        <Tooltip
                            content={({ payload }) => {
                                if (payload && payload.length) {
                                    const data = payload[0]?.payload;
                                    return (
                                        <div className="px-3 py-2 bg-primary-foreground rounded-2xl shadow">
                                            {`${data[percentageKey]}% of submissions used ${data[activeChart]}${getSuffix(activeChart)}`}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey={percentageKey} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}