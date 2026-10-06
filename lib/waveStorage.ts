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
      const parsed = JSON.parse(savedRuns);
      if (Array.isArray(parsed)) recentRuns = parsed.slice(0, 10);
    } catch {}
  }

  return {
    highScore: Number.isFinite(savedBest) ? savedBest : 0,
    recentRuns,
  };
}

export function persistWaveHighScore(scope: WaveStorageScope, time: number) {
  localStorage.setItem(bestKey(scope), String(time));
}

export function persistWaveRuns(scope: WaveStorageScope, runs: WaveRun[]) {
  localStorage.setItem(runsKey(scope), JSON.stringify(runs.slice(0, 10)));
}
