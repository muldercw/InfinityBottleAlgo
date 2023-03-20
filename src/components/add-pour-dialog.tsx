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
import { Plus } from "lucide-react";

interface Props {
  onAdd: (data: {
    name: string;
    age: number;
    proof: number;
    volumeOz: number;
  }) => Promise<void>;
}

export function AddPourDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [proof, setProof] = useState("");
  const [volume, setVolume] = useState("");

  const valid =
    name.trim().length > 0 &&
    Number(age) >= 0 &&
    Number(proof) > 0 &&
    Number(volume) > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    try {
      await onAdd({
        name: name.trim(),
        age: Number(age),
        proof: Number(proof),
        volumeOz: Number(volume),
      });
      setName("");
      setAge("");
      setProof("");
      setVolume("");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Pour
      </DialogTrigger>
      <DialogContent className="sm:max-w-md!">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a Pour</DialogTitle>
            <DialogDescription>
              Add a new bourbon to your infinity bottle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Bourbon Name</Label>
              <Input
                id="name"
                placeholder="e.g. Buffalo Trace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  min={0}
                  placeholder="4"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="proof">Proof</Label>
                <Input
                  id="proof"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="90"
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="volume">Volume (oz)</Label>
                <Input
                  id="volume"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="1.5"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!valid || saving}>
              {saving ? "Adding..." : "Add to Bottle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
