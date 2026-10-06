"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MousePointer2, RotateCcw } from "lucide-react";


const DoubleClickHistory = dynamic(() => import("./DoubleClickHistory"), { ssr: false });

export type HistoryItem = {
  id: number;
  delta: number;
  isRapid: boolean;
};

type MeasurementState = {
  clicks: number;
  rapidIntervals: number;
  lastDelta: number | null;
  history: HistoryItem[];
};

const EMPTY_MEASUREMENT: MeasurementState = {
  clicks: 0,
  rapidIntervals: 0,
  lastDelta: null,
  history: [],
};

export default function DoubleClickTest() {
  const [measurement, setMeasurement] = useState<MeasurementState>(EMPTY_MEASUREMENT);
  const [threshold, setThreshold] = useState(80);

  const { clicks, rapidIntervals, lastDelta, history } = measurement;

  const lastClickTime = useRef(0);
  const clickIdRef = useRef(0);
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  const registerClick = () => {
    const now = performance.now();
    const previous = lastClickTime.current;
    lastClickTime.current = now;

    if (!previous) {
      setMeasurement((current) => ({
        ...current,
        clicks: current.clicks + 1,
      }));
      return;
    }

    const delta = now - previous;
    if (delta > 2000) {
      setMeasurement((current) => ({
        ...current,
        clicks: current.clicks + 1,
      }));
      return;
    }

    const rounded = Math.round(delta);
    const isRapid = delta < threshold;
    clickIdRef.current += 1;

    setMeasurement((current) => ({
      clicks: current.clicks + 1,
      rapidIntervals: current.rapidIntervals + (isRapid ? 1 : 0),
      lastDelta: rounded,
      history: [
        { id: clickIdRef.current, delta: rounded, isRapid },
        ...current.history,
      ].slice(0, 50),
    }));
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
    setMeasurement(EMPTY_MEASUREMENT);
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

          {history.length > 0 ? (
            <DoubleClickHistory history={history} threshold={threshold} />
          ) : (
            <div className="w-full md:w-72 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden h-96">
              <div className="p-4 border-b border-white/5 bg-slate-900/80">
                <div className="font-bold text-sm uppercase tracking-wider text-slate-300">Interval history</div>
                <div className="text-xs text-slate-600 mt-1">Rapid = below {threshold} ms</div>
              </div>
              <div className="text-center mt-10 text-sm text-slate-600">Start clicking…</div>
            </div>
          )}
        </div>
      </div>


</div>
  );
}
