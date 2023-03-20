import type { Pour, Drink } from "./bottle";

export interface BottleData {
  pours: Pour[];
  drinks: Drink[];
}

const STORAGE_KEY = "infinity-bottle-data";

// --- localStorage adapter (desktop / mobile) ---

function readLocal(): BottleData {
  if (typeof window === "undefined") return { pours: [], drinks: [] };
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { pours: [], drinks: [] };
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return { pours: parsed, drinks: [] };
  return { pours: parsed.pours ?? [], drinks: parsed.drinks ?? [] };
}

function writeLocal(data: BottleData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const localStore = {
  async load(): Promise<BottleData> {
    return readLocal();
  },
  async addPour(pour: Omit<Pour, "id" | "addedAt">): Promise<void> {
    const data = readLocal();
    data.pours.push({
      ...pour,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    });
    writeLocal(data);
  },
  async addDrink(drink: { volumeOz: number; note: string }): Promise<void> {
    const data = readLocal();
    data.drinks.push({
      id: crypto.randomUUID(),
      volumeOz: drink.volumeOz,
      note: drink.note,
      drankAt: new Date().toISOString(),
    });
    writeLocal(data);
  },
  async deleteEntry(id: string): Promise<void> {
    const data = readLocal();
    data.pours = data.pours.filter((p) => p.id !== id);
    data.drinks = data.drinks.filter((d) => d.id !== id);
    writeLocal(data);
  },
};

// --- API adapter (Docker / web server) ---

export const apiStore = {
  async load(): Promise<BottleData> {
    const res = await fetch("/api/bottle");
    return res.json();
  },
  async addPour(pour: { name: string; age: number; proof: number; volumeOz: number }): Promise<void> {
    const res = await fetch("/api/bottle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pour),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to add pour");
    }
  },
  async addDrink(drink: { volumeOz: number; note: string }): Promise<void> {
    const res = await fetch("/api/bottle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "drink", ...drink }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to record drink");
    }
  },
  async deleteEntry(id: string): Promise<void> {
    const res = await fetch(`/api/bottle?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete entry");
  },
};

export type Store = typeof localStore;

export function getStore(): Store {
  if (process.env.NEXT_PUBLIC_STORAGE === "local") return localStore;
  return apiStore;
}
