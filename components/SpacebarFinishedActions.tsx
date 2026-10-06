"use client";

import { Check, RotateCcw, Share2 } from "lucide-react";

import { useShareResult } from "../lib/useShareResult";
export default function SpacebarFinishedActions({
  count,
  onReset,
}: {
  count: number;
  onReset: () => void;
}) {

  const { copied, share: shareScore } = useShareResult({
    title: "Spacebar Counter Test",
    text: `I got ${(count / 10).toFixed(2)} CPS on the Geometry Dash Spacebar Counter Test! Can you beat me?`,
    url: "https://geometrydashspam.cc/spacebar-counter",
  });

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <p className="mb-4 text-xl font-bold text-white">
        Time&apos;s Up! Speed: <span className="text-purple-400">{(count / 10).toFixed(2)} CPS</span>
      </p>
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-bold text-white shadow-lg transition-colors hover:bg-purple-500"
        >
          <RotateCcw className="h-5 w-5" /> RESET COUNTER
        </button>
        <button
          type="button"
          onClick={() => void shareScore()}
          className="flex items-center justify-center rounded-lg border border-white/10 bg-slate-800 p-3 text-white transition-colors hover:bg-slate-700"
          aria-label={copied ? "Spacebar score copied" : "Share your spacebar score"}
        >
          {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
