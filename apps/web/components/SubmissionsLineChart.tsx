"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/shad";

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SubmissionsLineChart({
  chartData,
}: {
  chartData: { month: string; submissions: number }[];
}) {
  const totalSubmissions = chartData.reduce(
    (acc, curr) => (acc += curr.submissions),
    0,
  );
  return (
    <Card className="rounded-sm shadow-sm">
      <CardHeader>
        <CardTitle>
          {totalSubmissions} submissions in the past one year
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="submissions"
              type="natural"
              stroke="var(--color-submissions)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-submissions)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
