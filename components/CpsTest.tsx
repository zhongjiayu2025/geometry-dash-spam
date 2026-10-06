
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MousePointer2, RotateCcw, Timer, Check, Clock, Trophy, Share2, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import type { ClickSoundEngine } from '../lib/clickSound';

interface CpsRun {
  duration: number;
  clicks: number;
  cps: number;
  timestamp: number;
}

const CpsTest: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clicks, setClicks] = useState(0);
  
  // SEO Optimization: Configurable durations for long-tail keywords (e.g., "1 second cps test")
  const [selectedDuration, setSelectedDuration] = useState(10); 
  const [timeLeft, setTimeLeft] = useState(10.00);
  
  const [copied, setCopied] = useState(false);
  
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [runHistory, setRunHistory] = useState<CpsRun[]>([]);
  
  const timerRef = useRef<number | null>(null);
  const endTimerRef = useRef<number | null>(null);
  const audioEngineRef = useRef<ClickSoundEngine | null>(null);
  const audioLoadRef = useRef<Promise<ClickSoundEngine | null> | null>(null);
  const audioDisposedRef = useRef(false);
  const clicksRef = useRef(0);
  const testStartRef = useRef(0);
  const clickTimesRef = useRef<number[]>([]);
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSoundEnabled(localStorage.getItem('cpsSoundEnabled') === 'true');

      const saved = localStorage.getItem('cpsBestScores');
      if (saved) {
        try {
          setBestScores(JSON.parse(saved));
        } catch(e) {}
      }

      const savedHistory = localStorage.getItem('cpsRunHistory');
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed)) setRunHistory(parsed.slice(0, 20));
        } catch(e) {}
      }
    }

  }, []);

  useEffect(() => {
    return () => {
      audioDisposedRef.current = true;
      const engine = audioEngineRef.current;
      audioEngineRef.current = null;
      if (engine) void engine.destroy();
    };
  }, []);

  const startTest = () => {
    const now = performance.now();
    setActive(true);
    setFinished(false);
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
    if (now - testStartRef.current >= selectedDuration * 1000) return;

    clicksRef.current += 1;
    clickTimesRef.current.push(now);
    setClicks(clicksRef.current);
  };

  const ensureAudio = useCallback(async () => {
    if (audioDisposedRef.current) return null;

    if (audioEngineRef.current) {
      await audioEngineRef.current.resume();
      return audioEngineRef.current;
    }

    if (!audioLoadRef.current) {
      audioLoadRef.current = import('../lib/clickSound')
        .then(({ createClickSoundEngine }) => createClickSoundEngine())
        .catch(() => null);
    }

    const engine = await audioLoadRef.current;
    if (!engine) return null;

    if (audioDisposedRef.current) {
      await engine.destroy();
      return null;
    }

    audioEngineRef.current = engine;
    await engine.resume();
    return engine;
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('cpsSoundEnabled', String(next));

    if (next) {
      void ensureAudio();
    } else if (audioEngineRef.current) {
      void audioEngineRef.current.suspend();
    }
  };

  const playInputSound = () => {
    if (!soundEnabled) return;

    const engine = audioEngineRef.current;
    if (engine) {
      engine.play('cps');
    } else {
      void ensureAudio().then((loadedEngine) => loadedEngine?.play('cps'));
    }
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

  const reset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActive(false);
    setFinished(false);
    clicksRef.current = 0;
    clickTimesRef.current = [];
    testStartRef.current = 0;
    setClicks(0);
    setTimeLeft(selectedDuration);
    setCopied(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (endTimerRef.current) clearTimeout(endTimerRef.current);
  };

  const shareScore = async (e: React.MouseEvent) => {
     e.stopPropagation();
     const score = (clicks / selectedDuration).toFixed(2);
     const text = `I got ${score} CPS in the ${selectedDuration}s Geometry Dash CPS Test.`;
     const url = 'https://geometrydashspam.cc/cps-test';

     if (typeof navigator !== 'undefined' && navigator.share) {
        try {
            await navigator.share({ title: 'CPS Test Result', text: text, url: url });
            return;
        } catch (err) { console.error(err); }
     }
     
     navigator.clipboard.writeText(`${text} ${url}`);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const finishTest = useCallback(() => {
    const finalClicks = clicksRef.current;
    const finalCps = finalClicks / selectedDuration;

    setTimeLeft(0);
    setFinished(true);
    setActive(false);
    setClicks(finalClicks);

    setRunHistory(prev => {
      const nextRun: CpsRun = {
        duration: selectedDuration,
        clicks: finalClicks,
        cps: Number(finalCps.toFixed(2)),
        timestamp: Date.now(),
      };
      const next = [nextRun, ...prev].slice(0, 20);
      localStorage.setItem('cpsRunHistory', JSON.stringify(next));
      return next;
    });

    setBestScores(prev => {
      const newBests = { ...prev };
      if (!newBests[selectedDuration] || finalCps > newBests[selectedDuration]) {
        newBests[selectedDuration] = finalCps;
        localStorage.setItem('cpsBestScores', JSON.stringify(newBests));
      }
      return newBests;
    });
  }, [selectedDuration]);

  useEffect(() => {
    if (active && !finished) {
      const updateTimer = () => {
        const elapsed = (performance.now() - testStartRef.current) / 1000;
        setTimeLeft(Math.max(0, selectedDuration - elapsed));
      };

      updateTimer();
      timerRef.current = window.setInterval(updateTimer, 100);

      const elapsedMs = performance.now() - testStartRef.current;
      endTimerRef.current = window.setTimeout(
        finishTest,
        Math.max(0, selectedDuration * 1000 - elapsedMs)
      );
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, [active, finished, selectedDuration, finishTest]);

  const cps = finished
    ? (clicks / selectedDuration).toFixed(2)
    : active
    ? (clicks / Math.max(0.05, selectedDuration - timeLeft)).toFixed(1)
    : "0.00";

  const getTimingStats = () => {
    const times = clickTimesRef.current;
    if (times.length < 2) {
      return {
        averageInterval: null as number | null,
        peakCps: times.length,
        consistency: null as number | null,
      };
    }

    const intervals = times.slice(1).map((time, index) => time - times[index]);
    const mean = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
    const variance = intervals.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = mean > 0 ? stdDev / mean : 0;

    let left = 0;
    let peakCps = 0;
    for (let right = 0; right < times.length; right++) {
      while (times[right] - times[left] > 1000) left++;
      peakCps = Math.max(peakCps, right - left + 1);
    }

    return {
      averageInterval: mean,
      peakCps,
      consistency: Math.max(0, Math.min(100, 100 - coefficient * 100)),
    };
  };

  const timingStats = finished
    ? getTimingStats()
    : {
        averageInterval: null as number | null,
        peakCps: 0,
        consistency: null as number | null,
      };

  const currentBest = bestScores[selectedDuration];
  const recentRuns = runHistory
    .filter((run) => run.duration === selectedDuration)
    .slice(0, 5);
  const recentAverage = recentRuns.length
    ? recentRuns.reduce((sum, run) => sum + run.cps, 0) / recentRuns.length
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {finished ? `Test complete. ${cps} clicks per second over ${selectedDuration} seconds.` : ""}
      </p>
      {/* Time Selector - Critical for SEO (1s CPS Test, 5s CPS Test keywords) */}
      <div className="flex flex-nowrap justify-start sm:justify-center gap-2 mb-5 sm:mb-8 overflow-x-auto overscroll-x-contain pb-1">
          {[1, 3, 5, 10, 30, 60].map(sec => (
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
                <span className="text-6xl sm:text-8xl font-display font-black text-white drop-shadow-lg scale-110 transition-transform">{clicks}</span>
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
           <div className="bg-slate-900/50 backdrop-blur border border-white/10 p-4 sm:p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-3 rounded-lg bg-slate-800 text-blue-400">
                    <Timer className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Time Remaining</h3>
                    <p className="text-3xl font-mono font-bold text-white tabular-nums">{timeLeft.toFixed(2)}s</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button 
                  onClick={toggleSound}
                  aria-label={soundEnabled ? "Mute click sound" : "Enable click sound"}
                  aria-pressed={soundEnabled}
                  className={`p-3 rounded-xl border transition-colors ${soundEnabled ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30' : 'bg-slate-800 border-white/10 text-slate-500 hover:text-slate-300'}`}
                  title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
                 >
                   {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                 </button>
                 <div className="h-12 w-12 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                    <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
                       <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-600" strokeDasharray={113} strokeDashoffset={113 * (1 - timeLeft/selectedDuration)} />
                    </svg>
                 </div>
              </div>
           </div>

           {/* Result Main */}
           <div className="flex-grow bg-slate-900/50 backdrop-blur border border-white/10 p-5 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
               
               <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">Your Speed</h3>
               <div className="text-5xl sm:text-7xl font-display font-black text-white mb-2 text-glow relative z-10">{finished ? cps : (active ? cps : '0.00')}</div>
               <div className="text-xl text-blue-400 font-mono relative z-10 mb-6">CPS</div>
               
               {currentBest && (
                 <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 mb-6">
                   <Trophy className="w-4 h-4 text-yellow-500" />
                   Personal Best ({selectedDuration}s): <strong className="text-white">{currentBest.toFixed(2)} CPS</strong>
                 </div>
               )}

               {finished && (
                 <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full mb-5 sm:mb-6 relative z-10">
                   <div className="bg-black/25 rounded-lg p-2 sm:p-3">
                     <div className="text-[10px] uppercase tracking-wider text-slate-500">Peak 1s CPS</div>
                     <div className="font-mono font-bold text-white">{timingStats.peakCps.toFixed(2)}</div>
                   </div>
                   <div className="bg-black/25 rounded-lg p-2 sm:p-3">
                     <div className="text-[10px] uppercase tracking-wider text-slate-500">Consistency</div>
                     <div className="font-mono font-bold text-white">
                       {timingStats.consistency === null ? 'N/A' : `${timingStats.consistency.toFixed(0)}%`}
                     </div>
                   </div>
                   <div className="bg-black/25 rounded-lg p-2 sm:p-3">
                     <div className="text-[10px] uppercase tracking-wider text-slate-500">Avg Interval</div>
                     <div className="font-mono font-bold text-white">
                       {timingStats.averageInterval === null ? 'N/A' : `${timingStats.averageInterval.toFixed(0)}ms`}
                     </div>
                   </div>
                 </div>
               )}

               {finished && (
                 <p className="mb-5 max-w-md text-xs leading-5 text-slate-500 relative z-10">
                   Consistency is a site-defined browser diagnostic based on variation between registered click intervals.
                   It is not an official Geometry Dash metric or a laboratory hardware measurement.
                 </p>
               )}

               {finished && (
                 <div className="animate-in fade-in duration-300 relative z-10 flex flex-wrap justify-center gap-2 sm:gap-3">
                   <button 
                    onClick={reset}
                    className="px-4 py-2.5 sm:px-6 sm:py-3 bg-white text-blue-900 font-bold rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
                   >
                     <RotateCcw className="w-5 h-5" /> TRY AGAIN
                   </button>
                   <Link
                    href="/geometry-dash-wave"
                    className="px-4 py-2.5 sm:px-5 sm:py-3 bg-slate-800 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors border border-white/10"
                   >
                     Train Wave Control <ArrowRight className="w-4 h-4" />
                   </Link>
                   <button 
                    onClick={shareScore}
                    aria-label="Share Score"
                    className={`px-4 py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-colors shadow-lg ${copied ? 'bg-green-500' : ''}`}
                   >
                     {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                   </button>
                 </div>
               )}
           </div>
        </div>
      </div>

      <section className="mb-12 rounded-2xl border border-white/10 bg-slate-900/30 p-6 md:p-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Local training history</p>
            <h2 className="text-2xl font-display font-bold text-white">Recent {selectedDuration}s CPS runs</h2>
          </div>
          {recentRuns.length > 0 && (
            <div className="text-sm text-slate-400">
              Last {recentRuns.length} average: <strong className="text-white">{recentAverage.toFixed(2)} CPS</strong>
            </div>
          )}
        </div>

        {recentRuns.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {recentRuns.map((run, index) => (
              <div key={`${run.timestamp}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-slate-500">Run {index + 1}</div>
                <div className="mt-1 font-mono text-2xl font-bold text-white">{run.cps.toFixed(2)}</div>
                <div className="text-xs font-semibold text-blue-400">CPS</div>
                <div className="mt-2 text-xs text-slate-500">{run.clicks} clicks</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-400">
            Complete a {selectedDuration}-second test to start a private browser-only history. Your recent runs stay on this device and are not uploaded.
          </p>
        )}
      </section>

    </div>
  );
};

export default CpsTest;
