"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

interface ScrollResultProps {
  distancePerSecond: number;
  eventsPerSecond: string;
  onReset: () => void;
}

export default function ScrollResult({ distancePerSecond, eventsPerSecond, onReset }: ScrollResultProps) {
  return (
    <div className="w-full">
      <div className="rounded-3xl border border-teal-500/30 bg-teal-900/20 p-8 text-center">
        <h2 className="mb-5 text-2xl font-bold text-teal-200">Test Complete</h2>
        <div className="mb-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-black/25 p-4">
            <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">Normalized distance / second</div>
            <div className="text-3xl font-display font-bold text-white">{distancePerSecond}</div>
          </div>
          <div className="rounded-xl bg-black/25 p-4">
            <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">Wheel events / second</div>
            <div className="text-3xl font-display font-bold text-teal-300">{eventsPerSecond}</div>
          </div>
        </div>
        <p className="mx-auto mb-7 max-w-xl text-sm leading-6 text-slate-400">
          Distance is normalized from WheelEvent deltaMode so line/page deltas can be displayed on one scale. Use it to compare repeated runs on the same setup rather than to rank different devices.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-4 font-bold text-white transition-colors hover:bg-teal-500"
        >
          <RotateCcw className="h-5 w-5" /> Try Again
        </button>
      </div>
    </div>
  );
}
