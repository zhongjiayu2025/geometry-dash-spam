"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "./browserStorage";

export function usePersistentBestNumber(
  storageKey: string,
  mode: "max" | "min" = "max"
) {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const saved = readStorage(storageKey);
    if (!saved) return;

    const parsed = Number(saved);
    if (Number.isFinite(parsed) && parsed >= 0) setBest(parsed);
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
