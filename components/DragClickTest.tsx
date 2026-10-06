"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, MousePointer2, RotateCcw, Share2, Trophy } from "lucide-react";


const TEST_MS = 10000;

function getPeakOneSecondCps(times: number[]) {
  if (!times.length) return 0;

  let left = 0;
  let peak = 0;

  for (let right = 0; right < times.length; right++) {
    while (times[right] - times[left] > 1000) left++;
    peak = Math.max(peak, right - left + 1);
  }

  return peak;
}

function getBuckets(times: number[], startTime: number) {
  const buckets = Array(10).fill(0);

  for (const time of times) {
    const index = Math.min(9, Math.max(0, Math.floor((time - startTime) / 1000)));
    buckets[index] += 1;
  }

  return buckets;
}

export default function DragClickTest() {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [buckets, setBuckets] = useState<number[]>(Array(10).fill(0));
  const [peakCps, setPeakCps] = useState(0);
  const [bestPeakCps, setBestPeakCps] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const clickTimesRef = useRef<number[]>([]);
  const clicksRef = useRef(0);
  const activeRef = useRef(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("dragClickBest");
    if (saved) {
      const parsed = Number(saved);
      if (Number.isFinite(parsed)) setBestPeakCps(parsed);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const finishTest = () => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    activeRef.current = false;
    setIsFinished(true);
    setIsActive(false);
    setTimeLeft(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const times = clickTimesRef.current;
    const peak = getPeakOneSecondCps(times);
    setPeakCps(peak);
    setBuckets(getBuckets(times, startTimeRef.current));
    setClicks(clicksRef.current);

    setBestPeakCps((previous) => {
      if (previous === null || peak > previous) {
        localStorage.setItem("dragClickBest", String(peak));
        return peak;
      }
      return previous;
    });
  };

  const startTest = (now: number) => {
    activeRef.current = true;
    finishedRef.current = false;
    startTimeRef.current = now;
    setIsActive(true);
    setIsFinished(false);
    setTimeLeft(10);

    timerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, (TEST_MS - elapsed) / 1000);
      setTimeLeft(remaining);

      if (elapsed >= TEST_MS) {
        finishTest();
      }
    }, 33);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (finishedRef.current) return;

    const now = performance.now();

    if (!activeRef.current) {
      startTest(now);
    }

    clicksRef.current += 1;
    clickTimesRef.current.push(now);
    setClicks(clicksRef.current);

    setDragActive(true);
    window.setTimeout(() => setDragActive(false), 55);
  };

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = null;
    startTimeRef.current = 0;
    clickTimesRef.current = [];
    clicksRef.current = 0;
    activeRef.current = false;
    finishedRef.current = false;

    setClicks(0);
    setTimeLeft(10);
    setIsActive(false);
    setIsFinished(false);
    setDragActive(false);
    setBuckets(Array(10).fill(0));
    setPeakCps(0);
  };

  const elapsed = isFinished ? 10 : Math.max(0, 10 - timeLeft);
  const averageCps = elapsed > 0 ? clicks / elapsed : 0;
  const maxBucket = Math.max(1, ...buckets);

  const shareScore = async () => {
    const text = `I recorded ${peakCps} peak 1-second CPS and ${(clicks / 10).toFixed(2)} average CPS on the Geometry Dash Drag Click Test.`;
    const url = "https://geometrydashspam.cc/drag-click";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Drag Click Test", text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="grid grid-cols-3 w-full gap-2 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <div className="text-center">
              <div className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Time left</div>
              <div className="text-2xl md:text-4xl font-display font-bold text-white">{timeLeft.toFixed(2)}s</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Average CPS</div>
              <div className="text-2xl md:text-4xl font-display font-bold text-indigo-400">
                {averageCps.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-yellow-500" /> Best peak
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-white">
                {bestPeakCps !== null ? bestPeakCps : "--"}
              </div>
            </div>
          </div>

          {!isFinished ? (
            <button
              type="button"
              onPointerDown={handlePointerDown}
              className={
                "touch-none w-full h-64 md:h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-75 group select-none " +
                (dragActive
                  ? "bg-indigo-600/20 border-indigo-500/50 scale-[0.98]"
                  : "bg-indigo-900/10 border-indigo-500/20 hover:bg-indigo-800/20 hover:border-indigo-500/30")
              }
            >
              <MousePointer2
                className={
                  "w-16 h-16 md:w-20 md:h-20 transition-all duration-75 " +
                  (dragActive
                    ? "text-indigo-400 scale-90"
                    : "text-indigo-500/50 group-hover:text-indigo-400")
                }
              />
              <div className="text-center px-5">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                  {isActive ? "Keep Drag Clicking" : "Drag Click Here"}
                </h2>
                <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
                  The browser counts registered pointer-down events. The timer starts on the first registered input.
                </p>
              </div>
            </button>
          ) : (
            <div className="w-full">
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-3xl p-8 text-center">
                <h2 className="text-2xl text-indigo-200 font-bold mb-5">Test Complete</h2>

                <div className="grid gap-3 sm:grid-cols-3 mb-6">
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

                <div className="w-full h-28 flex items-end gap-1 mb-6 opacity-90" aria-label="Clicks registered in each second">
                  {buckets.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-indigo-500/30 rounded-t-sm relative group"
                      style={{ height: `${Math.max(5, (value / maxBucket) * 100)}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-xs text-white px-2 py-1 rounded whitespace-nowrap">
                        Second {index + 1}: {value}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm leading-6 text-slate-400 max-w-xl mx-auto mb-7">
                  Peak CPS is the largest number of registered inputs found in any rolling one-second window. Browser event behavior can differ by device and operating system.
                </p>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={resetTest}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" /> Try Again
                  </button>
                  <button
                    onClick={shareScore}
                    className="p-4 bg-slate-800 text-white rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors border border-white/10"
                    title={copied ? "Copied" : "Share your score"}
                    aria-label={copied ? "Result copied" : "Share drag-click result"}
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-slate-900/25 p-5 text-sm leading-6 text-slate-400">
        This page measures browser-registered inputs, not the electrical behavior of a mouse switch. Use repeated runs on the same setup when comparing technique changes.
      </div>
</div>
  );
}
