"use client";

import { useEffect, useRef, useState } from "react";
import type { WaveRun } from "./waveStorage";

export function useWaveRecords(
  difficultyId: string,
  isEndless: boolean,
  isMini: boolean
) {
  const [highScore, setHighScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [recentRuns, setRecentRuns] = useState<WaveRun[]>([]);
  const highScoreRef = useRef(0);

  useEffect(() => {
    highScoreRef.current = 0;
    setHighScore(0);
    setRecentRuns([]);
    setIsNewBest(false);

    let cancelled = false;
    let keys: { best: string; runs: string } | null = null;
    const scope = { difficultyId, isEndless, isMini };

    const syncRecords = () => {
      void import("./waveStorage").then(({ loadWaveRecords, waveStorageKeys }) => {
        if (cancelled) return;
        keys = waveStorageKeys(scope);
        const records = loadWaveRecords(scope);
        highScoreRef.current = records.highScore;
        setHighScore(records.highScore);
        setRecentRuns(records.recentRuns);
        setIsNewBest(false);
      });
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === keys?.best ||
        event.key === keys?.runs
      ) {
        syncRecords();
      }
    };

    syncRecords();
    window.addEventListener("storage", handleStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleStorage);
    };
  }, [difficultyId, isEndless, isMini]);

  return {
    highScore,
    isNewBest,
    recentRuns,
    highScoreRef,
    setHighScore,
    setIsNewBest,
    setRecentRuns,
  };
}
