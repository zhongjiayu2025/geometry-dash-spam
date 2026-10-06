
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MousePointer2, RotateCcw, Timer, Zap, Trophy, Volume2, VolumeX, Share2, Check } from 'lucide-react';


const playClickSound = (audioCtx: AudioContext | null) => {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(900, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05);
};

const JitterClickTest: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10.00);
  const [bestCps, setBestCps] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const endTimerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const clicksRef = useRef(0);
  const startTimeRef = useRef(0);
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSoundEnabled(localStorage.getItem('jitterClickSoundEnabled') === 'true');
      const saved = localStorage.getItem('jitterClickBest');
      if (saved) {
        try { setBestCps(parseFloat(saved)); } catch(e) {}
      }
    }

    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        void audioCtxRef.current.close();
      }
    };
  }, []);

  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }

    if (audioCtxRef.current?.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('jitterClickSoundEnabled', String(next));

    if (next) {
      ensureAudio();
    } else if (audioCtxRef.current?.state === 'running') {
      void audioCtxRef.current.suspend();
    }
  };

  const finishTest = useCallback(() => {
    const finalClicks = clicksRef.current;
    const finalCps = finalClicks / 10;

    setTimeLeft(0);
    setClicks(finalClicks);
    setFinished(true);
    setActive(false);
    setBestCps(prev => {
      if (prev === null || finalCps > prev) {
        localStorage.setItem('jitterClickBest', finalCps.toString());
        return finalCps;
      }
      return prev;
    });
  }, []);

  const startTest = () => {
    const now = performance.now();
    setActive(true);
    setFinished(false);
    clicksRef.current = 1;
    startTimeRef.current = now;
    setClicks(1);
    setTimeLeft(10.00);
  };

  const registerInput = () => {
      if (finished) return;
      if (active && performance.now() - startTimeRef.current >= 10000) return;
  
      if (soundEnabled) {
        const audio = ensureAudio();
        if (audio) playClickSound(audio);
      }
      if (!active) {
        startTest();
        return;
      }
      clicksRef.current += 1;
      setClicks(clicksRef.current);
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
    registerInput();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const pending = pendingTouchRef.current;
    if (!pending || pending.pointerId !== e.pointerId) return;

    pendingTouchRef.current = null;
    const moved = Math.hypot(e.clientX - pending.x, e.clientY - pending.y);
    if (moved > 12 || active || finished) return;

    registerInput();
  };

  const handlePointerCancel = () => {
    pendingTouchRef.current = null;
  };

  const reset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActive(false);
    setFinished(false);
    clicksRef.current = 0;
    startTimeRef.current = 0;
    setClicks(0);
    setTimeLeft(10.00);
    if (timerRef.current) clearInterval(timerRef.current);
    if (endTimerRef.current) clearTimeout(endTimerRef.current);
  };

  useEffect(() => {
    if (active && !finished) {
      const updateTimer = () => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        setTimeLeft(Math.max(0, 10 - elapsed));
      };

      updateTimer();
      timerRef.current = window.setInterval(updateTimer, 100);

      const elapsedMs = performance.now() - startTimeRef.current;
      endTimerRef.current = window.setTimeout(
        finishTest,
        Math.max(0, 10000 - elapsedMs)
      );
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, [active, finished, finishTest]);

  const cps = finished ? (clicks / 10).toFixed(2) : (active ? (clicks / Math.max(0.05, 10 - timeLeft)).toFixed(1) : "0.00");

  const shareScore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `I got ${cps} CPS on the Geometry Dash Jitter Click Test! Can you beat me?`;
    const url = `https://geometrydashspam.cc/jitter-click`;
    if (typeof navigator !== 'undefined' && navigator.share) {
        try {
            await navigator.share({ title: 'Jitter Click Test', text, url });
        } catch(e) { console.log(e); }
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {finished ? `Test complete. ${cps} clicks per second over 10 seconds.` : ""}
      </p>
<div className="text-center mb-8">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-mono text-orange-400 mb-4">
            <Zap className="w-3 h-3" /> CLICKING TECHNIQUE
         </div>
         <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 drop-shadow-2xl uppercase">
            Jitter Click Test
         </h1>
         <p className="text-slate-400 max-w-2xl mx-auto">
            Practice jitter clicking and compare a repeatable 10-second browser-registered CPS result.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
        {/* Click Area */}
        <div className="relative aspect-square md:aspect-auto md:h-[400px]">
          <button
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className={`
              w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-100 active:scale-[0.99] select-none ${active ? 'touch-none' : 'touch-pan-y'}
              ${finished 
                ? 'bg-slate-900 border-slate-700 cursor-default opacity-50' 
                : 'bg-gradient-to-br from-orange-600 to-red-800 border-orange-500 shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:shadow-[0_0_60px_rgba(234,88,12,0.5)] cursor-pointer'
              }
            `}
          >
            {!active && !finished && (
              <>
                <Zap className="w-16 h-16 text-white mb-4 animate-pulse" />
                <span className="text-3xl font-display font-bold text-white tracking-widest">START JITTERING</span>
                <span className="text-orange-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
              </>
            )}
            
            {active && (
              <>
                <span className="text-8xl font-display font-black text-white drop-shadow-lg scale-110 transition-transform shake-constant shake-little">{clicks}</span>
                <span className="text-orange-200 mt-4 font-mono uppercase tracking-widest">Clicks</span>
              </>
            )}

            {finished && (
               <span className="text-2xl font-display font-bold text-slate-400">TEST COMPLETE</span>
            )}
          </button>
        </div>

        {/* Stats Panel */}
        <div className="flex flex-col gap-4">
           {/* Timer */}
           <div className="bg-slate-900/50 backdrop-blur border border-white/10 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-3 rounded-lg bg-slate-800 text-orange-400">
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
                  className={`p-3 rounded-xl border transition-colors ${soundEnabled ? 'bg-orange-600/20 border-orange-500/50 text-orange-400 hover:bg-orange-600/30' : 'bg-slate-800 border-white/10 text-slate-500 hover:text-slate-300'}`}
                  title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
                 >
                   {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                 </button>
              </div>
           </div>

           {/* Result Main */}
           <div className="flex-grow bg-slate-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-orange-600/5 group-hover:bg-orange-600/10 transition-colors"></div>
               <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">Your Jitter Speed</h3>
               <div className="text-7xl font-display font-black text-white mb-2 text-glow relative z-10">{finished ? cps : (active ? cps : '0.00')}</div>
               <div className="text-xl text-orange-400 font-mono relative z-10 mb-6">CPS</div>
               
               {bestCps && (
                 <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 mb-6">
                   <Trophy className="w-4 h-4 text-yellow-500" />
                   Personal Best: <strong className="text-white">{bestCps.toFixed(2)} CPS</strong>
                 </div>
               )}
               
               {finished && (
                 <div className="animate-in fade-in zoom-in duration-300 relative z-10 flex gap-2">
                   <button 
                    onClick={reset}
                    className="px-8 py-3 bg-white text-orange-900 font-bold rounded-lg flex items-center gap-2 hover:bg-orange-50 transition-colors shadow-lg"
                   >
                     <RotateCcw className="w-5 h-5" /> TRY AGAIN
                   </button>
                   <button
                    onClick={shareScore}
                    className="p-3 bg-slate-800 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors border border-white/10"
                    title="Share your score"
                   >
                     {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                   </button>
                 </div>
               )}
           </div>
        </div>
      </div>

    </div>
  );
};

export default JitterClickTest;
