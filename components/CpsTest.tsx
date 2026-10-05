
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, RotateCcw, Timer, Check, Clock, Trophy, Share2, BookOpen, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import dynamic from "next/dynamic";

const RelatedTools = dynamic(() => import('./RelatedTools'), { ssr: true });
const Breadcrumbs = dynamic(() => import('./Breadcrumbs'), { ssr: true });


interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

interface CpsRun {
  duration: number;
  clicks: number;
  cps: number;
  timestamp: number;
}

const playClickSound = (audioCtx: AudioContext | null) => {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05);
};

const CpsTest: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clicks, setClicks] = useState(0);
  
  // SEO Optimization: Configurable durations for long-tail keywords (e.g., "1 second cps test")
  const [selectedDuration, setSelectedDuration] = useState(10); 
  const [timeLeft, setTimeLeft] = useState(10.00);
  
  const [ripples, setRipples] = useState<ClickEffect[]>([]);
  const [copied, setCopied] = useState(false);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [runHistory, setRunHistory] = useState<CpsRun[]>([]);
  
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const clicksRef = useRef(0);
  const testStartRef = useRef(0);
  const clickTimesRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
      }
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

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    
    if (soundEnabled && audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        playClickSound(audioCtxRef.current);
    }
    
    // Add Visual Ripple
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 500);

    if (finished) return;
    if (!active) {
      startTest();
      return;
    }
    clicksRef.current += 1;
    clickTimesRef.current.push(performance.now());
    setClicks(clicksRef.current);
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

  useEffect(() => {
    if (active && !finished) {
      timerRef.current = window.setInterval(() => {
        const elapsed = (performance.now() - testStartRef.current) / 1000;
        const remaining = Math.max(0, selectedDuration - elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          setFinished(true);
          setActive(false);
          if (timerRef.current) clearInterval(timerRef.current);

          const finalClicks = clicksRef.current;
          const finalCps = finalClicks / selectedDuration;
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
        }
      }, 33);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, finished, selectedDuration]);

  const cps = finished
    ? (clicks / selectedDuration).toFixed(2)
    : active
    ? (clicks / Math.max(0.05, selectedDuration - timeLeft)).toFixed(1)
    : "0.00";
  const cpsNum = parseFloat(cps);

  const getTimingStats = () => {
    const times = clickTimesRef.current;
    if (times.length < 2) {
      return { averageInterval: 0, peakCps: 0, consistency: 100 };
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

  const timingStats = getTimingStats();

  const getRank = (score: number) => {
    if (score < 5) return { label: "Baseline", color: "text-slate-300" };
    if (score < 7) return { label: "Steady", color: "text-green-400" };
    if (score < 9) return { label: "Fast", color: "text-blue-400" };
    if (score < 12) return { label: "Very Fast", color: "text-cyan-300" };
    if (score < 15) return { label: "Rapid", color: "text-purple-400" };
    return { label: "Extreme Burst", color: "text-pink-400" };
  };

  const rank = finished ? getRank(cpsNum) : null;
  const currentBest = bestScores[selectedDuration];
  const recentRuns = runHistory
    .filter((run) => run.duration === selectedDuration)
    .slice(0, 5);
  const recentAverage = recentRuns.length
    ? recentRuns.reduce((sum, run) => sum + run.cps, 0) / recentRuns.length
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <Breadcrumbs items={[{ label: 'CPS Test', href: '/cps-test', active: true }]} />

      {/* Time Selector - Critical for SEO (1s CPS Test, 5s CPS Test keywords) */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[1, 3, 5, 10, 30, 60].map(sec => (
              <button
                key={sec}
                onClick={() => handleDurationChange(sec)}
                disabled={active}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-bold border transition-all
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16">
        {/* Click Area */}
        <div className="relative aspect-square md:aspect-auto md:h-[400px]">
          <button
            onPointerDown={handlePointerDown}
            aria-label="Click here to start or continue the CPS test"
            className={`
              w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-75 select-none relative overflow-hidden touch-none
              ${finished 
                ? 'bg-slate-900 border-slate-700 cursor-default opacity-50' 
                : 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400 shadow-[0_0_40px_rgba(37,99,235,0.3)] active:scale-[0.98] active:bg-blue-700 cursor-pointer'
              }
            `}
          >
            {ripples.map(r => (
               <span 
                 key={r.id}
                 className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
                 style={{ left: r.x, top: r.y, width: '20px', height: '20px', transform: 'translate(-50%, -50%)' }}
               />
            ))}

            {!active && !finished && (
              <>
                <MousePointer2 className="w-16 h-16 text-white mb-4 animate-bounce" />
                <span className="text-3xl font-display font-bold text-white tracking-widest">CLICK TO START</span>
                <span className="text-blue-200 mt-2 font-mono text-sm">{selectedDuration} SECOND TEST</span>
              </>
            )}
            
            {active && (
              <>
                <span className="text-8xl font-display font-black text-white drop-shadow-lg scale-110 transition-transform">{clicks}</span>
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
           <div className="bg-slate-900/50 backdrop-blur border border-white/10 p-6 rounded-2xl flex items-center justify-between">
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
                  onClick={() => setSoundEnabled(!soundEnabled)}
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
           <div className="flex-grow bg-slate-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
               
               <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">Your Speed</h3>
               <div className="text-7xl font-display font-black text-white mb-2 text-glow relative z-10">{finished ? cps : (active ? cps : '0.00')}</div>
               <div className="text-xl text-blue-400 font-mono relative z-10 mb-6">CPS</div>
               
               {currentBest && (
                 <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 mb-6">
                   <Trophy className="w-4 h-4 text-yellow-500" />
                   Personal Best ({selectedDuration}s): <strong className="text-white">{currentBest.toFixed(2)} CPS</strong>
                 </div>
               )}
               
               {finished && rank && (
                 <div className="animate-in zoom-in duration-300 mb-5 relative z-10">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Speed Band</div>
                    <div className={`text-3xl font-display font-black ${rank.color} drop-shadow-md flex items-center justify-center gap-2`}>
                        <Trophy className="w-6 h-6" /> {rank.label}
                    </div>
                 </div>
               )}

               {finished && (
                 <div className="grid grid-cols-3 gap-2 w-full mb-6 relative z-10">
                   <div className="bg-black/25 rounded-lg p-3">
                     <div className="text-[10px] uppercase tracking-wider text-slate-500">Peak 1s CPS</div>
                     <div className="font-mono font-bold text-white">{timingStats.peakCps.toFixed(2)}</div>
                   </div>
                   <div className="bg-black/25 rounded-lg p-3">
                     <div className="text-[10px] uppercase tracking-wider text-slate-500">Consistency</div>
                     <div className="font-mono font-bold text-white">{timingStats.consistency.toFixed(0)}%</div>
                   </div>
                   <div className="bg-black/25 rounded-lg p-3">
                     <div className="text-[10px] uppercase tracking-wider text-slate-500">Avg Interval</div>
                     <div className="font-mono font-bold text-white">{timingStats.averageInterval.toFixed(0)}ms</div>
                   </div>
                 </div>
               )}

               {finished && (
                 <div className="animate-in fade-in duration-300 relative z-10 flex gap-3">
                   <button 
                    onClick={reset}
                    className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
                   >
                     <RotateCcw className="w-5 h-5" /> TRY AGAIN
                   </button>
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

      {/* Featured Snippet Target: Mathematical Definition */}
      <section className="mb-12 bg-blue-900/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4">How is CPS Calculated?</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="bg-black/30 p-6 rounded-xl border border-white/5 font-mono text-slate-300 text-sm">
                  <p className="mb-2"><span className="text-blue-400">CPS</span> = <span className="text-green-400">Total Clicks</span> / <span className="text-yellow-400">Time (seconds)</span></p>
                  <p className="text-xs text-slate-500 mt-2">// Example:<br/>If you click 60 times in 5 seconds,<br/>60 / 5 = 12 CPS.</p>
              </div>
              <div className="text-slate-300 leading-relaxed">
                  <p className="mb-2">
                      <strong>CPS</strong> stands for <em>Clicks Per Second</em>. It is a metric used to measure the speed at which a person can press a mouse button or keyboard key.
                  </p>
                  <p>
                      For <strong className="text-white">Geometry Dash</strong> practice, average CPS and click timing answer different questions. Use short modes for bursts and longer 30s or 60s modes to compare whether your pace stays repeatable.
                  </p>
              </div>
          </div>
      </section>

      {/* INTERNAL LINKING: Contextual Guide Recommendation */}
      <Link 
        href="/blog/how-to-improve-cps-geometry-dash"
        className="block mb-12 group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/40 to-slate-900/40 p-8 transition-all hover:border-blue-400/50"
      >
         <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-500/10 blur-[50px] transition-all group-hover:bg-blue-500/20"></div>
         <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                    <BookOpen className="h-4 w-4" /> Recommended Guide
                </div>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-blue-200">
                    Improve CPS Without Losing Click Consistency
                </h3>
                <p className="max-w-xl text-slate-400">
                    Compare normal, jitter and butterfly clicking with repeatable test durations, then train the method that stays most consistent for you.
                </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/50 transition-transform group-hover:translate-x-2 group-hover:scale-110">
                <ArrowRight className="h-6 w-6" />
            </div>
         </div>
      </Link>

      {/* Cross-Link / Internal Navigation */}
      <RelatedTools currentTool="cps" />
    </div>
  );
};

export default CpsTest;
