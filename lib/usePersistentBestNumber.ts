"use client";

import { useCallback, useEffect, useState } from "react";

export function usePersistentBestNumber(
  storageKey: string,
  mode: "max" | "min" = "max"
) {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
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

      localStorage.setItem(storageKey, String(value));
      return value;
    });
  }, [mode, storageKey]);

  return [best, commitBest] as const;
}
