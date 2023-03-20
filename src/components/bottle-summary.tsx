"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BottleStats } from "@/lib/bottle";
import { Droplets, FlaskConical, GlassWater, Hash, Percent } from "lucide-react";

interface Props {
  stats: BottleStats;
}

const cards = [
  {
    title: "Total Pours",
    icon: Hash,
    value: (s: BottleStats) => s.totalPours.toString(),
    sub: (s: BottleStats) =>
      s.totalPours === 1 ? "bourbon added" : "bourbons added",
  },
  {
    title: "Blended Proof",
    icon: FlaskConical,
    value: (s: BottleStats) => s.blendedProof.toFixed(1),
    sub: () => "volume-weighted",
  },
  {
    title: "ABV",
    icon: Percent,
    value: (s: BottleStats) => `${s.blendedAbv.toFixed(1)}%`,
    sub: () => "alcohol by volume",
  },
  {
    title: "Remaining",
    icon: Droplets,
    value: (s: BottleStats) => `${s.remainingOz.toFixed(1)} oz`,
    sub: (s: BottleStats) => `${s.totalPoured.toFixed(1)} oz poured total`,
  },
  {
    title: "Consumed",
    icon: GlassWater,
    value: (s: BottleStats) => `${s.totalDrunk.toFixed(1)} oz`,
    sub: (s: BottleStats) =>
      s.totalPoured > 0
        ? `${((s.totalDrunk / s.totalPoured) * 100).toFixed(0)}% of total`
        : "nothing yet",
  },
];

export function BottleSummary({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {c.title}
            </CardTitle>
            <c.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.value(stats)}</div>
            <p className="text-xs text-muted-foreground">{c.sub(stats)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
