"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Mouse, MousePointer2, Timer, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
import type { ClickTone } from "../lib/clickSound";
import { useLazyClickSound } from "../lib/useLazyClickSound";
import { useExactCountdown } from "../lib/useExactCountdown";
import { usePersistentBestNumber } from "../lib/usePersistentBestNumber";

const SecondaryClickFinishedActions = dynamic(
  () => import("./SecondaryClickFinishedActions"),
  { ssr: false }
);

export type SecondaryClickVariant = "jitter" | "butterfly" | "rightClick";

const CONFIG: Record<
  SecondaryClickVariant,
  {
    bestKey: string;
    soundKey: string;
    tone: ClickTone;
    idleTitle: string;
    activeLabel: string;
    speedLabel: string;
    shareTitle: string;
    shareUrl: string;
    shareName: string;
    accentText: string;
    timerText: string;
    soundOn: string;
    clickArea: string;
    activeCount: string;
    withTopMargin: boolean;
  }
> = {
  jitter: {
    bestKey: "jitterClickBest",
    soundKey: "jitterClickSoundEnabled",
    tone: "jitter",
    idleTitle: "START JITTERING",
    activeLabel: "Clicks",
    speedLabel: "Your Jitter Speed",
    shareTitle: "Jitter Click Test",
    shareUrl: "https://geometrydashspam.cc/jitter-click",
    shareName: "Geometry Dash Jitter Click Test",
    accentText: "text-orange-400",
    timerText: "text-orange-400",
    soundOn: "bg-orange-600/20 border-orange-500/50 text-orange-400 hover:bg-orange-600/30",
    clickArea: "bg-gradient-to-br from-orange-600 to-red-800 border-orange-500 shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:shadow-[0_0_60px_rgba(234,88,12,0.5)] cursor-pointer",
    activeCount: "shake-constant shake-little",
    withTopMargin: false,
  },
  butterfly: {
    bestKey: "butterflyClickBest",
    soundKey: "butterflyClickSoundEnabled",
    tone: "butterfly",
    idleTitle: "BUTTERFLY CLICK",
    activeLabel: "Clicks",
    speedLabel: "Your Butterfly Speed",
    shareTitle: "Butterfly Click Test",
    shareUrl: "https://geometrydashspam.cc/butterfly-click",
    shareName: "Geometry Dash Butterfly Click Test",
    accentText: "text-pink-400",
    timerText: "text-pink-400",
    soundOn: "bg-pink-600/20 border-pink-500/50 text-pink-400 hover:bg-pink-600/30",
    clickArea: "bg-gradient-to-br from-pink-600 to-purple-800 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:shadow-[0_0_60px_rgba(236,72,153,0.5)] cursor-pointer",
    activeCount: "",
    withTopMargin: true,
  },
  rightClick: {
    bestKey: "rightClickBest",
    soundKey: "rightClickSoundEnabled",
    tone: "rightClick",
    idleTitle: "RIGHT CLICK HERE",
    activeLabel: "RMB Clicks",
    speedLabel: "Right Click Speed",
    shareTitle: "Right Click Test",
    shareUrl: "https://geometrydashspam.cc/right-click",
    shareName: "Geometry Dash Right Click Test",
    accentText: "text-emerald-400",
    timerText: "text-emerald-400",
    soundOn: "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/30",
    clickArea: "bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] cursor-context-menu",
    activeCount: "",
    withTopMargin: false,
  },
};

export default function SecondaryClickTest({ variant }: { variant: SecondaryClickVariant }) {
  const config = CONFIG[variant];
  const isRightClick = variant === "rightClick";

  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [bestCps, commitBestCps] = usePersistentBestNumber(config.bestKey);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const clicksRef = useRef(0);
  const startTimeRef = useRef(0);
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  useEffect(() => {
    setSoundEnabled(localStorage.getItem(config.soundKey) === "true");
  }, [config.soundKey]);



  const { ensure: ensureClickSound, play: playClickSound, suspend: suspendClickSound } = useLazyClickSound();

  const toggleSound = (event: React.MouseEvent) => {
    event.stopPropagation();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem(config.soundKey, String(next));

    if (next) {
      void ensureClickSound();
    } else {
      void suspendClickSound();
    }
  };

  const finishTest = useCallback(() => {
    const finalClicks = clicksRef.current;
    const finalCps = finalClicks / 10;

    setTimeLeft(0);
    setClicks(finalClicks);
    setFinished(true);
    setActive(false);
    commitBestCps(finalCps);
  }, [commitBestCps]);

  const startTest = () => {
    const now = performance.now();
    setActive(true);
    setFinished(false);
    clicksRef.current = 1;
    startTimeRef.current = now;
    setClicks(1);
    setTimeLeft(10);
  };

  const registerInput = () => {
    if (finished) return;
    if (active && performance.now() - startTimeRef.current >= 10000) return;

    if (soundEnabled) playClickSound(config.tone);

    if (!active) {
      startTest();
      return;
    }

    clicksRef.current += 1;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (isRightClick) return;

    if (!active && event.pointerType === "touch") {
      pendingTouchRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }

    event.preventDefault();
    registerInput();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (isRightClick) return;

    const pending = pendingTouchRef.current;
    if (!pending || pending.pointerId !== event.pointerId) return;

    pendingTouchRef.current = null;
    const moved = Math.hypot(event.clientX - pending.x, event.clientY - pending.y);
    if (moved > 12 || active || finished) return;
    registerInput();
  };

  const handlePointerCancel = () => {
    pendingTouchRef.current = null;
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isRightClick) return;
    event.preventDefault();
    registerInput();
  };

  const cancelCountdown = useExactCountdown({
    running: active && !finished,
    durationMs: 10000,
    startTimeRef,
    onTick: (remainingMs) => setTimeLeft(remainingMs / 1000),
    onFinish: finishTest,
  });

  const reset = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    cancelCountdown();
    setActive(false);
    setFinished(false);
    clicksRef.current = 0;
    startTimeRef.current = 0;
    setClicks(0);
    setTimeLeft(10);
    pendingTouchRef.current = null;
  };

  const renderedClicks = active ? clicksRef.current : clicks;
  const cps = finished
    ? (clicks / 10).toFixed(2)
    : active
      ? (clicksRef.current / Math.max(0.05, 10 - timeLeft)).toFixed(1)
      : "0.00";

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {finished
          ? `Test complete. ${cps} ${isRightClick ? "right clicks" : "clicks"} per second over 10 seconds.`
          : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
        <div className="relative aspect-square md:aspect-auto md:h-[400px]">
          <button
            type="button"
            onPointerDown={isRightClick ? undefined : handlePointerDown}
            onPointerUp={isRightClick ? undefined : handlePointerUp}
            onPointerCancel={isRightClick ? undefined : handlePointerCancel}
            onContextMenu={isRightClick ? handleContextMenu : undefined}
            className={`w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-100 active:scale-[0.99] select-none ${isRightClick ? "touch-pan-y" : active ? "touch-none" : "touch-pan-y"} ${finished ? "bg-slate-900 border-slate-700 cursor-default opacity-50" : config.clickArea}`}
          >
            {!active && !finished && <IdleVisual variant={variant} title={config.idleTitle} />}

            {active && (
              <>
                <span className={`text-8xl font-display font-black text-white drop-shadow-lg scale-110 transition-transform ${config.activeCount}`}>
                  {renderedClicks}
                </span>
                <span className={`${config.accentText} mt-4 font-mono uppercase tracking-widest`}>
                  {config.activeLabel}
                </span>
              </>
            )}

            {finished && (
              <span className="text-2xl font-display font-bold text-slate-400">TEST COMPLETE</span>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-slate-900/50 backdrop-blur border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-slate-800 ${config.timerText}`}>
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Time Remaining</h3>
                <p className="text-3xl font-mono font-bold text-white tabular-nums">{timeLeft.toFixed(2)}s</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Mute click sound" : "Enable click sound"}
              aria-pressed={soundEnabled}
              className={`p-3 rounded-xl border transition-colors ${soundEnabled ? config.soundOn : "bg-slate-800 border-white/10 text-slate-500 hover:text-slate-300"}`}
              title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex-grow bg-slate-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">{config.speedLabel}</h3>
            <div className="text-7xl font-display font-black text-white mb-2 text-glow relative z-10">
              {active || finished ? cps : "0.00"}
            </div>
            <div className={`text-xl ${config.accentText} font-mono relative z-10 mb-6`}>CPS</div>

            {bestCps && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 mb-6">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Personal Best: <strong className="text-white">{bestCps.toFixed(2)} CPS</strong>
              </div>
            )}

            {finished && (
              <SecondaryClickFinishedActions
                variant={variant}
                onReset={reset}
                shareTitle={config.shareTitle}
                shareText={`I got ${cps} CPS on the ${config.shareName}! Can you beat me?`}
                shareUrl={config.shareUrl}
                withTopMargin={config.withTopMargin}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IdleVisual({ variant, title }: { variant: SecondaryClickVariant; title: string }) {
  if (variant === "jitter") {
    return (
      <>
        <Zap className="w-16 h-16 text-white mb-4 animate-pulse" />
        <span className="text-3xl font-display font-bold text-white tracking-widest">{title}</span>
        <span className="text-orange-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
      </>
    );
  }

  if (variant === "butterfly") {
    return (
      <>
        <div className="flex gap-2 mb-4">
          <MousePointer2 className="w-12 h-12 text-white animate-bounce" />
          <MousePointer2 className="w-12 h-12 text-pink-200 animate-bounce [animation-delay:100ms]" />
        </div>
        <span className="text-3xl font-display font-bold text-white tracking-widest">{title}</span>
        <span className="text-pink-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
      </>
    );
  }

  return (
    <>
      <div className="relative mb-4">
        <Mouse className="w-16 h-16 text-white" />
        <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-400 rounded-full animate-ping opacity-75" />
      </div>
      <span className="text-3xl font-display font-bold text-white tracking-widest">{title}</span>
      <span className="text-emerald-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
    </>
  );
}
