"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PersonalStatsContent = dynamic(() => import("./PersonalStatsContent"), { ssr: false });

export interface WaveRun {
  time: number;
  averageCps: number;
  peakCps: number;
  timingSd: number;
  clicks: number;
  result: "won" | "lost";
  timestamp: number;
  mode: string;
}

export interface UserStats {
  cpsTests: Record<string, number>;
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

function loadStats(): UserStats {
  const loadStat = (key: string) => {
    const value = localStorage.getItem(key);
    if (!value) return null;
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const loadObject = (key: string) => {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  };

  const waveRuns: WaveRun[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith("gd_spam_runs_")) continue;

    const stored = loadObject(key);
    if (!Array.isArray(stored)) continue;

    const suffix = key.slice("gd_spam_runs_".length);
    const parts = suffix.split("_");
    const inputMode = parts.at(-1) === "mini" ? "Mini" : "Normal";
    const runMode = parts.at(-2) === "endless" ? "Endless" : "15s";
    const difficulty = parts.slice(0, -2).join("_") || "Unknown";

    waveRuns.push(
      ...stored.map((run: Partial<WaveRun>) => ({
        time: Number(run.time || 0),
        averageCps: Number(run.averageCps || 0),
        peakCps: Number(run.peakCps || 0),
        timingSd: Number(run.timingSd || 0),
        clicks: Number(run.clicks || 0),
        result: run.result === "won" ? "won" : "lost",
        timestamp: Number(run.timestamp || 0),
        mode: run.mode || `${difficulty} · ${inputMode} · ${runMode}`,
      }))
    );
  }

  waveRuns.sort((a, b) => b.timestamp - a.timestamp);

  return {
    cpsTests: loadObject("cpsBestScores"),
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
      localStorage.removeItem(key);
    }

    const dynamicKeys: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("gd_spam_runs_") || key?.startsWith("gd_spam_best_")) {
        dynamicKeys.push(key);
      }
    }
    for (const key of dynamicKeys) localStorage.removeItem(key);

    setStats(EMPTY_STATS);
  };

  if (!stats) return null;
  return <PersonalStatsContent stats={stats} onClear={clearStats} />;
}
