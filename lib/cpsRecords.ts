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

function readBestScores(): Record<number, number> {
  const saved = localStorage.getItem(BEST_KEY);
  if (!saved) return {};

  try {
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readRunHistory(): CpsRun[] {
  const saved = localStorage.getItem(HISTORY_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function loadCpsRecords(): CpsRecords {
  return {
    bestScores: readBestScores(),
    runHistory: readRunHistory(),
  };
}

export function persistCpsRun(duration: number, clicks: number): CpsRecords {
  const cps = clicks / duration;
  const nextRun: CpsRun = {
    duration,
    clicks,
    cps: Number(cps.toFixed(2)),
    timestamp: Date.now(),
  };

  const runHistory = [nextRun, ...readRunHistory()].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(runHistory));

  const bestScores = readBestScores();
  if (!bestScores[duration] || cps > bestScores[duration]) {
    bestScores[duration] = cps;
    localStorage.setItem(BEST_KEY, JSON.stringify(bestScores));
  }

  return { bestScores, runHistory };
}
