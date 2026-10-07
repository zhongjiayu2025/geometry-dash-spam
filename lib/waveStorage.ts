import { readStorage, writeStorage } from "./browserStorage";

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

export interface WaveStorageScope {
  difficultyId: string;
  isEndless: boolean;
  isMini: boolean;
}

function nonNegative(value: unknown) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function normalizeWaveRuns(value: unknown, fallbackMode = "Unknown"): WaveRun[] {
  if (!Array.isArray(value)) return [];

  const runs: WaveRun[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;

    const record = raw as Record<string, unknown>;
    const time = nonNegative(record.time);
    if (time === null) continue;

    const mode =
      typeof record.mode === "string" && record.mode.trim()
        ? record.mode
        : fallbackMode;

    runs.push({
      time,
      averageCps: nonNegative(record.averageCps) ?? 0,
      peakCps: nonNegative(record.peakCps) ?? 0,
      timingSd: nonNegative(record.timingSd) ?? 0,
      clicks: Math.floor(nonNegative(record.clicks) ?? 0),
      result: record.result === "won" ? "won" : "lost",
      timestamp: nonNegative(record.timestamp) ?? 0,
      mode,
    });

    if (runs.length >= 10) break;
  }

  return runs;
}

// Preserve legacy timed records without comparing them to the corrected 15s course.
function bestKey(scope: WaveStorageScope) {
  return `gd_spam_best_${scope.difficultyId}_${scope.isEndless ? "endless" : "timed-v2"}_${scope.isMini ? "mini" : "normal"}`;
}

function runsKey(scope: WaveStorageScope) {
  return `gd_spam_runs_${scope.difficultyId}_${scope.isEndless ? "endless" : "timed-v2"}_${scope.isMini ? "mini" : "normal"}`;
}

export function waveStorageKeys(scope: WaveStorageScope) {
  return { best: bestKey(scope), runs: runsKey(scope) };
}

function readWaveRuns(scope: WaveStorageScope) {
  const savedRuns = readStorage(runsKey(scope));
  if (!savedRuns) return [];

  try {
    return normalizeWaveRuns(JSON.parse(savedRuns));
  } catch {
    return [];
  }
}

export function loadWaveRecords(scope: WaveStorageScope) {
  const savedBest = Number.parseFloat(readStorage(bestKey(scope)) || "0");

  return {
    highScore: Number.isFinite(savedBest) && savedBest >= 0 ? savedBest : 0,
    recentRuns: readWaveRuns(scope),
  };
}

export function persistWaveHighScore(scope: WaveStorageScope, time: number) {
  const current = Number.parseFloat(readStorage(bestKey(scope)) || "0");
  const safeCurrent = Number.isFinite(current) && current >= 0 ? current : 0;
  if (!Number.isFinite(time) || time < 0) return safeCurrent;

  const next = Math.max(safeCurrent, time);
  if (next > safeCurrent) writeStorage(bestKey(scope), String(next));
  return next;
}

export function persistWaveRuns(scope: WaveStorageScope, runs: WaveRun[]) {
  const combined = [...normalizeWaveRuns(runs), ...readWaveRuns(scope)]
    .sort((a, b) => b.timestamp - a.timestamp);

  const seen = new Set<string>();
  const merged: WaveRun[] = [];
  for (const run of combined) {
    const signature = [
      run.timestamp,
      run.time,
      run.clicks,
      run.result,
      run.mode,
    ].join("|");
    if (seen.has(signature)) continue;
    seen.add(signature);
    merged.push(run);
    if (merged.length >= 10) break;
  }

  writeStorage(runsKey(scope), JSON.stringify(merged));
  return merged;
}
