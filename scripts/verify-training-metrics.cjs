const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const oldLoader = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};
try {
  const { getWaveRunStats, calculateWaveConsistency } = require("../lib/waveRuntime.ts");
  const { normalizeWaveRuns } = require("../lib/waveStorage.ts");
  const stats = (times, runTime) => {
    const state = { clickTimes: times, clickIntervals: times.slice(1).map((time, index) => time - times[index]), clickCount: times.length, runTime };
    return { ...getWaveRunStats(state), consistency: calculateWaveConsistency(state) };
  };
  assert.deepEqual(stats([], 1000), { clickCount: 0, averageCps: 0, peakCps: 0, averageInterval: null, intervalStdDev: null, consistency: "N/A" });
  const single = stats([100], 1010);
  assert.equal(single.peakCps, 1);
  assert.equal(single.intervalStdDev, null);
  assert.equal(single.averageInterval, null);
  assert.equal(single.consistency, "N/A");
  assert.ok(Math.abs(single.averageCps - 1 / 1.01) < 1e-10);
  assert.equal(stats([50], 100).averageCps, 10);
  assert.equal(stats([50], 100).peakCps, 1, "short-run average must not replace a rolling-second count");
  assert.equal(stats([100, 300], 1000).averageInterval, 200);
  assert.equal(stats([100, 300], 1000).intervalStdDev, null);
  assert.equal(stats([100, 300, 500], 1000).intervalStdDev, 0, "two equal observed intervals legitimately have zero SD");
  assert.equal(stats([100, 300, 700], 1000).intervalStdDev, 100);
  assert.equal(stats([0, 1000, 1000.1], 1500).peakCps, 2, "rolling window includes the 1000ms boundary, not points beyond it");
  assert.equal(stats([900, 910, 920, 1010, 1020, 1030], 10000).peakCps, 6, "peak can cross a fixed-second bucket boundary");
  const runs = normalizeWaveRuns([
    { time: 1.01, clicks: 1, peakCps: 0.99, timingSd: 0 },
    { time: 1, clicks: 2, peakCps: 2, timingSd: 0 },
    { time: 1, clicks: 3, peakCps: 3, timingSd: 0 },
    { time: 1, clicks: 3, peakCps: 3, timingSd: null },
  ]);
  assert.deepEqual(runs.map((run) => run.timingSd), [null, null, 0, null]);
  assert.equal(runs[0].peakCps, 1, "legacy single-click peaks must be corrected");
  assert.deepEqual(normalizeWaveRuns(runs), runs, "normalization must preserve the unavailable state on subsequent loads");
  console.log("Training metrics verified: short/empty runs, interval sample thresholds, rolling peaks, legacy history and null persistence.");
} finally {
  if (oldLoader) require.extensions[".ts"] = oldLoader;
  else delete require.extensions[".ts"];
}
