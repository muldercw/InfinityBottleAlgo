"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TimelineEntry } from "@/lib/bottle";
import { Trash2 } from "lucide-react";

interface Props {
  timeline: TimelineEntry[];
  onDelete: (id: string) => void;
}

export function PoursTable({ timeline, onDelete }: Props) {
  const pourCount = timeline.filter((e) => e.type === "pour").length;
  const drinkCount = timeline.filter((e) => e.type === "drink").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bottle History</CardTitle>
        <CardDescription>
          {timeline.length === 0
            ? "No activity yet -- add your first bourbon."
            : `${pourCount} pour${pourCount === 1 ? "" : "s"}, ${drinkCount} drink${drinkCount === 1 ? "" : "s"}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Your infinity bottle is empty. Click &quot;Add Pour&quot; to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Proof</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeline.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {entry.type === "pour" ? (
                        <Badge variant="default" className="text-xs">In</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Out</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.type === "pour" ? (
                        <>
                          {entry.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {entry.age} yr
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">
                          {entry.note || "Drink"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {entry.type === "pour" ? entry.proof : "--"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {entry.type === "pour" ? "+" : "-"}{entry.volumeOz} oz
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
