"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { normalizeCpsBestScores } from "../lib/cpsRecords";
import { listStorageKeys, readStorage, removeStorage } from "../lib/browserStorage";
import { normalizeWaveRuns, type WaveRun } from "../lib/waveStorage";

const PersonalStatsContent = dynamic(() => import("./PersonalStatsContent"), { ssr: false });

export interface UserStats {
  cpsTests: Record<number, number>;
  waveRuns: WaveRun[];
  jitterCps: number | null;
  butterflyCps: number | null;
  rightClickCps: number | null;
  dragPeakCps: number | null;
  spacebarCps: number | null;
  reactionMs: number | null;
  soundReactionMs: number | null;
  aimScore: number | null;
  typingWpm: number | null;
  chimpScore: number | null;
  visualMemoryScore: number | null;
}

const EMPTY_STATS: UserStats = {
  cpsTests: {},
  waveRuns: [],
  jitterCps: null,
  butterflyCps: null,
  rightClickCps: null,
  dragPeakCps: null,
  spacebarCps: null,
  reactionMs: null,
  soundReactionMs: null,
  aimScore: null,
  typingWpm: null,
  chimpScore: null,
  visualMemoryScore: null,
};

function loadJson(key: string): unknown {
  const value = readStorage(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function loadStat(key: string) {
  const parsed = Number.parseFloat(readStorage(key) || "");
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function loadStats(): UserStats {
  const waveRuns: WaveRun[] = [];
  for (const key of listStorageKeys()) {
    if (!key.startsWith("gd_spam_runs_")) continue;

    const suffix = key.slice("gd_spam_runs_".length);
    const parts = suffix.split("_");
    const inputMode = parts.at(-1) === "mini" ? "Mini" : "Normal";
    const runMode = parts.at(-2) === "endless" ? "Endless" : "15s";
    const difficulty = parts.slice(0, -2).join("_") || "Unknown";
    const fallbackMode = `${difficulty} · ${inputMode} · ${runMode}`;

    waveRuns.push(...normalizeWaveRuns(loadJson(key), fallbackMode));
  }

  waveRuns.sort((a, b) => b.timestamp - a.timestamp);

  return {
    cpsTests: normalizeCpsBestScores(loadJson("cpsBestScores")),
    waveRuns,
    jitterCps: loadStat("jitterClickBest"),
    butterflyCps: loadStat("butterflyClickBest"),
    rightClickCps: loadStat("rightClickBest"),
    dragPeakCps: loadStat("dragClickBest"),
    spacebarCps: loadStat("spacebarBest"),
    reactionMs: loadStat("reactionBestScore"),
    soundReactionMs: loadStat("soundReactionBest"),
    aimScore: loadStat("aimTrainerBest"),
    typingWpm: loadStat("typingTestBestWpm"),
    chimpScore: loadStat("chimpBestScore"),
    visualMemoryScore: loadStat("visualMemoryBest"),
  };
}

export default function PersonalStats() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const clearStats = () => {
    if (!confirm("Are you sure you want to clear all your local stats? This cannot be undone.")) return;

    for (const key of [
      "cpsBestScores",
      "cpsRunHistory",
      "jitterClickBest",
      "butterflyClickBest",
      "rightClickBest",
      "dragClickBest",
      "spacebarBest",
      "reactionBestScore",
      "soundReactionBest",
      "aimTrainerBest",
      "typingTestBestWpm",
      "chimpBestScore",
      "visualMemoryBest",
    ]) {
      removeStorage(key);
    }

    for (const key of listStorageKeys()) {
      if (key.startsWith("gd_spam_runs_") || key.startsWith("gd_spam_best_")) {
        removeStorage(key);
      }
    }

    setStats(EMPTY_STATS);
  };

  if (!stats) return null;
  return <PersonalStatsContent stats={stats} onClear={clearStats} />;
}
