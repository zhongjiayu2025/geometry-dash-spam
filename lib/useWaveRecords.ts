"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WaveRun, WaveStorageScope } from "./waveStorage";

export function useWaveRecords(
  difficultyId: string,
  isEndless: boolean,
  isMini: boolean
) {
  const [highScore, setHighScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [recentRuns, setRecentRuns] = useState<WaveRun[]>([]);
  const highScoreRef = useRef(0);
  const recentRunsRef = useRef<WaveRun[]>([]);
  const scopeVersionRef = useRef(0);

  useEffect(() => {
    const version = ++scopeVersionRef.current;
    highScoreRef.current = 0;
    recentRunsRef.current = [];
    setHighScore(0);
    setRecentRuns([]);
    setIsNewBest(false);

    let cancelled = false;
    let keys: { best: string; runs: string } | null = null;
    const scope: WaveStorageScope = { difficultyId, isEndless, isMini };

    const syncRecords = () => {
      void import("./waveStorage")
        .then(({ loadWaveRecords, waveStorageKeys }) => {
          if (cancelled || version !== scopeVersionRef.current) return;
          keys = waveStorageKeys(scope);
          const records = loadWaveRecords(scope);
          highScoreRef.current = records.highScore;
          recentRunsRef.current = records.recentRuns;
          setHighScore(records.highScore);
          setRecentRuns(records.recentRuns);
          setIsNewBest(false);
        })
        .catch(() => {});
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

  const saveHighScore = useCallback((time: number) => {
    if (time <= highScoreRef.current) return false;

    highScoreRef.current = time;
    setHighScore(time);
    setIsNewBest(true);

    const version = scopeVersionRef.current;
    const scope: WaveStorageScope = { difficultyId, isEndless, isMini };
    void import("./waveStorage")
      .then(({ persistWaveHighScore }) => {
        const persistedBest = persistWaveHighScore(scope, time);
        if (version !== scopeVersionRef.current) return;
        if (persistedBest > highScoreRef.current) {
          highScoreRef.current = persistedBest;
          setHighScore(persistedBest);
          if (persistedBest > time) setIsNewBest(false);
        }
      })
      .catch(() => {});

    return true;
  }, [difficultyId, isEndless, isMini]);

  const persistRun = useCallback((run: WaveRun) => {
    const next = [run, ...recentRunsRef.current].slice(0, 10);
    recentRunsRef.current = next;
    setRecentRuns(next);

    const version = scopeVersionRef.current;
    const scope: WaveStorageScope = { difficultyId, isEndless, isMini };
    void import("./waveStorage")
      .then(({ persistWaveRuns }) => {
        const merged = persistWaveRuns(scope, next);
        if (version !== scopeVersionRef.current) return;
        recentRunsRef.current = merged;
        setRecentRuns(merged);
      })
      .catch(() => {});
  }, [difficultyId, isEndless, isMini]);

  return {
    highScore,
    isNewBest,
    recentRuns,
    saveHighScore,
    persistRun,
    setIsNewBest,
  };
}
