"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Timer, AlertCircle, Play, Trophy } from "lucide-react";
import { isInteractiveKeyboardTarget } from "../lib/inputTarget";
import { useManagedTimeout } from "../lib/useManagedTimeout";
import { useIntentionalPointerAction } from "../lib/useIntentionalPointerAction";
import { usePersistentBestNumber } from "../lib/usePersistentBestNumber";

const ReactionResult = dynamic(() => import("./ReactionResult"), { ssr: false });

type TestState = "idle" | "waiting" | "ready" | "result" | "early";

export default function ReactionTest() {
  const [state, setState] = useState<TestState>("idle");
  const [result, setResult] = useState(0);
  const [bestScore, commitBestScore] = usePersistentBestNumber("reactionBestScore", "min");
  const startTimeRef = useRef(0);
  const { schedule: scheduleTimeout, clear: clearTimeout } = useManagedTimeout();

  const startTest = useCallback(() => {
    setState("waiting");
    const delay = Math.floor(Math.random() * 3000) + 2000;

    scheduleTimeout(() => {
      setState("ready");
      startTimeRef.current = performance.now();
    }, delay);
  }, [scheduleTimeout]);

  const handleInteraction = useCallback(() => {
    if (state === "idle") {
      startTest();
      return;
    }

    if (state === "waiting") {
      clearTimeout();
      setState("early");
      return;
    }

    if (state === "ready") {
      const nextResult = Math.round(performance.now() - startTimeRef.current);
      setResult(nextResult);

      if (bestScore === null || nextResult < bestScore) {
        commitBestScore(nextResult);
      }

      setState("result");
      return;
    }

    startTest();
  }, [bestScore, clearTimeout, commitBestScore, startTest, state]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isInteractiveKeyboardTarget(event.target)) return;
      if (event.code !== "Space" && event.code !== "Enter") return;

      event.preventDefault();
      handleInteraction();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInteraction]);

  const pointerAction = useIntentionalPointerAction<HTMLDivElement>({
    onAction: handleInteraction,
    deferTouch: state === "idle" || state === "result" || state === "early",
    ignoreSelector: "button",
  });

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div
        {...pointerAction}
        className={`
          ${state === "waiting" || state === "ready" ? "touch-none" : "touch-pan-y"} relative w-full h-[400px] rounded-2xl cursor-pointer transition-all duration-200 select-none flex flex-col items-center justify-center p-8 text-center shadow-2xl mb-12
          ${state === "idle" ? "bg-slate-800 hover:bg-slate-700 border-4 border-slate-600" : ""}
          ${state === "waiting" ? "bg-red-600 border-4 border-red-800" : ""}
          ${state === "ready" ? "bg-green-500 border-4 border-green-700" : ""}
          ${state === "result" ? "bg-slate-800 border-4 border-slate-600" : ""}
          ${state === "early" ? "bg-yellow-600 border-4 border-yellow-800" : ""}
        `}
      >
        {state === "idle" && (
          <>
            <Play className="w-20 h-20 text-slate-400 mb-4" />
            <h2 className="text-4xl font-display font-bold text-white mb-2">Reaction Time Test</h2>
            <p className="text-slate-300 text-lg mb-4">Click anywhere to start.</p>
            {bestScore !== null && (
              <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20">
                <Trophy className="w-5 h-5" /> Best: {bestScore} ms
              </div>
            )}
            <p className="text-slate-500 mt-4 text-sm">When the red box turns green, click as fast as you can.</p>
          </>
        )}

        {state === "waiting" && (
          <>
            <div className="w-20 h-20 rounded-full border-4 border-white/20 border-t-white animate-spin mb-6" />
            <h2 className="text-5xl font-display font-bold text-white drop-shadow-lg">WAIT FOR GREEN...</h2>
          </>
        )}

        {state === "ready" && (
          <>
            <Timer className="w-24 h-24 text-white mb-4 animate-ping" />
            <h2 className="text-6xl font-display font-black text-white drop-shadow-xl">CLICK!</h2>
          </>
        )}

        {state === "result" && <ReactionResult result={result} bestScore={bestScore} />}

        {state === "early" && (
          <>
            <AlertCircle className="w-20 h-20 text-white mb-4" />
            <h2 className="text-4xl font-display font-bold text-white mb-2">TOO SOON!</h2>
            <p className="text-white/80 text-lg">You clicked before it turned green.</p>
            <p className="mt-8 text-white/60 font-mono">Click to restart</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-16">
        <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
          <div className="text-slate-500 text-xs uppercase mb-1">Current Result</div>
          <div className="text-white font-bold text-xl">{result > 0 ? `${result} ms` : "--"}</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
          <div className="text-slate-500 text-xs uppercase mb-1">Local Best</div>
          <div className="text-green-400 font-bold text-xl">{bestScore !== null ? `${bestScore} ms` : "--"}</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
          <div className="text-slate-500 text-xs uppercase mb-1">Measurement</div>
          <div className="text-slate-300 text-sm">Browser cue-to-input time</div>
        </div>
      </div>
    </div>
  );
}
