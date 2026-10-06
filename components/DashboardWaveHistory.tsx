"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface WaveRun {
  time: number;
  averageCps: number;
  peakCps: number;
  timingSd: number;
  clicks: number;
  result: "won" | "lost";
  timestamp: number;
  mode: string;
}

export default function DashboardWaveHistory({ runs }: { runs: WaveRun[] }) {
  const recentRuns = runs.slice(0, 10);

  if (!runs.length) {
    return (
      <div className="lg:col-span-3 rounded-3xl border border-blue-500/20 bg-blue-950/15 p-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Wave training history</div>
            <h3 className="mt-1 text-xl font-bold text-white">Geometry Dash Spam Runs</h3>
          </div>
          <Link href="/" className="text-sm font-bold text-blue-400 hover:text-blue-300">
            Open Spam Test <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        <p className="text-sm leading-6 text-slate-400">
          No saved spam runs yet. Complete or crash a run to start a browser-only training history.
        </p>
      </div>
    );
  }

  const latestRun = recentRuns[0];
  const completedRuns = runs.filter((run) => run.result === "won").length;
  const recentModes = new Set(recentRuns.map((run) => run.mode)).size;

  return (
    <div className="lg:col-span-3 rounded-3xl border border-blue-500/20 bg-blue-950/15 p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Wave training history</div>
          <h3 className="mt-1 text-xl font-bold text-white">Geometry Dash Spam Runs</h3>
        </div>
        <Link href="/" className="text-sm font-bold text-blue-400 hover:text-blue-300">
          Open Spam Test <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Saved Runs" value={String(runs.length)} />
        <Metric label="Completed Runs" value={String(completedRuns)} />
        <Metric label="Latest Survival" value={`${latestRun.time.toFixed(2)}s`} detail={latestRun.mode} />
        <Metric
          label="Latest CPS"
          value={latestRun.averageCps.toFixed(2)}
          detail={`${recentModes} mode${recentModes === 1 ? "" : "s"} in recent history`}
        />
      </div>

      <div className="mt-5 grid gap-2">
        {recentRuns.slice(0, 5).map((run, index) => (
          <div
            key={`${run.timestamp}-${index}`}
            className="flex flex-col gap-2 rounded-xl border border-white/5 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-sm font-semibold text-white">{run.mode}</div>
              <div className="text-xs text-slate-500">
                {run.result === "won" ? "Completed" : "Crashed"} · {run.clicks} inputs
              </div>
            </div>
            <div className="flex gap-4 text-xs font-mono text-slate-300">
              <span>{run.time.toFixed(2)}s</span>
              <span>{run.averageCps.toFixed(2)} CPS</span>
              <span>{run.peakCps.toFixed(2)} peak</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-display font-bold text-white">{value}</div>
      {detail && <div className="mt-1 text-xs text-slate-500">{detail}</div>}
    </div>
  );
}
