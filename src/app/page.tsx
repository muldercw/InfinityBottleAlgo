"use client";

import { useBottle } from "@/lib/hooks";
import { BottleSummary } from "@/components/bottle-summary";
import { CompositionChart } from "@/components/composition-chart";
import { ProofTimeline } from "@/components/proof-timeline";
import { PoursTable } from "@/components/pours-table";
import { AddPourDialog } from "@/components/add-pour-dialog";
import { RecordDrinkDialog } from "@/components/record-drink-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Wine } from "lucide-react";

export default function Home() {
  const { stats, loading, addPour, addDrink, deleteEntry } = useBottle();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Wine className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight">
              Infinity Bottle
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <AddPourDialog onAdd={addPour} />
            <RecordDrinkDialog remainingOz={stats.remainingOz} onDrink={addDrink} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6">
        <BottleSummary stats={stats} />

        <Separator />

        <div className="grid gap-6 lg:grid-cols-2">
          <CompositionChart composition={stats.composition} />
          <ProofTimeline proofHistory={stats.proofHistory} />
        </div>

        <Separator />

        <PoursTable timeline={stats.timeline} onDelete={deleteEntry} />
      </main>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        Infinity Bottle Tracker &mdash; built by{" "}
        <a
          href="https://github.com/muldercw"
          className="underline underline-offset-2 hover:text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          muldercw
        </a>
      </footer>
    </div>
  );
}
