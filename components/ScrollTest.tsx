"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, RotateCcw } from "lucide-react";

const RelatedTools = dynamic(() => import("./RelatedTools"));

const TEST_MS = 10000;

export default function ScrollTest() {
  const [distance, setDistance] = useState(0);
  const [events, setEvents] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const distanceRef = useRef(0);
  const eventsRef = useRef(0);
  const activeRef = useRef(false);
  const finishedRef = useRef(false);

  const finishTest = useCallback(() => {
    activeRef.current = false;
    finishedRef.current = true;
    setIsActive(false);
    setIsFinished(true);
    setTimeLeft(0);
    setDistance(distanceRef.current);
    setEvents(eventsRef.current);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTest = useCallback(() => {
    activeRef.current = true;
    finishedRef.current = false;
    startTimeRef.current = performance.now();
    setIsActive(true);
    setIsFinished(false);

    timerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, (TEST_MS - elapsed) / 1000);
      setTimeLeft(remaining);

      if (elapsed >= TEST_MS) {
        finishTest();
      }
    }, 33);
  }, [finishTest]);

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (finishedRef.current) return;
      event.preventDefault();

      if (!activeRef.current) {
        startTest();
      }

      const target = event.currentTarget as HTMLElement;
      const factor =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? Math.max(1, target.clientHeight)
          : 1;

      const normalized = Math.abs(event.deltaY * factor);
      distanceRef.current += normalized;
      eventsRef.current += 1;

      setDistance(distanceRef.current);
      setEvents(eventsRef.current);
      setScrollY((value) => (value + (event.deltaY > 0 ? 10 : -10)) % 40);
    },
    [startTest]
  );

  useEffect(() => {
    const target = document.getElementById("scroll-target");
    if (!target) return;

    target.addEventListener("wheel", handleScroll, { passive: false });
    return () => target.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startTimeRef.current = 0;
    distanceRef.current = 0;
    eventsRef.current = 0;
    activeRef.current = false;
    finishedRef.current = false;

    setDistance(0);
    setEvents(0);
    setTimeLeft(10);
    setIsActive(false);
    setIsFinished(false);
    setScrollY(0);
  };

  const distancePerSecond = Math.round(distance / 10);
  const eventsPerSecond = (events / 10).toFixed(1);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="grid grid-cols-3 w-full gap-2 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <div className="text-center">
              <div className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Time left</div>
              <div className="text-2xl md:text-4xl font-display font-bold text-white">{timeLeft.toFixed(2)}s</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Wheel events</div>
              <div className="text-2xl md:text-4xl font-display font-bold text-teal-400">{events}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Distance</div>
              <div className="text-2xl md:text-4xl font-display font-bold text-white">{Math.round(distance)}</div>
            </div>
          </div>

          {!isFinished ? (
            <div
              id="scroll-target"
              className="w-full h-64 md:h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-colors group select-none bg-teal-900/10 border-teal-500/20 hover:bg-teal-800/20 hover:border-teal-500/30 overflow-hidden relative cursor-n-resize"
            >
              <div
                className="absolute inset-0 opacity-10 bg-grid"
                style={{ backgroundPositionY: `${scrollY}px` }}
              />

              <Activity className="w-16 h-16 md:w-20 md:h-20 text-teal-500/50 group-hover:text-teal-400 transition-colors relative z-10" />
              <div className="text-center relative z-10 px-5">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-300 group-hover:text-white transition-colors">
                  {isActive ? "Keep Scrolling!" : "Scroll Up or Down Here"}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">
                  The timer starts on the first wheel event. Desktop mouse wheels and trackpads can report very different delta values.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="bg-teal-900/20 border border-teal-500/30 rounded-3xl p-8 text-center">
                <h2 className="text-2xl text-teal-200 font-bold mb-5">Test Complete</h2>
                <div className="grid gap-3 sm:grid-cols-2 mb-7">
                  <div className="rounded-xl bg-black/25 p-4">
                    <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Normalized distance / second</div>
                    <div className="text-3xl font-display font-bold text-white">{distancePerSecond}</div>
                  </div>
                  <div className="rounded-xl bg-black/25 p-4">
                    <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Wheel events / second</div>
                    <div className="text-3xl font-display font-bold text-teal-300">{eventsPerSecond}</div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-400 max-w-xl mx-auto mb-7">
                  Distance is normalized from WheelEvent deltaMode so line/page deltas can be displayed on one scale. Use it to compare repeated runs on the same setup rather than to rank different devices.
                </p>
                <button
                  onClick={resetTest}
                  className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <RelatedTools currentTool="scroll" />
    </div>
  );
}
