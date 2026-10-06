"use client";

import React, { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MousePointer2, Trophy } from "lucide-react";
import { useExactCountdown } from "../lib/useExactCountdown";
import { usePersistentBestNumber } from "../lib/usePersistentBestNumber";

const DragClickResult = dynamic(() => import("./DragClickResult"), { ssr: false });

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
  const [buckets, setBuckets] = useState<number[]>(Array(10).fill(0));
  const [peakCps, setPeakCps] = useState(0);
  const [bestPeakCps, commitBestPeakCps] = usePersistentBestNumber("dragClickBest");

  const startTimeRef = useRef(0);
  const clickTimesRef = useRef<number[]>([]);
  const clicksRef = useRef(0);
  const activeRef = useRef(false);
  const finishedRef = useRef(false);
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  const finishTest = useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    activeRef.current = false;

    const times = clickTimesRef.current;
    const peak = getPeakOneSecondCps(times);

    setIsFinished(true);
    setIsActive(false);
    setTimeLeft(0);
    setPeakCps(peak);
    setBuckets(getBuckets(times, startTimeRef.current));
    setClicks(clicksRef.current);

    commitBestPeakCps(peak);
  }, [commitBestPeakCps]);

  const startTest = useCallback((now: number) => {
    activeRef.current = true;
    finishedRef.current = false;
    startTimeRef.current = now;

    setIsActive(true);
    setIsFinished(false);
    setTimeLeft(10);
  }, []);

  const cancelCountdown = useExactCountdown({
    running: isActive && !isFinished,
    durationMs: TEST_MS,
    startTimeRef,
    onTick: (remainingMs) => setTimeLeft(remainingMs / 1000),
    onFinish: finishTest,
  });

  const registerInput = (now: number) => {
    if (finishedRef.current) return;

    if (activeRef.current && now - startTimeRef.current >= TEST_MS) {
      finishTest();
      return;
    }

    if (!activeRef.current) startTest(now);

    clicksRef.current += 1;
    clickTimesRef.current.push(now);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!activeRef.current && event.pointerType === "touch") {
      pendingTouchRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }

    event.preventDefault();
    registerInput(performance.now());
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const pending = pendingTouchRef.current;
    if (!pending || pending.pointerId !== event.pointerId) return;

    pendingTouchRef.current = null;
    const moved = Math.hypot(event.clientX - pending.x, event.clientY - pending.y);
    if (moved <= 12 && !finishedRef.current) {
      registerInput(performance.now());
    }
  };

  const handlePointerCancel = () => {
    pendingTouchRef.current = null;
  };

  const resetTest = () => {
    cancelCountdown();
    startTimeRef.current = 0;
    clickTimesRef.current = [];
    clicksRef.current = 0;
    activeRef.current = false;
    finishedRef.current = false;
    pendingTouchRef.current = null;

    setClicks(0);
    setTimeLeft(10);
    setIsActive(false);
    setIsFinished(false);
    setBuckets(Array(10).fill(0));
    setPeakCps(0);
  };

  const renderedClicks = isActive ? clicksRef.current : clicks;
  const elapsed = isFinished ? 10 : Math.max(0, 10 - timeLeft);
  const averageCps = elapsed > 0 ? renderedClicks / elapsed : 0;


  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isFinished ? `Test complete. ${(clicks / 10).toFixed(2)} average CPS and ${peakCps} peak one-second CPS.` : ""}
      </p>

      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

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
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className={`${isActive ? "touch-none" : "touch-pan-y"} w-full h-64 md:h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-75 group select-none bg-indigo-900/10 border-indigo-500/20 hover:bg-indigo-800/20 hover:border-indigo-500/30 active:bg-indigo-600/20 active:border-indigo-500/50 active:scale-[0.98]`}
            >
              <MousePointer2 className="w-16 h-16 md:w-20 md:h-20 text-indigo-500/50 transition-all duration-75 group-hover:text-indigo-400 group-active:scale-90 group-active:text-indigo-400" />
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
            <DragClickResult
              clicks={clicks}
              peakCps={peakCps}
              buckets={buckets}
              onReset={resetTest}
            />
          )}
        </div>
      </div>


    </div>
  );
}
