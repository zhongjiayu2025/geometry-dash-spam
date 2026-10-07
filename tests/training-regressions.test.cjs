const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const postcss = require("postcss");
const tailwind = require("tailwindcss");

const root = path.resolve(__dirname, "..");
const modules = new Map();

// Exercise the actual TypeScript modules without adding a test runtime dependency.
function loadTs(relativePath) {
  const filename = path.resolve(root, relativePath);
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (id) => id.startsWith(".")
    ? loadTs(path.resolve(path.dirname(filename), `${id}.ts`))
    : require(id);
  vm.compileFunction(output, ["require", "module", "exports"], { filename })(
    localRequire, module, module.exports
  );
  return module.exports;
}

// Extract the real callbacks so changes to reset/filter wiring are also covered.
function callback(relativePath, name, context) {
  const filename = path.join(root, relativePath);
  const source = ts.createSourceFile(filename, fs.readFileSync(filename, "utf8"),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let expression;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name &&
        node.initializer && ts.isCallExpression(node.initializer)) {
      expression = node.initializer.arguments[0];
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(expression, `${name} callback exists`);
  const output = ts.transpileModule(`module.exports = ${expression.getText(source)};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.compileFunction(output, ["module", ...Object.keys(context)], { filename })(
    module, ...Object.values(context)
  );
  return module.exports;
}

const runtime = loadTs("lib/waveRuntime.ts");
const { DIFFICULTY_CONFIGS, WIN_TIME_MS } = loadTs("constants.ts");
const difficulties = Object.values(DIFFICULTY_CONFIGS);

function resetState(difficulty, isMini = false, lowVisuals = false, isEndless = false) {
  const gameState = { current: { playerX: 100 } };
  callback("components/GameCanvas.tsx", "resetGame", {
    canvasRef: { current: { width: 800, height: 450 } },
    gameState, difficulty, isMini, isEndless, WIN_TIME_MS,
    seedPreparedRef: { current: false }, runtimeRef: { current: runtime },
    lowVisualsRef: { current: lowVisuals }, runRecordedRef: { current: false },
    lastHudUpdateRef: { current: 0 }, setConsistency() {}, setIsNewBest() {},
  })();
  return gameState.current;
}

function advance(state, difficulty, now, overrides = {}) {
  // Isolate timing/course generation from player input and collision handling.
  state.playerY = 225;
  return runtime.advanceWaveFrame(state, {
    now, canvasWidth: 800, canvasHeight: 450,
    difficultySpeed: difficulty.speed, difficultyGap: difficulty.gap,
    isMini: false, isEndless: false, lowVisuals: false, ...overrides,
  });
}

test("timed runs finish at 15 simulated seconds at 30/60/120/144 Hz", () => {
  for (const difficulty of difficulties) {
    for (const isMini of [false, true]) {
      for (const hz of [30, 60, 120, 144]) {
        const state = resetState(difficulty, isMini);
        let frame = 0;
        let result;
        do {
          const before = state.runTime;
          result = advance(state, difficulty, 1000 + frame * 1000 / hz, { isMini });
          if (result.won) assert.ok(before < WIN_TIME_MS);
          frame += 1;
          assert.ok(frame < hz * 16, `${difficulty.id}, ${hz} Hz must finish`);
        } while (!result.won);
        assert.equal(state.runTime, WIN_TIME_MS);
        assert.ok(Math.abs(state.finishLineX - state.distanceTraveled - state.playerX) < 1e-6,
          "finish-line rendering agrees with the timer");
        assert.equal(state.runTime / WIN_TIME_MS * 100, 100);
        advance(state, difficulty, 30000, { isMini });
        assert.equal(state.runTime, WIN_TIME_MS, "finished timers cannot overshoot");
      }
    }
  }
});

test("background gaps and backwards timestamps cannot grant free timed progress", () => {
  const difficulty = difficulties[0];
  const state = resetState(difficulty);
  advance(state, difficulty, 1000);
  advance(state, difficulty, 61000);
  assert.equal(state.runTime, 1000 / 30);
  assert.equal(advance(state, difficulty, 60000).won, false);
  assert.equal(state.runTime, 1000 / 30);
});

test("Endless keeps advancing beyond 15 seconds without a win", () => {
  const difficulty = difficulties[0];
  const state = resetState(difficulty, false, false, true);
  for (let frame = 0; frame <= 1200; frame += 1) {
    assert.equal(advance(state, difficulty, 1000 + frame * 1000 / 60, { isEndless: true }).won, false);
  }
  assert.ok(state.runTime > WIN_TIME_MS);
});

test("same seeded course survives graphics changes and retries for every preset", () => {
  for (const difficulty of difficulties) {
    for (const isMini of [false, true]) {
      const normal = resetState(difficulty, isMini, false);
      const low = resetState(difficulty, isMini, true);
      const retry = resetState(difficulty, isMini, false);
      assert.equal(normal.stars.length, 40);
      assert.equal(low.stars.length, 20);
      for (let frame = 0; frame <= 900; frame += 1) {
        const now = 1000 + frame * 1000 / 60;
        advance(normal, difficulty, now, { isMini });
        advance(low, difficulty, now, { isMini, lowVisuals: frame % 2 === 0 });
        advance(retry, difficulty, now, { isMini });
      }
      assert.ok(normal.obstacles.length > 20);
      assert.deepEqual(low.obstacles, normal.obstacles);
      assert.deepEqual(retry.obstacles, normal.obstacles);
    }
  }
});

test("new timed records preserve legacy data and leave Endless keys intact", () => {
  const values = new Map([
    ["gd_spam_best_easy_timed_normal", "17.38"],
    ["gd_spam_runs_easy_timed_normal", "[]"],
    ["gd_spam_best_easy_endless_normal", "25"],
  ]);
  global.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  try {
    const storage = loadTs("lib/waveStorage.ts");
    const scope = { difficultyId: "easy", isMini: false, isEndless: false };
    assert.deepEqual(storage.loadWaveRecords(scope), { highScore: 0, recentRuns: [] });
    assert.equal(storage.persistWaveHighScore(scope, 15), 15);
    const run = { time: 15, averageCps: 4, peakCps: 5, timingSd: 10,
      clicks: 60, result: "won", timestamp: 1000, mode: "Easy · Normal · 15s" };
    storage.persistWaveRuns(scope, [run]);
    assert.deepEqual(storage.loadWaveRecords(scope), { highScore: 15, recentRuns: [run] });
    assert.equal(values.get("gd_spam_best_easy_timed_normal"), "17.38");
    assert.equal(values.get("gd_spam_runs_easy_timed_normal"), "[]");
    assert.equal(storage.loadWaveRecords({ ...scope, isMini: true }).highScore, 0);
    assert.equal(storage.loadWaveRecords({ ...scope, difficultyId: "hard" }).highScore, 0);
    assert.equal(storage.loadWaveRecords({ ...scope, isEndless: true }).highScore, 25);
    assert.equal(storage.waveStorageKeys({ ...scope, isEndless: true }).best,
      "gd_spam_best_easy_endless_normal");
  } finally {
    delete global.localStorage;
  }
});

test("Demon filters keep row visibility, counts and empty state in sync", async () => {
  const rows = Array.from({ length: 50 }, (_, index) => ({
    dataset: { rank: String(index + 1), search: `level ${index + 1} publisher` },
    hidden: false,
  }));
  const emptyState = { hidden: true };
  let count;
  let ariaCount;
  const document = {
    querySelectorAll: () => rows,
    getElementById: (id) => id === "demon-list-empty-state" ? emptyState : {
      setAttribute: (_, value) => { ariaCount = value; },
    },
  };
  for (const [query, range, expected] of [
    ["", "all", 50], ["", "top10", 10], ["", "top25", 25],
    ["", "26to50", 25], [" level 50 ", "all", 1],
    ["level 50", "top10", 0], ["no-such-level", "all", 0], ["", "all", 50],
  ]) {
    callback("components/DemonListFilterControls.tsx", "applyFilters", {
      query, range, document, setVisibleCount: (value) => { count = value; },
    })();
    assert.equal(rows.filter((row) => !row.hidden).length, expected);
    assert.equal(count, expected);
    assert.equal(ariaCount, String(expected));
    assert.equal(emptyState.hidden, expected !== 0);
  }

  // Validate the built CSS too: Tailwind's .grid must not override hidden rows.
  const css = await postcss([tailwind({
    content: [{ raw: fs.readFileSync(path.join(root, "components/DemonListTable.tsx"), "utf8"), extension: "tsx" }],
  })]).process(fs.readFileSync(path.join(root, "app/globals.css"), "utf8"), { from: undefined });
  let gridDisplay;
  let hiddenDisplay;
  css.root.walkRules((rule) => {
    if (rule.selector === ".grid") rule.walkDecls("display", (decl) => { gridDisplay = decl.value; });
    if (rule.selector === "[data-demon-row][hidden]") {
      rule.walkDecls("display", (decl) => { hiddenDisplay = decl.value; });
    }
  });
  assert.equal(gridDisplay, "grid");
  assert.equal(hiddenDisplay, "none", "two attribute selectors outrank the grid utility");
});
