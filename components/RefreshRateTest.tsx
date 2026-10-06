"use client";

import React, { useEffect, useRef, useState } from "react";
import { RefreshCw, Zap } from "lucide-react";

export default function RefreshRateTest() {
  const [observedHz, setObservedHz] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);
  const [stable, setStable] = useState(false);

  const requestRef = useRef(0);
  const lastFrameRef = useRef(0);
  const lastUiUpdateRef = useRef(0);
  const intervalsRef = useRef<number[]>([]);

  useEffect(() => {
    let active = true;

    const loop = (timestamp: number) => {
      if (!active) return;

      if (lastFrameRef.current > 0) {
        const delta = timestamp - lastFrameRef.current;

        // Ignore long pauses caused by tab switching or browser throttling.
        if (delta >= 2 && delta <= 100) {
          intervalsRef.current.push(delta);
          if (intervalsRef.current.length > 240) {
            intervalsRef.current.shift();
          }
        }
      }

      lastFrameRef.current = timestamp;

      if (
        timestamp - lastUiUpdateRef.current >= 250 &&
        intervalsRef.current.length >= 8
      ) {
        const sorted = [...intervalsRef.current].sort((a, b) => a - b);
        const median =
          sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

        const hz = median > 0 ? Math.round(1000 / median) : 0;
        setObservedHz(hz);
        setSampleCount(sorted.length);
        setStable(sorted.length >= 60);
        lastUiUpdateRef.current = timestamp;
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
          <RefreshCw className={`w-12 h-12 text-cyan-500/20 absolute -right-2 -bottom-2 ${stable ? "" : "animate-spin"}`} />

          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 relative z-10">
            Observed refresh cadence
          </h2>
          <div className="flex items-end gap-2 relative z-10">
            <span className="text-7xl font-display font-black text-cyan-400 tabular-nums">
              {observedHz || "--"}
            </span>
            <span className="text-2xl text-slate-400 font-bold mb-2">Hz</span>
          </div>
          <div className="mt-4 text-xs font-mono text-slate-500 relative z-10">
            {stable ? "Reading stabilized" : "Collecting frame samples…"}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="font-bold text-white text-lg">Measurement status</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 mb-4">
            <span className="text-slate-400">Frame intervals sampled</span>
            <span className="text-2xl font-mono font-bold text-white tabular-nums">{sampleCount}</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/30 p-4 text-sm leading-6 text-slate-400">
            The estimate uses the median recent frame interval. This is more stable than treating a short peak frame count as the monitor&apos;s certified hardware refresh rate.
          </div>
        </div>
      </div>

</div>
  );
}
