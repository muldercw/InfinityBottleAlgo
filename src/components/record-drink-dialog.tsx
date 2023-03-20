"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassWater } from "lucide-react";

interface Props {
  remainingOz: number;
  onDrink: (data: { volumeOz: number; note: string }) => Promise<void>;
}

export function RecordDrinkDialog({ remainingOz, onDrink }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [volume, setVolume] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const numVolume = Number(volume);
  const valid = numVolume > 0 && numVolume <= remainingOz;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    setError("");
    try {
      await onDrink({ volumeOz: numVolume, note: note.trim() });
      setVolume("");
      setNote("");
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record drink");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" disabled={remainingOz <= 0} />}
      >
        <GlassWater className="mr-2 h-4 w-4" />
        Record Drink
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm!">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record a Drink</DialogTitle>
            <DialogDescription>
              Log a pour from the bottle. {remainingOz.toFixed(1)} oz remaining.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="drink-volume">Volume (oz)</Label>
              <Input
                id="drink-volume"
                type="number"
                min={0}
                max={remainingOz}
                step="0.1"
                placeholder={`Up to ${remainingOz.toFixed(1)}`}
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                autoFocus
              />
              {numVolume > remainingOz && (
                <p className="text-xs text-destructive">
                  Only {remainingOz.toFixed(1)} oz available.
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="drink-note">Note (optional)</Label>
              <Input
                id="drink-note"
                placeholder="e.g. Shared with friends, Tasting night"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!valid || saving}>
              {saving ? "Recording..." : "Record Drink"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
