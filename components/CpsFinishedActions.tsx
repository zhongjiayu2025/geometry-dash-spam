"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw, Share2 } from "lucide-react";

function getTimingStats(times: number[]) {
  if (times.length < 2) {
    return {
      averageInterval: null as number | null,
      peakCps: times.length,
      consistency: null as number | null,
    };
  }

  const intervals = times.slice(1).map((time, index) => time - times[index]);
  const mean = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    intervals.length;
  const coefficient = mean > 0 ? Math.sqrt(variance) / mean : 0;

  let left = 0;
  let peakCps = 0;
  for (let right = 0; right < times.length; right += 1) {
    while (times[right] - times[left] > 1000) left += 1;
    peakCps = Math.max(peakCps, right - left + 1);
  }

  return {
    averageInterval: mean,
    peakCps,
    consistency: Math.max(0, Math.min(100, 100 - coefficient * 100)),
  };
}

export default function CpsFinishedActions({
  clickTimes,
  clicks,
  duration,
  onReset,
}: {
  clickTimes: number[];
  clicks: number;
  duration: number;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const timingStats = useMemo(() => getTimingStats(clickTimes), [clickTimes]);

  const shareScore = async () => {
    const score = (clicks / duration).toFixed(2);
    const text = `I got ${score} CPS in the ${duration}s Geometry Dash CPS Test.`;
    const url = "https://geometrydashspam.cc/cps-test";

    if (navigator.share) {
      try {
        await navigator.share({ title: "CPS Test Result", text, url });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

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
          type="button"
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
          type="button"
          onClick={shareScore}
          aria-label={copied ? "CPS result copied" : "Share CPS score"}
          className={`flex items-center gap-2 rounded-lg px-4 py-3 font-bold text-white shadow-lg transition-colors ${copied ? "bg-green-500" : "bg-blue-600 hover:bg-blue-500"}`}
        >
          {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}
