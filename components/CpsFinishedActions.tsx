"use client";

import Link from "next/link";
import { ArrowRight, Check, RotateCcw, Share2 } from "lucide-react";

type TimingStats = {
  averageInterval: number | null;
  peakCps: number;
  consistency: number | null;
};

export default function CpsFinishedActions({
  timingStats,
  copied,
  onReset,
  onShare,
}: {
  timingStats: TimingStats;
  copied: boolean;
  onReset: () => void;
  onShare: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <>
      <div className="relative z-10 mb-5 grid w-full grid-cols-3 gap-1.5 sm:mb-6 sm:gap-2">
        <div className="rounded-lg bg-black/25 p-2 sm:p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Peak 1s CPS</div>
          <div className="font-mono font-bold text-white">{timingStats.peakCps.toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-black/25 p-2 sm:p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Consistency</div>
          <div className="font-mono font-bold text-white">
            {timingStats.consistency === null ? "N/A" : `${timingStats.consistency.toFixed(0)}%`}
          </div>
        </div>
        <div className="rounded-lg bg-black/25 p-2 sm:p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Avg Interval</div>
          <div className="font-mono font-bold text-white">
            {timingStats.averageInterval === null ? "N/A" : `${timingStats.averageInterval.toFixed(0)}ms`}
          </div>
        </div>
      </div>

      <p className="relative z-10 mb-5 max-w-md text-xs leading-5 text-slate-500">
        Consistency is a site-defined browser diagnostic based on variation between registered click intervals.
        It is not an official Geometry Dash metric or a laboratory hardware measurement.
      </p>

      <div className="relative z-10 flex flex-wrap justify-center gap-2 animate-in fade-in duration-300 sm:gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-bold text-blue-900 shadow-lg transition-colors hover:bg-blue-50 sm:px-6 sm:py-3"
        >
          <RotateCcw className="h-5 w-5" /> TRY AGAIN
        </button>
        <Link
          href="/geometry-dash-wave"
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-800 px-4 py-2.5 font-bold text-white transition-colors hover:bg-slate-700 sm:px-5 sm:py-3"
        >
          Train Wave Control <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={onShare}
          aria-label="Share Score"
          className={`flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition-colors hover:bg-blue-500 ${copied ? "bg-green-500" : ""}`}
        >
          {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}
