"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ProofPoint } from "@/lib/bottle";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface Props {
  proofHistory: ProofPoint[];
}

const chartConfig: ChartConfig = {
  blendedProof: { label: "Blended Proof", color: "var(--chart-1)" },
};

export function ProofTimeline({ proofHistory }: Props) {
  if (proofHistory.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Proof Over Time</CardTitle>
          <CardDescription>How the blend evolves with each pour</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center py-12 text-muted-foreground">
          Add pours to see proof evolution.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Proof Over Time</CardTitle>
        <CardDescription>How the blend evolves with each pour</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={proofHistory} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="pourNumber"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `#${v}`}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 5", "dataMax + 5"]}
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${Number(value).toFixed(1)} proof`}
                  labelFormatter={(_, payload) => {
                    if (payload?.[0]?.payload) {
                      const p = payload[0].payload as ProofPoint;
                      return `Pour #${p.pourNumber}: ${p.name}`;
                    }
                    return "";
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="blendedProof"
              stroke="#c2742e"
              strokeWidth={3}
              dot={{ r: 6, fill: "#c2742e", strokeWidth: 2, stroke: "var(--card)" }}
              activeDot={{ r: 8, strokeWidth: 2, stroke: "var(--background)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
