"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));
import { Keyboard, RotateCcw, Zap, Trophy, Volume2, VolumeX, Share2, Check } from 'lucide-react';


const playKeySound = (audioCtx: AudioContext | null) => {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05);
};

const SpacebarCounter: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10.00);
  const [isPressed, setIsPressed] = useState(false);
  const [bestCps, setBestCps] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
      }
      const saved = localStorage.getItem('spacebarBest');
      if (saved) {
        try { setBestCps(parseFloat(saved)); } catch(e) {}
      }
    }
  }, []);

  const startTest = useCallback(() => {
    setActive(true);
    setFinished(false);
    setCount(1);
    setTimeLeft(10.00);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault(); // Prevent scrolling
      if (e.repeat) return; // Ignore holding down
      
      if (soundEnabled && audioCtxRef.current) {
          if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
          playKeySound(audioCtxRef.current);
      }

      setIsPressed(true);

      if (finished) return;
      
      if (!active) {
        startTest();
        return;
      }
      setCount(c => c + 1);
    }
  }, [active, finished, startTest, soundEnabled]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (active && !finished) {
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, 10 - elapsed);
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          setFinished(true);
          setActive(false);
          if (timerRef.current) clearInterval(timerRef.current);
          
          setCount((currentCount) => {
              setBestCps(prev => {
                  const finalCps = currentCount / 10;
                  if (prev === null || finalCps > prev) {
                      localStorage.setItem('spacebarBest', finalCps.toString());
                      return finalCps;
                  }
                  return prev;
              });
              return currentCount;
          });
        }
      }, 33);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, finished]);

  const reset = () => {
    setActive(false);
    setFinished(false);
    setCount(0);
    setTimeLeft(10.00);
  };

  const shareScore = async () => {
    const text = `I got ${(count / 10).toFixed(2)} CPS on the Geometry Dash Spacebar Counter Test! Can you beat me?`;
    const url = `https://geometrydashspam.cc/spacebar-counter`;
    if (typeof navigator !== 'undefined' && navigator.share) {
        try {
            await navigator.share({ title: 'Spacebar Counter Test', text, url });
        } catch(e) { console.log(e); }
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Display */}
      <div className="relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center overflow-hidden mb-8">
        
        <div className="relative z-10">
          <div className="mb-12">
            <h2 className="text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Spacebar Presses</h2>
            <div className="text-8xl md:text-9xl font-display font-black text-white tracking-tighter drop-shadow-2xl">
              {count}
            </div>
          </div>

          {/* Visual Spacebar */}
          <div className="flex justify-center mb-8">
            <div 
              className={`
                w-full max-w-md h-24 rounded-lg border-b-8 transition-all duration-75 flex items-center justify-center
                ${isPressed 
                  ? 'bg-purple-500 border-purple-700 translate-y-2 shadow-none' 
                  : 'bg-slate-200 border-slate-400 shadow-[0_10px_20px_rgba(0,0,0,0.5)] translate-y-0'
                }
              `}
            >
              <span className={`font-bold text-xl uppercase tracking-widest ${isPressed ? 'text-white' : 'text-slate-500'}`}>Space</span>
            </div>
          </div>

          {!active && !finished && (
            <p className="text-purple-400 animate-pulse font-mono">Press SPACE to Start 10s Timer</p>
          )}
           
          {active && (
            <p className="text-slate-500 font-mono">Time Remaining: <span className="text-white font-bold">{timeLeft.toFixed(2)}s</span></p>
          )}

          {finished && (
             <div className="animate-in fade-in zoom-in duration-300">
                <p className="text-xl text-white font-bold mb-4">Time's Up! Speed: <span className="text-purple-400">{(count / 10).toFixed(2)} CPS</span></p>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={reset}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg inline-flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5" /> RESET COUNTER
                  </button>
                  <button
                    onClick={shareScore}
                    className="p-3 bg-slate-800 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors border border-white/10"
                    title="Share your score"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>
             </div>
          )}
        </div>

        {/* Background Decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5 flex flex-col items-center">
             <Keyboard className="w-8 h-8 text-purple-500 mb-2" />
             <span className="text-slate-400 text-xs uppercase">Key</span>
             <span className="text-white font-bold">SPACEBAR</span>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5 flex flex-col items-center">
             <Zap className="w-8 h-8 text-yellow-500 mb-2" />
             <span className="text-slate-400 text-xs uppercase">Speed (CPS)</span>
             <span className="text-white font-bold">{finished ? (count / 10).toFixed(2) : (active && timeLeft < 10 ? (count / (10 - timeLeft)).toFixed(2) : '0.00')}</span>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5 flex flex-col items-center relative group">
             <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
             <span className="text-slate-400 text-xs uppercase">Best CPS</span>
             <span className="text-white font-bold">{bestCps !== null ? bestCps.toFixed(2) : '--'}</span>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5 flex flex-col items-center">
             <button 
                 onClick={() => setSoundEnabled(!soundEnabled)}
                 className="p-1 mb-1 rounded-full hover:bg-white/5 transition-colors"
                 title={soundEnabled ? "Mute Key Sound" : "Enable Key Sound"}
             >
                 {soundEnabled ? <Volume2 className="w-6 h-6 text-emerald-400" /> : <VolumeX className="w-6 h-6 text-slate-500" />}
             </button>
             <span className="text-slate-400 text-xs uppercase">Sound</span>
             <span className="text-white font-bold">{soundEnabled ? 'ON' : 'OFF'}</span>
          </div>
      </div>

      <section className="space-y-8 pb-12">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 md:p-12">
             <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
                 <Keyboard className="w-8 h-8 text-purple-500"/> Spacebar spam as a separate input skill
             </h2>
             <div className="space-y-4 text-slate-300 leading-relaxed">
               <p>
                 Some players prefer a keyboard key while others prefer a mouse button. The useful comparison is personal: which input lets you keep a repeatable rhythm without losing control?
               </p>
               <p>
                 This test counts registered spacebar presses over ten seconds. It does not measure switch actuation distance, keyboard scan rate or end-to-end hardware latency.
               </p>
             </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="font-bold text-white mb-2">Compare the same duration</h3>
              <p className="text-sm leading-6 text-slate-400">Use repeated 10-second runs when comparing keyboards or techniques.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="font-bold text-white mb-2">Separate speed from hardware specs</h3>
              <p className="text-sm leading-6 text-slate-400">Actuation force, travel and scan behavior vary by exact keyboard and switch implementation.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
              <h3 className="font-bold text-white mb-2">Stop if it hurts</h3>
              <p className="text-sm leading-6 text-slate-400">Repeated high-effort pressing can become uncomfortable; take breaks instead of forcing longer sessions.</p>
            </div>
          </div>

          <RelatedTools currentTool="spacebar" />
      </section>

    </div>
  );
};

export default SpacebarCounter;