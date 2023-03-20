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
import type { CompositionEntry } from "@/lib/bottle";
import { Pie, PieChart, Cell } from "recharts";

interface Props {
  composition: CompositionEntry[];
}

export function CompositionChart({ composition }: Props) {
  if (composition.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Composition</CardTitle>
          <CardDescription>Blend breakdown by bourbon</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center py-12 text-muted-foreground">
          Add pours to see the blend composition.
        </CardContent>
      </Card>
    );
  }

  const config: ChartConfig = {};
  for (const entry of composition) {
    config[entry.name] = { label: entry.name, color: entry.fill };
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Composition</CardTitle>
        <CardDescription>Blend breakdown by bourbon</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <span>
                      {name}: {Number(value).toFixed(1)}%
                    </span>
                  )}
                />
              }
            />
            <Pie
              data={composition}
              dataKey="percent"
              nameKey="name"
              innerRadius={60}
              outerRadius={110}
              strokeWidth={2}
              stroke="var(--background)"
            >
              {composition.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 space-y-1.5">
          {composition.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="font-medium tabular-nums">{entry.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
