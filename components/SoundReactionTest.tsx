"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Volume2, Ear } from "lucide-react";
import { isInteractiveKeyboardTarget } from "../lib/inputTarget";
import { useLazyClickSound } from "../lib/useLazyClickSound";
import { useManagedTimeout } from "../lib/useManagedTimeout";
import { useIntentionalPointerAction } from "../lib/useIntentionalPointerAction";
import { usePersistentBestNumber } from "../lib/usePersistentBestNumber";
import { useReactionTrialGuard } from "../lib/useReactionTrialGuard";

const SoundReactionResult = dynamic(() => import("./SoundReactionResult"), { ssr: false });

type State = "idle" | "waiting" | "ready" | "result";

export default function SoundReactionTest() {
  const [gameState, setGameState] = useState<State>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, commitBest] = usePersistentBestNumber("soundReactionBest", "min");

  const startTimeRef = useRef(0);
  const { ensure: ensureSound, play: playSound } = useLazyClickSound();
  const { schedule: scheduleTimeout, clear: clearTimeout } = useManagedTimeout();

  const startTest = useCallback(() => {
    void ensureSound();
    setGameState("waiting");
    setReactionTime(null);

    const delay = Math.floor(Math.random() * 3000) + 2000;
    scheduleTimeout(() => {
      setGameState("ready");
      startTimeRef.current = performance.now();
      playSound("soundReaction");
    }, delay);
  }, [ensureSound, playSound, scheduleTimeout]);

  const handleInteraction = useCallback(() => {
    if (gameState === "idle" || gameState === "result") {
      startTest();
      return;
    }

    if (gameState === "waiting") {
      clearTimeout();
      setReactionTime(null);
      setGameState("result");
      return;
    }

    const nextTime = Math.round(performance.now() - startTimeRef.current);
    setReactionTime(nextTime);

    commitBest(nextTime);
    setGameState("result");
  }, [clearTimeout, commitBest, gameState, startTest]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isInteractiveKeyboardTarget(event.target)) return;
      if (event.code !== "Space") return;

      event.preventDefault();
      handleInteraction();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInteraction]);

  useReactionTrialGuard({ clearTimeout, startTimeRef, setState: setGameState });

  const pointerAction = useIntentionalPointerAction<HTMLDivElement>({ onAction: handleInteraction, deferTouch: gameState === "idle" || gameState === "result" });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex w-full justify-center gap-8 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center">
            <div>
              <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Previous Time</div>
              <div className="text-3xl md:text-4xl font-display font-bold text-white">{reactionTime !== null ? `${reactionTime}ms` : "--"}</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Best Time</div>
              <div className="text-3xl md:text-4xl font-display font-bold text-violet-400">{bestTime !== null ? `${bestTime}ms` : "--"}</div>
            </div>
          </div>

          <div
            {...pointerAction}
            className={`
              ${gameState === "waiting" || gameState === "ready" ? "touch-none" : "touch-pan-y"} w-full h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 select-none cursor-pointer
              ${gameState === "idle" ? "bg-violet-900/10 border-violet-500/20 hover:bg-violet-800/20 hover:border-violet-500/30" : ""}
              ${gameState === "waiting" ? "bg-amber-900/40 border-amber-500/40" : ""}
              ${gameState === "ready" ? "bg-green-600/40 border-green-400/50" : ""}
              ${gameState === "result" && reactionTime !== null ? "bg-violet-900/20 border-violet-500/40" : ""}
              ${gameState === "result" && reactionTime === null ? "bg-rose-900/20 border-rose-500/40" : ""}
            `}
          >
            {gameState === "idle" && (
              <>
                <Ear className="w-20 h-20 text-violet-500/50" />
                <div className="text-center">
                  <h3 className="text-3xl font-display font-bold text-slate-300">Start Audio Test</h3>
                  <p className="text-slate-500 mt-2 px-4 max-w-sm mx-auto">Click anywhere or press Space when you hear the beep.</p>
                </div>
              </>
            )}

            {gameState === "waiting" && (
              <div className="text-center animate-pulse">
                <Volume2 className="w-20 h-20 text-amber-500/50 mx-auto mb-4" />
                <h3 className="text-3xl font-display font-bold text-amber-400">Wait for the sound...</h3>
              </div>
            )}

            {gameState === "ready" && (
              <div className="text-center font-display font-bold text-white">
                <h3 className="text-6xl drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">CLICK!</h3>
              </div>
            )}

            {gameState === "result" && <SoundReactionResult reactionTime={reactionTime} />}
          </div>
        </div>
      </div>
    </div>
  );
}
