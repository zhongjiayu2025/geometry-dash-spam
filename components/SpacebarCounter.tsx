"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { isInteractiveKeyboardTarget } from "../lib/inputTarget";
import { Keyboard, Trophy, Volume2, VolumeX, Zap } from "lucide-react";

const SpacebarFinishedActions = dynamic(() => import("./SpacebarFinishedActions"), { ssr: false });
import { useLazyClickSound } from "../lib/useLazyClickSound";

const TEST_MS = 10000;

const SpacebarCounter: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [bestCps, setBestCps] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const timerRef = useRef<number | null>(null);
  const visualKeyRef = useRef<HTMLDivElement>(null);
  const visualKeyLabelRef = useRef<HTMLSpanElement>(null);
  const endTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const countRef = useRef(0);
  const activeRef = useRef(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    setSoundEnabled(localStorage.getItem("spacebarSoundEnabled") === "true");

    const saved = localStorage.getItem("spacebarBest");
    if (saved) {
      const parsed = Number(saved);
      if (Number.isFinite(parsed)) setBestCps(parsed);
    }
  }, []);



  const { ensure: ensureClickSound, play: playClickSound, suspend: suspendClickSound } = useLazyClickSound();

  const setVisualPressed = useCallback((pressed: boolean) => {
    const key = visualKeyRef.current;
    const label = visualKeyLabelRef.current;
    if (!key || !label) return;

    key.classList.toggle("bg-purple-500", pressed);
    key.classList.toggle("border-purple-700", pressed);
    key.classList.toggle("translate-y-2", pressed);
    key.classList.toggle("shadow-none", pressed);
    key.classList.toggle("bg-slate-200", !pressed);
    key.classList.toggle("border-slate-400", !pressed);
    key.classList.toggle("translate-y-0", !pressed);
    key.classList.toggle("shadow-[0_10px_20px_rgba(0,0,0,0.5)]", !pressed);

    label.classList.toggle("text-white", pressed);
    label.classList.toggle("text-slate-500", !pressed);
  }, []);

  const finishTest = useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    activeRef.current = false;

    const finalCount = countRef.current;
    const finalCps = finalCount / 10;

    setFinished(true);
    setActive(false);
    setVisualPressed(false);
    setTimeLeft(0);
    setCount(finalCount);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (endTimerRef.current) {
      window.clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }

    setBestCps((previous) => {
      if (previous === null || finalCps > previous) {
        localStorage.setItem("spacebarBest", String(finalCps));
        return finalCps;
      }
      return previous;
    });
  }, [setVisualPressed]);

  const startTest = useCallback((now: number) => {
    activeRef.current = true;
    finishedRef.current = false;
    startTimeRef.current = now;
    countRef.current = 1;

    setActive(true);
    setFinished(false);
    setCount(1);
    setTimeLeft(10);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isInteractiveKeyboardTarget(event.target)) return;
    if (event.code !== "Space") return;

    event.preventDefault();
    if (event.repeat) return;

    const now = performance.now();

    if (finishedRef.current) return;
    if (activeRef.current && now - startTimeRef.current >= TEST_MS) {
      finishTest();
      return;
    }

    if (soundEnabled) playClickSound("spacebar");

    setVisualPressed(true);

    if (!activeRef.current) {
      startTest(now);
      return;
    }

    countRef.current += 1;
  }, [finishTest, playClickSound, setVisualPressed, soundEnabled, startTest]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (isInteractiveKeyboardTarget(event.target)) return;
    if (event.code === "Space") setVisualPressed(false);
  }, [setVisualPressed]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!active || finished) return;

    const updateTimer = () => {
      const elapsed = performance.now() - startTimeRef.current;
      setTimeLeft(Math.max(0, (TEST_MS - elapsed) / 1000));
    };

    updateTimer();
    timerRef.current = window.setInterval(updateTimer, 100);

    const elapsedMs = performance.now() - startTimeRef.current;
    endTimerRef.current = window.setTimeout(
      finishTest,
      Math.max(0, TEST_MS - elapsedMs)
    );

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (endTimerRef.current) {
        window.clearTimeout(endTimerRef.current);
        endTimerRef.current = null;
      }
    };
  }, [active, finished, finishTest]);

  const reset = () => {
    activeRef.current = false;
    finishedRef.current = false;
    startTimeRef.current = 0;
    countRef.current = 0;

    setActive(false);
    setFinished(false);
    setCount(0);
    setTimeLeft(10);
    setVisualPressed(false);

    if (timerRef.current) window.clearInterval(timerRef.current);
    if (endTimerRef.current) window.clearTimeout(endTimerRef.current);
    timerRef.current = null;
    endTimerRef.current = null;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("spacebarSoundEnabled", String(next));

    if (next) {
      void ensureClickSound();
    } else {
      void suspendClickSound();
    }
  };


  const renderedCount = active ? countRef.current : count;
  const liveCps = finished
    ? count / 10
    : active && timeLeft < 10
      ? countRef.current / Math.max(0.05, 10 - timeLeft)
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {finished ? `Test complete. ${(count / 10).toFixed(2)} spacebar presses per second over 10 seconds.` : ""}
      </p>

      <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-md md:p-12">
        <div className="relative z-10">
          <div className="mb-12">
            <h2 className="mb-4 font-bold uppercase tracking-[0.2em] text-slate-400">Spacebar Presses</h2>
            <div className="text-8xl font-display font-black tracking-tighter text-white drop-shadow-2xl md:text-9xl">
              {renderedCount}
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <div
              ref={visualKeyRef}
              className="flex h-24 w-full max-w-md translate-y-0 items-center justify-center rounded-lg border-b-8 border-slate-400 bg-slate-200 shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-75"
            >
              <span ref={visualKeyLabelRef} className="text-xl font-bold uppercase tracking-widest text-slate-500">
                Space
              </span>
            </div>
          </div>

          {!active && !finished && (
            <p className="animate-pulse font-mono text-purple-400">Press SPACE to Start 10s Timer</p>
          )}

          {active && (
            <p className="font-mono text-slate-500">
              Time Remaining: <span className="font-bold text-white">{timeLeft.toFixed(2)}s</span>
            </p>
          )}

          {finished && (
            <SpacebarFinishedActions count={count} onReset={reset} />
          )}
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex flex-col items-center rounded-xl border border-white/5 bg-slate-900/40 p-6">
          <Keyboard className="mb-2 h-8 w-8 text-purple-500" />
          <span className="text-xs uppercase text-slate-400">Key</span>
          <span className="font-bold text-white">SPACEBAR</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-white/5 bg-slate-900/40 p-6">
          <Zap className="mb-2 h-8 w-8 text-yellow-500" />
          <span className="text-xs uppercase text-slate-400">Speed (CPS)</span>
          <span className="font-bold text-white">{liveCps.toFixed(2)}</span>
        </div>
        <div className="relative flex flex-col items-center rounded-xl border border-white/5 bg-slate-900/40 p-6">
          <Trophy className="mb-2 h-8 w-8 text-yellow-500" />
          <span className="text-xs uppercase text-slate-400">Best CPS</span>
          <span className="font-bold text-white">{bestCps !== null ? bestCps.toFixed(2) : "--"}</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-white/5 bg-slate-900/40 p-6">
          <button
            onClick={toggleSound}
            className="mb-1 rounded-full p-1 transition-colors hover:bg-white/5"
            aria-label={soundEnabled ? "Mute key sound" : "Enable key sound"}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? <Volume2 className="h-6 w-6 text-emerald-400" /> : <VolumeX className="h-6 w-6 text-slate-500" />}
          </button>
          <span className="text-xs uppercase text-slate-400">Sound</span>
          <span className="font-bold text-white">{soundEnabled ? "ON" : "OFF"}</span>
        </div>
      </div>
    </div>
  );
};

export default SpacebarCounter;
