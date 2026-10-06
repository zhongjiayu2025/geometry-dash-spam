
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MousePointer2, Clock } from 'lucide-react';
import { ClickTestSpeedPanel, ClickTestTimerCard } from './ClickTestPanels';
import { useLazyClickSound } from '../lib/useLazyClickSound';
import { useExactCountdown } from '../lib/useExactCountdown';
import { readStorage, writeStorage } from '../lib/browserStorage';
import { useCpsRecords } from '../lib/useCpsRecords';
import { CPS_DURATIONS } from '../data/cpsDurations';

const CpsRunHistory = dynamic(() => import('./CpsRunHistory'), { ssr: false });
const CpsFinishedActions = dynamic(() => import('./CpsFinishedActions'), { ssr: false });

const CpsTest: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clicks, setClicks] = useState(0);
  
  // SEO Optimization: Configurable durations for long-tail keywords (e.g., "1 second cps test")
  const [selectedDuration, setSelectedDuration] = useState(10); 
  const [timeLeft, setTimeLeft] = useState(10.00);
  
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { bestScores, runHistory, persistRun } = useCpsRecords();
  
  const clicksRef = useRef(0);
  const finishedRef = useRef(false);
  const testStartRef = useRef(0);
  const clickTimesRef = useRef<number[]>([]);
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  useEffect(() => {
    setSoundEnabled(readStorage('cpsSoundEnabled') === 'true');
  }, []);


  const startTest = () => {
    const now = performance.now();
    setActive(true);
    setFinished(false);
    finishedRef.current = false;
    clicksRef.current = 1;
    clickTimesRef.current = [now];
    testStartRef.current = now;
    setClicks(1);
    setTimeLeft(selectedDuration);
  };

  const handleDurationChange = (duration: number) => {
      if (active) return; // Prevent changing during test
      setSelectedDuration(duration);
      setTimeLeft(duration);
      setFinished(false);
      setClicks(0);
  };

  const registerInput = () => {
    if (finished) return;

    if (!active) {
      startTest();
      return;
    }

    const now = performance.now();
    if (now - testStartRef.current >= selectedDuration * 1000) {
      finishTest();
      return;
    }

    clicksRef.current += 1;
    clickTimesRef.current.push(now);
  };


  const { ensure: ensureClickSound, play: playClickSound, suspend: suspendClickSound } = useLazyClickSound();

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    writeStorage('cpsSoundEnabled', String(next));

    if (next) {
      void ensureClickSound();
    } else {
      void suspendClickSound();
    }
  };

  const playInputSound = () => {
    if (!soundEnabled) return;

    playClickSound('cps');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!active && e.pointerType === 'touch') {
      pendingTouchRef.current = {
        pointerId: e.pointerId,
        x: e.clientX,
        y: e.clientY,
      };
      return;
    }

    e.preventDefault();
    playInputSound();
    registerInput();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const pending = pendingTouchRef.current;
    if (!pending || pending.pointerId !== e.pointerId) return;

    pendingTouchRef.current = null;
    const moved = Math.hypot(e.clientX - pending.x, e.clientY - pending.y);
    if (moved > 12 || active || finished) return;

    playInputSound();
    registerInput();
  };

  const handlePointerCancel = () => {
    pendingTouchRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return;
    e.preventDefault();
    playInputSound();
    registerInput();
  };

  const finishTest = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const finalClicks = clicksRef.current;
    const finalCps = finalClicks / selectedDuration;

    setTimeLeft(0);
    setFinished(true);
    setActive(false);
    setClicks(finalClicks);

    persistRun(selectedDuration, finalClicks);
  }, [persistRun, selectedDuration]);

  const cancelCountdown = useExactCountdown({
    running: active && !finished,
    durationMs: selectedDuration * 1000,
    startTimeRef: testStartRef,
    onTick: (remainingMs) => setTimeLeft(remainingMs / 1000),
    onFinish: finishTest,
  });

  const reset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    cancelCountdown();
    setActive(false);
    setFinished(false);
    finishedRef.current = false;
    clicksRef.current = 0;
    clickTimesRef.current = [];
    testStartRef.current = 0;
    setClicks(0);
    setTimeLeft(selectedDuration);
  };

  const renderedClicks = active ? clicksRef.current : clicks;
  const cps = finished
    ? (clicks / selectedDuration).toFixed(2)
    : active
    ? (clicksRef.current / Math.max(0.05, selectedDuration - timeLeft)).toFixed(1)
    : "0.00";

  const currentBest = bestScores[selectedDuration];

  return (
    <div className="w-full max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {finished ? `Test complete. ${cps} clicks per second over ${selectedDuration} seconds.` : ""}
      </p>
      {/* Time Selector - Critical for SEO (1s CPS Test, 5s CPS Test keywords) */}
      <div className="flex flex-nowrap justify-start sm:justify-center gap-2 mb-5 sm:mb-8 overflow-x-auto overscroll-x-contain pb-1">
          {CPS_DURATIONS.map(sec => (
              <button
                key={sec}
                onClick={() => handleDurationChange(sec)}
                aria-pressed={selectedDuration === sec}
                disabled={active}
                className={`
                    flex shrink-0 items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-bold border transition-all
                    ${selectedDuration === sec 
                        ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                        : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'}
                    ${active ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                  <Clock className="w-3 h-3" />
                  {sec}s
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-stretch mb-10 md:mb-16">
        {/* Click Area */}
        <div className="relative h-[300px] sm:h-[360px] md:h-[400px] md:aspect-auto">
          <button
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onKeyDown={handleKeyDown}
            disabled={finished}
            aria-label="Click or press Space or Enter to start or continue the CPS test"
            aria-keyshortcuts="Space Enter"
            className={`
              w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-75 select-none relative overflow-hidden ${active ? 'touch-none' : 'touch-pan-y'}
              ${finished 
                ? 'bg-slate-900 border-slate-700 cursor-default opacity-50' 
                : 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400 shadow-[0_0_40px_rgba(37,99,235,0.3)] active:scale-[0.98] active:bg-blue-700 cursor-pointer'
              }
            `}
          >

            {!active && !finished && (
              <>
                <MousePointer2 className="w-12 h-12 sm:w-16 sm:h-16 text-white mb-3 sm:mb-4 animate-bounce" />
                <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-widest">CLICK TO START</span>
                <span className="text-blue-200 mt-2 font-mono text-sm">OR PRESS SPACE · {selectedDuration} SECOND TEST</span>
              </>
            )}
            
            {active && (
              <>
                <span className="text-6xl sm:text-8xl font-display font-black text-white drop-shadow-lg scale-110 transition-transform">{renderedClicks}</span>
                <span className="text-blue-200 mt-4 font-mono uppercase tracking-widest">Clicks</span>
              </>
            )}

            {finished && (
               <span className="text-2xl font-display font-bold text-slate-400">TEST COMPLETE</span>
            )}
          </button>
        </div>

        {/* Stats & Rank Panel */}
        <div className="flex flex-col gap-4">
           {/* Timer & Controls */}
           <ClickTestTimerCard
             timeLeft={timeLeft}
             soundEnabled={soundEnabled}
             onToggleSound={toggleSound}
             timerAccentClass="text-blue-400"
             soundOnClass="bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30"
             progress={1 - timeLeft / selectedDuration}
           />

           {/* Result Main */}
           <ClickTestSpeedPanel
             title="Your Speed"
             value={finished ? cps : (active ? cps : "0.00")}
             accentClass="text-blue-400"
             bestCps={currentBest}
             bestLabel={`Personal Best (${selectedDuration}s)`}
             hoverAccent
           >
             {finished && (
               <CpsFinishedActions
                 clickTimes={clickTimesRef.current}
                 clicks={clicks}
                 duration={selectedDuration}
                 onReset={() => reset()}
               />
             )}
           </ClickTestSpeedPanel>
        </div>
      </div>

      {runHistory.length > 0 ? (
        <CpsRunHistory runs={runHistory} selectedDuration={selectedDuration} />
      ) : (
        <section className="mb-12 rounded-2xl border border-white/10 bg-slate-900/30 p-6 md:p-8">
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Local training history</p>
            <h2 className="text-2xl font-display font-bold text-white">Recent {selectedDuration}s CPS runs</h2>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Complete a {selectedDuration}-second test to start a private browser-only history. Your recent runs stay on this device and are not uploaded.
          </p>
        </section>
      )}

    </div>
  );
};

export default CpsTest;
