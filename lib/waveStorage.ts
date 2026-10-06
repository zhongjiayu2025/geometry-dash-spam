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

function bestKey(scope: WaveStorageScope) {
  return `gd_spam_best_${scope.difficultyId}_${scope.isEndless ? "endless" : "timed"}_${scope.isMini ? "mini" : "normal"}`;
}

function runsKey(scope: WaveStorageScope) {
  return `gd_spam_runs_${scope.difficultyId}_${scope.isEndless ? "endless" : "timed"}_${scope.isMini ? "mini" : "normal"}`;
}

export function loadWaveRecords(scope: WaveStorageScope) {
  const savedBest = Number.parseFloat(localStorage.getItem(bestKey(scope)) || "0");
  let recentRuns: WaveRun[] = [];

  const savedRuns = localStorage.getItem(runsKey(scope));
  if (savedRuns) {
    try {
      recentRuns = normalizeWaveRuns(JSON.parse(savedRuns));
    } catch {}
  }

  return {
    highScore: Number.isFinite(savedBest) && savedBest >= 0 ? savedBest : 0,
    recentRuns,
  };
}

export function persistWaveHighScore(scope: WaveStorageScope, time: number) {
  localStorage.setItem(bestKey(scope), String(time));
}

export function persistWaveRuns(scope: WaveStorageScope, runs: WaveRun[]) {
  localStorage.setItem(runsKey(scope), JSON.stringify(normalizeWaveRuns(runs)));
}
