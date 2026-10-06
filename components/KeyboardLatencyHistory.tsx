"use client";

import { memo } from "react";

function KeyboardLatencyHistory({ recentPresses }: { recentPresses: number[] }) {
  return (
    <div className="w-full md:w-64 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden h-96">
      <div className="p-4 border-b border-white/5 bg-slate-900/80">
        <span className="font-bold text-sm uppercase tracking-wider text-slate-400">Recent Taps</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 layout-scrollbar space-y-1">
        {recentPresses.map((duration, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-4 py-2 rounded-lg text-sm font-mono animate-in fade-in slide-in-from-left-2 duration-300 text-slate-300 hover:bg-white/5"
          >
            <span>Tap</span>
            <span>{duration} ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(KeyboardLatencyHistory);
