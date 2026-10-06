"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ClickTestSpeedPanel, ClickTestTimerCard } from "./ClickTestPanels";
import type { ClickTone } from "../lib/clickSound";
import { useLazyClickSound } from "../lib/useLazyClickSound";
import { useExactCountdown } from "../lib/useExactCountdown";
import { usePersistentBestNumber } from "../lib/usePersistentBestNumber";
import { readStorage, writeStorage } from "../lib/browserStorage";

const SecondaryClickFinishedActions = dynamic(
  () => import("./SecondaryClickFinishedActions"),
  { ssr: false }
);

export type SecondaryClickVariant = "jitter" | "butterfly" | "rightClick";

export interface SecondaryClickConfig {
  bestKey: string;
  soundKey: string;
  tone: ClickTone;
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

export default function SecondaryClickTest({
  variant,
  config,
  idleVisual,
}: {
  variant: SecondaryClickVariant;
  config: SecondaryClickConfig;
  idleVisual: ReactNode;
}) {
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
    setSoundEnabled(readStorage(config.soundKey) === "true");
  }, [config.soundKey]);



  const { ensure: ensureClickSound, play: playClickSound, suspend: suspendClickSound } = useLazyClickSound();

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    writeStorage(config.soundKey, String(next));

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
            {!active && !finished && idleVisual}

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
          <ClickTestTimerCard
            timeLeft={timeLeft}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            timerAccentClass={config.timerText}
            soundOnClass={config.soundOn}
          />

          <ClickTestSpeedPanel
            title={config.speedLabel}
            value={active || finished ? cps : "0.00"}
            accentClass={config.accentText}
            bestCps={bestCps}
          >
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
          </ClickTestSpeedPanel>
        </div>
      </div>
    </div>
  );
}
