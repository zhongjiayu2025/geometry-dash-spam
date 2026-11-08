"use client";

import type { WaveRun } from "../lib/waveStorage";

type Props = {
  runs: WaveRun[];
  difficulty: string;
  isMini: boolean;
  isEndless: boolean;
};

const median = (numbers: number[]) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const csvCell = (value: string | number) => {
  const text = String(value);
  const safe = /^[=+@-]/.test(text) ? "'" + text : text;
  return '"' + safe.replace(/"/g, '""') + '"';
};

export default function WaveSessionReview({ runs, difficulty, isMini, isEndless }: Props) {
  const recent = runs.slice(0, 10);
  const wins = recent.filter(run => run.result === "won").length;
  const survival = recent.length ? median(recent.map(run => run.time)) : null;
  const cps = recent.length ? median(recent.map(run => run.averageCps)) : null;

  const downloadCsv = () => {
    if (!recent.length) return;
    const rows: Array<Array<string | number>> = [
      ["date_utc", "difficulty", "mini", "endless", "result", "survival_seconds", "average_cps", "peak_cps", "timing_sd_ms", "clicks"],
      ...recent.map(run => [
        run.timestamp ? new Date(run.timestamp).toISOString() : "",
        difficulty, isMini ? "yes" : "no", isEndless ? "yes" : "no",
        run.result, run.time, run.averageCps, run.peakCps,
        run.timingSd ?? "", run.clicks,
      ]),
    ];
    const contents = "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([contents], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "wave-training-" + difficulty.toLowerCase().replace(/\s+/g, "-") + ".csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section aria-labelledby="wave-report-title" className="mt-6 w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-900/40 p-5 md:p-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Measured in your browser</p>
          <h2 id="wave-report-title" className="text-xl font-bold text-white">Your Wave Session Report</h2>
        </div>
        <button type="button" disabled={!recent.length} onClick={downloadCsv} className="rounded-lg border border-cyan-500/40 bg-cyan-950/20 px-4 py-2 text-sm font-semibold text-cyan-200 hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-40">
          Export {recent.length || ""} runs (CSV)
        </button>
      </div>
      <p className="mb-5 text-sm leading-7 text-slate-400">
        Last ten local attempts for <strong className="text-slate-200">{difficulty} · {isMini ? "Mini" : "Normal"} · {isEndless ? "Endless" : "Timed"}</strong>.
        Change one practice variable at a time to make comparisons meaningful.
      </p>
      {!recent.length ? (
        <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
          No results in this mode yet. Start a run to record survival, CPS and click timing here. Nothing is sent to a server.
        </p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3" aria-live="polite">
            <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-slate-400">Runs</p><p className="text-lg font-bold text-white">{recent.length}</p></div>
            <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-slate-400">Median survival</p><p className="text-lg font-bold text-white">{survival!.toFixed(2)}s</p></div>
            <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-slate-400">Median CPS</p><p className="text-lg font-bold text-white">{cps!.toFixed(2)}</p></div>
          </div>
          <p className="mb-3 text-xs text-slate-400">{wins} of {recent.length} attempts reached the timed goal. A median is less sensitive to a single outlier.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[510px] text-left text-sm">
              <caption className="mb-2 text-left text-xs text-slate-400">Browser-recorded runs, newest first. N/A means there were too few click intervals.</caption>
              <thead className="border-b border-white/20 text-slate-200">
                <tr><th className="py-2 pr-3">Run</th><th className="py-2 pr-3">Result</th><th className="py-2 pr-3">Survival</th><th className="py-2 pr-3">Avg CPS</th><th className="py-2 pr-3">Peak 1s</th><th className="py-2 pr-3">Timing SD</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                {recent.map((run, i) => (
                  <tr key={run.timestamp + "-" + i}>
                    <td className="py-2 pr-3">{i + 1}</td><td className="py-2 pr-3">{run.result}</td><td className="py-2 pr-3">{run.time.toFixed(2)}s</td><td className="py-2 pr-3">{run.averageCps.toFixed(2)}</td><td className="py-2 pr-3">{run.peakCps.toFixed(2)}</td><td className="py-2 pr-3">{run.timingSd === null ? "N/A" : run.timingSd.toFixed(0) + " ms"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="mt-4 text-xs leading-6 text-slate-400">
        Figures come from registered browser events and this independent practice model, not official game performance or certified hardware measurements.
      </p>
    </section>
  );
}
