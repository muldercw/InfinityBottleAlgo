import { useCallback, useEffect, useState } from "react";
import type { BottleStats } from "./bottle";
import { computeStats } from "./bottle";
import { getStore, type BottleData } from "./storage";

const store = getStore();

export function useBottle() {
  const [data, setData] = useState<BottleData>({ pours: [], drinks: [] });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const loaded = await store.load();
    setData(loaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPour = useCallback(
    async (pour: { name: string; age: number; proof: number; volumeOz: number }) => {
      await store.addPour(pour);
      await refresh();
    },
    [refresh],
  );

  const addDrink = useCallback(
    async (drink: { volumeOz: number; note: string }) => {
      await store.addDrink(drink);
      await refresh();
    },
    [refresh],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      await store.deleteEntry(id);
      await refresh();
    },
    [refresh],
  );

  const stats: BottleStats = computeStats(data.pours, data.drinks);

  return { stats, loading, addPour, addDrink, deleteEntry };
}
