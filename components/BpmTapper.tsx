"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw, Timer } from "lucide-react";

const RelatedTools = dynamic(() => import("./RelatedTools"));

export default function BpmTapper() {
  const [bpm, setBpm] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const tapsRef = useRef<number[]>([]);
  const resetTimeoutRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    tapsRef.current = [];
    setTapCount(0);
    setBpm(0);
    setIsActive(false);

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  }, []);

  const recordTap = useCallback(() => {
    const now = performance.now();
    let taps = [...tapsRef.current, now];

    if (taps.length > 10) {
      taps = taps.slice(-10);
    }

    tapsRef.current = taps;
    setTapCount(taps.length);
    setIsActive(true);

    if (taps.length >= 2) {
      const intervals = taps.slice(1).map((time, index) => time - taps[index]);
      const sorted = [...intervals].sort((a, b) => a - b);
      const median =
        sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];

      const estimate = median > 0 ? Math.round(60000 / median) : 0;
      setBpm(estimate > 0 && estimate < 1000 ? estimate : 0);
    }

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = window.setTimeout(reset, 3000);
  }, [reset]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.tagName !== "BUTTON"
      ) {
        event.preventDefault();
        recordTap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [recordTap]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full mb-8 text-center bg-slate-900/50 p-8 rounded-2xl border border-white/5 relative">
            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Estimated BPM</div>
            <div className="text-7xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-400 to-orange-400">
              {bpm > 0 ? bpm : "--"}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              {tapCount > 1 ? `Based on the latest ${tapCount} taps` : "Tap at least twice to estimate tempo"}
            </div>
            {isActive && (
              <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-rose-400 font-mono">
                <div className="w-2 h-2 bg-rose-500 rounded-full" /> Recording
              </div>
            )}
          </div>

          <button
            id="bpm-btn"
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              recordTap();
            }}
            className="touch-none w-full h-64 md:h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-75 group select-none bg-rose-900/10 border-rose-500/20 hover:bg-rose-800/20 hover:border-rose-500/30 active:scale-[0.99]"
          >
            <Timer className="w-16 h-16 md:w-20 md:h-20 text-rose-500/50 group-hover:text-rose-400 transition-colors" />
            <div className="text-center px-5">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-300 group-hover:text-white transition-colors">
                Tap Here or Press Space
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                Tap steadily with the beat. The estimate uses the median of recent tap intervals and resets after three seconds of inactivity.
              </p>
            </div>
          </button>

          <button
            onClick={reset}
            className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <RelatedTools currentTool="bpm" />
    </div>
  );
}
