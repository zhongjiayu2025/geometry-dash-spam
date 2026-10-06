"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readStorage, writeStorage } from "./browserStorage";

export function usePersistentBestNumber(
  storageKey: string,
  mode: "max" | "min" = "max"
) {
  const [best, setBest] = useState<number | null>(null);
  const bestRef = useRef<number | null>(null);

  useEffect(() => {
    const syncBest = () => {
      const saved = readStorage(storageKey);
      if (!saved) {
        bestRef.current = null;
        setBest(null);
        return;
      }

      const parsed = Number(saved);
      const next = Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
      bestRef.current = next;
      setBest(next);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === storageKey) syncBest();
    };

    syncBest();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const commitBest = useCallback((value: number) => {
    if (!Number.isFinite(value) || value < 0) return;

    const storedRaw = readStorage(storageKey);
    const storedNumber = storedRaw === null ? null : Number(storedRaw);
    const stored =
      storedNumber !== null && Number.isFinite(storedNumber) && storedNumber >= 0
        ? storedNumber
        : null;

    let baseline = bestRef.current;
    if (stored !== null) {
      baseline =
        baseline === null
          ? stored
          : mode === "min"
            ? Math.min(baseline, stored)
            : Math.max(baseline, stored);
    }

    if (baseline !== null) {
      const improves = mode === "min" ? value < baseline : value > baseline;
      if (!improves) {
        if (baseline !== bestRef.current) {
          bestRef.current = baseline;
          setBest(baseline);
        }
        return;
      }
    }

    bestRef.current = value;
    writeStorage(storageKey, String(value));
    setBest(value);
  }, [mode, storageKey]);

  return [best, commitBest] as const;
}
