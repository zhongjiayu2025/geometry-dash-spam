"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CpsRun } from "./cpsRecords";

export function useCpsRecords() {
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [runHistory, setRunHistory] = useState<CpsRun[]>([]);
  const mountedRef = useRef(false);

  const syncRecords = useCallback(() => {
    void import("./cpsRecords")
      .then(({ loadCpsRecords }) => {
        if (!mountedRef.current) return;
        const records = loadCpsRecords();
        setBestScores(records.bestScores);
        setRunHistory(records.runHistory);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    syncRecords();

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === "cpsBestScores" ||
        event.key === "cpsRunHistory"
      ) {
        syncRecords();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncRecords]);

  const persistRun = useCallback((duration: number, clicks: number) => {
    void import("./cpsRecords")
      .then(({ persistCpsRun }) => {
        const records = persistCpsRun(duration, clicks);
        if (!mountedRef.current) return;
        setBestScores(records.bestScores);
        setRunHistory(records.runHistory);
      })
      .catch(() => {});
  }, []);

  return { bestScores, runHistory, persistRun };
}
