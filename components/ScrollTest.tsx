"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Activity } from "lucide-react";
import { useExactCountdown } from "../lib/useExactCountdown";

const ScrollResult = dynamic(() => import("./ScrollResult"), { ssr: false });
const TEST_MS = 10000;

export default function ScrollTest() {
  const [distance, setDistance] = useState(0);
  const [events, setEvents] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const patternRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(0);
  const distanceRef = useRef(0);
  const eventsRef = useRef(0);
  const scrollOffsetRef = useRef(0);
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
  }, []);

  const startTest = useCallback(() => {
    activeRef.current = true;
    finishedRef.current = false;
    startTimeRef.current = performance.now();
    setIsActive(true);
    setIsFinished(false);
  }, []);

  const handleScroll = useCallback((event: WheelEvent) => {
    if (finishedRef.current) return;
    event.preventDefault();

    if (
      activeRef.current &&
      performance.now() - startTimeRef.current >= TEST_MS
    ) {
      finishTest();
      return;
    }

    if (!activeRef.current) startTest();

    const target = event.currentTarget as HTMLElement;
    const factor =
      event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? Math.max(1, target.clientHeight)
          : 1;

    distanceRef.current += Math.abs(event.deltaY * factor);
    eventsRef.current += 1;
    scrollOffsetRef.current = (scrollOffsetRef.current + (event.deltaY > 0 ? 10 : -10)) % 40;

    if (patternRef.current) {
      patternRef.current.style.backgroundPositionY = `${scrollOffsetRef.current}px`;
    }
  }, [finishTest, startTest]);

  useEffect(() => {
    const target = document.getElementById("scroll-target");
    if (!target) return;

    target.addEventListener("wheel", handleScroll, { passive: false });
    return () => target.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);


  const cancelCountdown = useExactCountdown({
    running: isActive && !isFinished,
    durationMs: TEST_MS,
    startTimeRef,
    onTick: (remainingMs) => {
      setTimeLeft(remainingMs / 1000);
      setDistance(distanceRef.current);
      setEvents(eventsRef.current);
    },
    onFinish: finishTest,
  });

  const resetTest = () => {
    cancelCountdown();
    startTimeRef.current = 0;
    distanceRef.current = 0;
    eventsRef.current = 0;
    scrollOffsetRef.current = 0;
    activeRef.current = false;
    finishedRef.current = false;

    if (patternRef.current) patternRef.current.style.backgroundPositionY = "0px";

    setDistance(0);
    setEvents(0);
    setTimeLeft(10);
    setIsActive(false);
    setIsFinished(false);
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
              <div ref={patternRef} className="absolute inset-0 opacity-10 bg-grid" />
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
            <ScrollResult
              distancePerSecond={distancePerSecond}
              eventsPerSecond={eventsPerSecond}
              onReset={resetTest}
            />
          )}
        </div>
      </div>
    </div>
  );
}
