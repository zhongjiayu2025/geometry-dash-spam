"use client";

import { Check, RotateCcw, Share2 } from "lucide-react";

import { useShareResult } from "../lib/useShareResult";
export default function DragClickResult({
  clicks,
  peakCps,
  buckets,
  onReset,
}: {
  clicks: number;
  peakCps: number;
  buckets: number[];
  onReset: () => void;
}) {
  const maxBucket = Math.max(1, ...buckets);

  const { copied, share: shareScore } = useShareResult({
    title: "Drag Click Test",
    text: `I recorded ${peakCps} peak 1-second CPS and ${(clicks / 10).toFixed(2)} average CPS on the Geometry Dash Drag Click Test.`,
    url: "https://geometrydashspam.cc/drag-click",
  });

  return (
    <div className="w-full">
      <div className="rounded-3xl border border-indigo-500/30 bg-indigo-900/20 p-8 text-center">
        <h2 className="mb-5 text-2xl font-bold text-indigo-200">Test Complete</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-black/25 p-4">
            <div className="text-xs uppercase tracking-wider text-slate-500">Average CPS</div>
            <div className="text-3xl font-display font-bold text-white">{(clicks / 10).toFixed(2)}</div>
          </div>
          <div className="rounded-xl bg-black/25 p-4">
            <div className="text-xs uppercase tracking-wider text-slate-500">Peak 1s CPS</div>
            <div className="text-3xl font-display font-bold text-indigo-300">{peakCps}</div>
          </div>
          <div className="rounded-xl bg-black/25 p-4">
            <div className="text-xs uppercase tracking-wider text-slate-500">Total clicks</div>
            <div className="text-3xl font-display font-bold text-white">{clicks}</div>
          </div>
        </div>

        <div className="mb-6 flex h-28 w-full items-end gap-1 opacity-90" aria-label="Clicks registered in each second">
          {buckets.map((value, index) => (
            <div
              key={index}
              className="group relative flex-1 rounded-t-sm bg-indigo-500/30"
              style={{ height: `${Math.max(5, (value / maxBucket) * 100)}%` }}
            >
              <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                Second {index + 1}: {value}
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mb-7 max-w-xl text-sm leading-6 text-slate-400">
          Peak CPS is the largest number of registered inputs found in any rolling one-second window. Browser event behavior can differ by device and operating system.
        </p>

        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white transition-colors hover:bg-indigo-500"
          >
            <RotateCcw className="h-5 w-5" /> Try Again
          </button>
          <button
            type="button"
            onClick={() => void shareScore()}
            className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-800 p-4 text-white transition-colors hover:bg-slate-700"
            title={copied ? "Copied" : "Share your score"}
            aria-label={copied ? "Result copied" : "Share drag-click result"}
          >
            {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
