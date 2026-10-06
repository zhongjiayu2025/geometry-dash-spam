"use client";

import React, { useEffect, useRef, useState } from "react";
import { Activity, Mouse } from "lucide-react";

const SAMPLE_MS = 1000;

export default function PollingRateTest() {
  const [isTracking, setIsTracking] = useState(false);
  const [hz, setHz] = useState(0);
  const [maxHz, setMaxHz] = useState(0);
  const [avgHz, setAvgHz] = useState(0);

  const trackingAreaRef = useRef<HTMLDivElement>(null);
  const eventCountRef = useRef(0);
  const totalEventsRef = useRef(0);
  const startedAtRef = useRef(0);
  const sampleStartedAtRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const clearSampler = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const sampleRates = () => {
    const now = performance.now();
    const sampleElapsedSeconds = Math.max(0.001, (now - sampleStartedAtRef.current) / 1000);
    const totalElapsedSeconds = Math.max(0.001, (now - startedAtRef.current) / 1000);

    const currentHz = Math.round(eventCountRef.current / sampleElapsedSeconds);
    const averageHz = Math.round(totalEventsRef.current / totalElapsedSeconds);

    setHz(currentHz);
    setMaxHz((previous) => Math.max(previous, currentHz));
    setAvgHz(averageHz);

    eventCountRef.current = 0;
    sampleStartedAtRef.current = now;
  };

  const startTracking = () => {
    clearSampler();

    const now = performance.now();
    eventCountRef.current = 0;
    totalEventsRef.current = 0;
    startedAtRef.current = now;
    sampleStartedAtRef.current = now;

    setHz(0);
    setMaxHz(0);
    setAvgHz(0);
    setIsTracking(true);

    intervalRef.current = window.setInterval(sampleRates, SAMPLE_MS);
  };

  const stopTracking = () => {
    if (isTracking && totalEventsRef.current > 0) {
      sampleRates();
    }
    setIsTracking(false);
    clearSampler();
  };

  useEffect(() => {
    if (!isTracking) return;

    const area = trackingAreaRef.current;
    if (!area) return;

    const handlePointerMove = () => {
      eventCountRef.current += 1;
      totalEventsRef.current += 1;
    };

    area.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      area.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isTracking]);

  useEffect(() => {
    return () => clearSampler();
  }, []);

  const observedBand =
    maxHz >= 900
      ? "900+ events/s"
      : maxHz >= 450
        ? "450–899 events/s"
        : maxHz >= 200
          ? "200–449 events/s"
          : maxHz >= 100
            ? "100–199 events/s"
            : maxHz > 0
              ? "Below 100 events/s"
              : "No result";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1021] p-6 shadow-2xl md:p-12">
        <div
          aria-hidden="true"
          className="absolute right-1/2 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[80px]"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 grid w-full grid-cols-3 gap-2 rounded-2xl border border-white/5 bg-slate-900/50 p-4 text-center">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 md:text-sm">Current Hz</div>
              <div className="text-3xl font-display font-bold text-white transition-colors duration-100 md:text-5xl">{hz}</div>
            </div>
            <div className="border-x border-white/10">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 md:text-sm">Average Hz</div>
              <div className="text-3xl font-display font-bold text-slate-300 md:text-5xl">{avgHz}</div>
            </div>
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 md:text-sm">Max Hz</div>
              <div className="text-3xl font-display font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] md:text-5xl">{maxHz}</div>
            </div>
          </div>

          <div
            ref={trackingAreaRef}
            className={`group relative flex min-h-80 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-2 p-8 transition-all duration-300 ${
              isTracking
                ? "cursor-crosshair border-emerald-500/40 bg-emerald-900/10"
                : "border-white/5 bg-slate-900/40 hover:border-white/20 hover:bg-slate-800/40"
            }`}
          >
            {!isTracking ? (
              <div className="text-center">
                <Mouse className="mx-auto mb-6 h-20 w-20 text-slate-500/50 transition-colors group-hover:text-emerald-400/50" />
                <button
                  onClick={startTracking}
                  className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-colors hover:bg-emerald-500"
                >
                  Start Tracker
                </button>
                <p className="mx-auto mt-4 max-w-sm text-sm text-slate-500">
                  Click Start and move your mouse continuously in circles inside this box for at least 3 seconds.
                </p>
              </div>
            ) : (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <Activity className={`mb-4 h-32 w-32 text-emerald-500/20 transition-transform ${hz > 0 ? "scale-110 animate-pulse" : ""}`} />
                <h3 className="text-4xl font-display font-bold text-emerald-500/30">KEEP MOVING</h3>
              </div>
            )}
          </div>

          {(maxHz > 0 || isTracking) && (
            <div className="mt-8 flex w-full flex-col items-center rounded-xl border border-emerald-500/20 bg-emerald-900/20 p-6 text-center animate-in zoom-in-95">
              {maxHz > 0 ? (
                <>
                  <span className="mb-1 font-medium text-emerald-200">Observed event-rate band:</span>
                  <span className="text-2xl font-display font-bold text-white">{observedBand}</span>
                  <p className="mt-3 max-w-xl text-sm text-slate-400">
                    Browser pointer events can be coalesced or scheduled differently from the device&apos;s USB polling cycle, so this is a browser-side estimate rather than a hardware certification.
                  </p>
                </>
              ) : (
                <p className="max-w-xl text-sm text-slate-400">
                  Tracking is active. Move the pointer inside the test area to record browser pointer events.
                </p>
              )}

              {isTracking && (
                <button
                  onClick={stopTracking}
                  className="mt-6 rounded-lg bg-white/5 px-6 py-2 font-medium text-slate-300 transition-colors hover:bg-white/10"
                >
                  Stop tracking
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
