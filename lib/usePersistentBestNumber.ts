"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "./browserStorage";

export function usePersistentBestNumber(
  storageKey: string,
  mode: "max" | "min" = "max"
) {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const syncBest = () => {
      const saved = readStorage(storageKey);
      if (!saved) {
        setBest(null);
        return;
      }

      const parsed = Number(saved);
      setBest(Number.isFinite(parsed) && parsed >= 0 ? parsed : null);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === storageKey) syncBest();
    };

    syncBest();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const commitBest = useCallback((value: number) => {
    setBest((previous) => {
      if (!Number.isFinite(value) || value < 0) return previous;
      if (previous !== null) {
        const improves = mode === "min" ? value < previous : value > previous;
        if (!improves) return previous;
      }

      writeStorage(storageKey, String(value));
      return value;
    });
  }, [mode, storageKey]);

  return [best, commitBest] as const;
}
