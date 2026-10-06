"use client";

import { memo } from "react";
import type { HistoryItem } from "./DoubleClickTest";

function DoubleClickHistory({
  history,
  threshold,
}: {
  history: HistoryItem[];
  threshold: number;
}) {
  return (
    <div className="w-full md:w-72 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden h-96">
      <div className="p-4 border-b border-white/5 bg-slate-900/80">
        <div className="font-bold text-sm uppercase tracking-wider text-slate-300">Interval history</div>
        <div className="text-xs text-slate-600 mt-1">Rapid = below {threshold} ms</div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 layout-scrollbar space-y-1">
        {history.map((item) => (
          <div
            key={item.id}
            className={
              "flex justify-between items-center px-4 py-2 rounded-lg text-sm font-mono " +
              (item.isRapid
                ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                : "text-slate-300 hover:bg-white/5")
            }
          >
            <span>Pair #{item.id}</span>
            <span className={item.isRapid ? "font-bold" : ""}>{item.delta} ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DoubleClickHistory);
