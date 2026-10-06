"use client";

import { useCallback, useEffect, useState } from "react";

export function usePersistentBestNumber(storageKey: string) {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    const parsed = Number(saved);
    if (Number.isFinite(parsed)) setBest(parsed);
  }, [storageKey]);

  const commitBest = useCallback((value: number) => {
    setBest((previous) => {
      if (previous !== null && value <= previous) return previous;
      localStorage.setItem(storageKey, String(value));
      return value;
    });
  }, [storageKey]);

  return [best, commitBest] as const;
}
