"use client";

import React, { useRef, useState } from "react";
import { MousePointer2, RotateCcw } from "lucide-react";


type HistoryItem = {
  id: number;
  delta: number;
  isRapid: boolean;
};

export default function DoubleClickTest() {
  const [clicks, setClicks] = useState(0);
  const [rapidIntervals, setRapidIntervals] = useState(0);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [threshold, setThreshold] = useState(80);

  const lastClickTime = useRef(0);
  const clickIdRef = useRef(0);
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  const registerClick = () => {
    const now = performance.now();
    const previous = lastClickTime.current;
    lastClickTime.current = now;
    setClicks((value) => value + 1);

    if (!previous) return;

    const delta = now - previous;
    if (delta > 2000) return;

    const rounded = Math.round(delta);
    const isRapid = delta < threshold;

    if (isRapid) {
      setRapidIntervals((value) => value + 1);
    }

    setLastDelta(rounded);
    clickIdRef.current += 1;
    setHistory((items) =>
      [
        { id: clickIdRef.current, delta: rounded, isRapid },
        ...items,
      ].slice(0, 50)
    );
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") {
      pendingTouchRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }

    event.preventDefault();
    registerClick();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const pending = pendingTouchRef.current;
    if (!pending || pending.pointerId !== event.pointerId) return;

    pendingTouchRef.current = null;
    const moved = Math.hypot(event.clientX - pending.x, event.clientY - pending.y);
    if (moved <= 12) registerClick();
  };

  const handlePointerCancel = () => {
    pendingTouchRef.current = null;
  };

  const resetTest = () => {
    setClicks(0);
    setRapidIntervals(0);
    setLastDelta(null);
    setHistory([]);
    lastClickTime.current = 0;
    clickIdRef.current = 0;
  };

  const intervalCount = Math.max(0, clicks - 1);
  const rapidRate =
    intervalCount > 0
      ? ((rapidIntervals / intervalCount) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <div className="grid grid-cols-3 w-full gap-2 mb-6 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <div className="text-center">
                <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Clicks</div>
                <div className="text-2xl font-display font-bold text-white">{clicks}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Rapid intervals</div>
                <div className="text-2xl font-display font-bold text-fuchsia-400">{rapidIntervals}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Rate</div>
                <div className="text-2xl font-display font-bold text-white">{rapidRate}%</div>
              </div>
            </div>

            <div className="w-full mb-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4 mb-2">
                <label htmlFor="rapid-threshold" className="text-sm font-semibold text-slate-300">
                  Rapid-pair threshold
                </label>
                <span className="font-mono text-sm text-fuchsia-300">{threshold} ms</span>
              </div>
              <input
                id="rapid-threshold"
                type="range"
                min="40"
                max="150"
                step="10"
                value={threshold}
                onChange={(event) => {
                  setThreshold(Number(event.target.value));
                  resetTest();
                }}
                className="w-full"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                The threshold is a test setting, not a universal definition of hardware bounce.
              </p>
            </div>

            <button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="touch-pan-y w-full h-64 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-75 group select-none bg-fuchsia-900/10 border-fuchsia-500/20 hover:bg-fuchsia-800/20 hover:border-fuchsia-500/30 active:scale-[0.99]"
            >
              <MousePointer2 className="w-16 h-16 text-fuchsia-500/50 group-hover:text-fuchsia-400 transition-colors" />
              <div className="text-center">
                <h2 className="text-2xl font-display font-bold text-slate-300 group-hover:text-white transition-colors">
                  Click Here
                </h2>
                <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto px-4">
                  Consecutive pointer events faster than your selected threshold are highlighted.
                </p>
                {lastDelta !== null && (
                  <p className="mt-3 text-xs font-mono text-fuchsia-300">
                    Last interval: {lastDelta} ms
                  </p>
                )}
              </div>
            </button>

            <button
              onClick={resetTest}
              className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Counters
            </button>
          </div>

          <div className="w-full md:w-72 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden h-96">
            <div className="p-4 border-b border-white/5 bg-slate-900/80">
              <div className="font-bold text-sm uppercase tracking-wider text-slate-300">Interval history</div>
              <div className="text-xs text-slate-600 mt-1">Rapid = below {threshold} ms</div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 layout-scrollbar space-y-1">
              {history.length === 0 ? (
                <div className="text-center mt-10 text-sm text-slate-600">Start clicking…</div>
              ) : (
                history.map((item) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-950/15 p-5 text-sm leading-6 text-slate-400">
        Very short intervals can come from intentional fast clicking, switch bounce, software behavior or the input stack.
        This browser page can flag rapid registered events, but it cannot diagnose a mouse switch by itself.
      </div>
</div>
  );
}
