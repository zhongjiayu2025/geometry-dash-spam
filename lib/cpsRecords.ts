import { readStorage, writeStorage } from "./browserStorage";

export interface CpsRun {
  duration: number;
  clicks: number;
  cps: number;
  timestamp: number;
}

export interface CpsRecords {
  bestScores: Record<number, number>;
  runHistory: CpsRun[];
}

const BEST_KEY = "cpsBestScores";
const HISTORY_KEY = "cpsRunHistory";

function nonNegative(value: unknown) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function normalizeCpsBestScores(value: unknown): Record<number, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const bestScores: Record<number, number> = {};
  for (const [key, rawScore] of Object.entries(value)) {
    const duration = Number(key);
    const score = nonNegative(rawScore);
    if (Number.isFinite(duration) && duration > 0 && score !== null) {
      bestScores[duration] = score;
    }
  }
  return bestScores;
}

export function normalizeCpsRuns(value: unknown): CpsRun[] {
  if (!Array.isArray(value)) return [];

  const runs: CpsRun[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;

    const record = raw as Record<string, unknown>;
    const duration = nonNegative(record.duration);
    const clicks = nonNegative(record.clicks);
    if (duration === null || duration <= 0 || clicks === null) continue;

    const normalizedClicks = Math.floor(clicks);
    const timestamp = nonNegative(record.timestamp) ?? 0;
    runs.push({
      duration,
      clicks: normalizedClicks,
      cps: Number((normalizedClicks / duration).toFixed(2)),
      timestamp,
    });

    if (runs.length >= 20) break;
  }
  return runs;
}

function readJson(key: string): unknown {
  const saved = readStorage(key);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function readBestScores() {
  return normalizeCpsBestScores(readJson(BEST_KEY));
}

function readRunHistory() {
  return normalizeCpsRuns(readJson(HISTORY_KEY));
}

export function loadCpsRecords(): CpsRecords {
  return {
    bestScores: readBestScores(),
    runHistory: readRunHistory(),
  };
}

export function persistCpsRun(duration: number, clicks: number): CpsRecords {
  if (
    !Number.isFinite(duration) ||
    duration <= 0 ||
    !Number.isFinite(clicks) ||
    clicks < 0
  ) {
    return loadCpsRecords();
  }

  const safeClicks = Math.floor(clicks);
  const cps = safeClicks / duration;
  const nextRun: CpsRun = {
    duration,
    clicks: safeClicks,
    cps: Number(cps.toFixed(2)),
    timestamp: Date.now(),
  };

  const runHistory = [nextRun, ...readRunHistory()].slice(0, 20);
  writeStorage(HISTORY_KEY, JSON.stringify(runHistory));

  const bestScores = readBestScores();
  if (!bestScores[duration] || cps > bestScores[duration]) {
    bestScores[duration] = cps;
    writeStorage(BEST_KEY, JSON.stringify(bestScores));
  }

  return { bestScores, runHistory };
}
