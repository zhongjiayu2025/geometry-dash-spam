"use client";

import React, { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Target, Trophy, Volume2, VolumeX } from "lucide-react";
import type { ClickTone } from "../lib/clickSound";
import { useLazyClickSound } from "../lib/useLazyClickSound";
import { useExactCountdown } from "../lib/useExactCountdown";
import { usePersistentBestNumber } from "../lib/usePersistentBestNumber";

const AimTrainerResult = dynamic(() => import("./AimTrainerResult"), { ssr: false });

export default function AimTrainer() {
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [bestScore, commitBestScore] = usePersistentBestNumber("aimTrainerBest");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const clickTimes = useRef<number[]>([]);
  const lastClickTime = useRef(0);
  const startTimeRef = useRef(0);


  const { ensure: ensureClickSound, play: playClickSound, suspend: suspendClickSound } = useLazyClickSound();

  const playAimSound = useCallback((tone: ClickTone) => {
    if (!soundEnabled) return;

    playClickSound(tone);
  }, [playClickSound, soundEnabled]);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);

    if (next) {
      void ensureClickSound();
    } else {
      void suspendClickSound();
    }
  }, [ensureClickSound, soundEnabled, suspendClickSound]);

  const generateTarget = () => {
    setTargetPos({
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 80) + 10,
    });
  };

  const endGame = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    setTimeLeft(0);

    setScore((currentScore) => {
      commitBestScore(currentScore);
      return currentScore;
    });
  }, [commitBestScore]);

  const cancelCountdown = useExactCountdown({
    running: isActive && !isFinished,
    durationMs: 30000,
    startTimeRef,
    onTick: (remainingMs) => setTimeLeft(remainingMs / 1000),
    onFinish: endGame,
  });

  const startGame = () => {
    cancelCountdown();
    setIsActive(true);
    setIsFinished(false);
    setScore(0);
    setMisses(0);
    setTimeLeft(30);
    clickTimes.current = [];

    const now = performance.now();
    lastClickTime.current = now;
    startTimeRef.current = now;
    generateTarget();

    if (soundEnabled) void ensureClickSound();
  };

  const handleTargetClick = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isActive || isFinished) return;
    if (performance.now() - startTimeRef.current >= 30000) {
      endGame();
      return;
    }

    playAimSound("aimHit");

    const now = performance.now();
    clickTimes.current.push(now - lastClickTime.current);
    lastClickTime.current = now;

    setScore((previous) => previous + 1);
    generateTarget();
  };

  const handleBackgroundClick = () => {
    if (!isActive || isFinished) return;
    if (performance.now() - startTimeRef.current >= 30000) {
      endGame();
      return;
    }
    playAimSound("aimMiss");
    setMisses((previous) => previous + 1);
  };

  const resetGame = () => {
    setIsActive(false);
    setIsFinished(false);
    setScore(0);
    setMisses(0);
    setTimeLeft(30);
    cancelCountdown();
  };

  const totalClicks = score + misses;
  const accuracy = totalClicks > 0 ? ((score / totalClicks) * 100).toFixed(1) : "0.0";
  const averageTime =
    clickTimes.current.length > 0
      ? Math.round(clickTimes.current.reduce((sum, value) => sum + value, 0) / clickTimes.current.length)
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex w-full justify-between items-center mb-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <div className="text-center">
              <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Time Left</div>
              <div className="text-3xl md:text-4xl font-display font-bold text-white">{timeLeft.toFixed(2)}s</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Score</div>
              <div className="text-3xl md:text-4xl font-display font-bold text-cyan-400">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Accuracy</div>
              <div className="text-3xl md:text-4xl font-display font-bold text-white">{accuracy}%</div>
            </div>
            <div className="text-center hidden md:block">
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundEnabled}
                aria-label={soundEnabled ? "Mute aim trainer sounds" : "Enable aim trainer sounds"}
                className={`p-2 rounded-xl border transition-colors ${soundEnabled ? "bg-cyan-600/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-600/30" : "bg-slate-800 border-white/10 text-slate-500 hover:text-slate-300"}`}
                title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="w-full flex justify-between items-center mb-4 px-2">
            {bestScore !== null ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Best Score: <strong className="text-white">{bestScore}</strong>
              </div>
            ) : <div />}
            <div className="md:hidden">
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundEnabled}
                aria-label={soundEnabled ? "Mute aim trainer sounds" : "Enable aim trainer sounds"}
                className={`p-1.5 rounded-lg border transition-colors ${soundEnabled ? "bg-cyan-600/20 border-cyan-500/50 text-cyan-400" : "bg-slate-800 border-white/10 text-slate-500"}`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isActive && !isFinished ? (
            <button
              type="button"
              onClick={startGame}
              className="w-full h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 group select-none bg-cyan-900/10 border-cyan-500/20 hover:bg-cyan-800/20 hover:border-cyan-500/30"
            >
              <Target className="w-16 h-16 md:w-20 md:h-20 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-300 group-hover:text-white transition-colors">
                  Start Aim Trainer
                </h3>
                <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto px-4">
                  Click the targets as quickly and accurately as you can. Pointer presses outside the target count as misses.
                </p>
              </div>
            </button>
          ) : isActive ? (
            <div
              className="w-full h-80 bg-slate-900/40 border border-white/5 rounded-3xl relative overflow-hidden cursor-crosshair"
              onPointerDown={handleBackgroundClick}
            >
              <button
                type="button"
                aria-label="Aim target"
                className="absolute w-12 h-12 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] cursor-pointer flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                onPointerDown={handleTargetClick}
              >
                <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/80" />
                </div>
              </button>
            </div>
          ) : (
            <AimTrainerResult
              score={score}
              misses={misses}
              accuracy={accuracy}
              averageTime={averageTime}
              onReset={resetGame}
            />
          )}
        </div>
      </div>
    </div>
  );
}
