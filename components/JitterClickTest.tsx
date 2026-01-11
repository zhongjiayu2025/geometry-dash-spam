
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, RotateCcw, Timer, Zap, AlertTriangle, CheckCircle, Crosshair, Trophy, BookOpen, ArrowRight } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import Link from 'next/link';

const JitterClickTest: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10.00);
  const timerRef = useRef<number | null>(null);

  const startTest = () => {
    setActive(true);
    setFinished(false);
    setClicks(1);
    setTimeLeft(10.00);
  };

  const handleClick = () => {
    if (finished) return;
    if (!active) {
      startTest();
      return;
    }
    setClicks(c => c + 1);
  };

  const reset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActive(false);
    setFinished(false);
    setClicks(0);
    setTimeLeft(10.00);
    if (timerRef.current) clearInterval(timerRef.current);
  };

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
        }
      }, 10);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, finished]);

  const cps = finished ? (clicks / 10).toFixed(2) : (active ? (clicks / (10 - timeLeft)).toFixed(1) : "0.00");

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      <Breadcrumbs items={[{ label: 'Jitter Click', href: '/jitter-click', active: true }]} />

      <div className="text-center mb-8">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-mono text-orange-400 mb-4">
            <Zap className="w-3 h-3" /> ADVANCED TECHNIQUE
         </div>
         <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 drop-shadow-2xl uppercase">
            Jitter Click Test
         </h1>
         <p className="text-slate-400 max-w-2xl mx-auto">
            Test your arm vibration speed. Master the art of Jitter Clicking for Geometry Dash and PVP games.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
        {/* Click Area */}
        <div className="relative aspect-square md:aspect-auto md:h-[400px]">
          <button
            onMouseDown={handleClick}
            className={`
              w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-100 active:scale-[0.99] select-none
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
           </div>

           {/* Result Main */}
           <div className="flex-grow bg-slate-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-orange-600/5 group-hover:bg-orange-600/10 transition-colors"></div>
               <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">Your Jitter Speed</h3>
               <div className="text-7xl font-display font-black text-white mb-2 text-glow relative z-10">{finished ? cps : (active ? cps : '0.00')}</div>
               <div className="text-xl text-orange-400 font-mono relative z-10">CPS</div>
               
               {finished && (
                 <div className="mt-8 animate-in fade-in zoom-in duration-300 relative z-10">
                   <button 
                    onClick={reset}
                    className="px-8 py-3 bg-white text-orange-900 font-bold rounded-lg flex items-center gap-2 hover:bg-orange-50 transition-colors shadow-lg"
                   >
                     <RotateCcw className="w-5 h-5" /> TRY AGAIN
                   </button>
                 </div>
               )}
           </div>
        </div>
      </div>

      {/* SEO Content / Tutorial - SIGNIFICANTLY ENRICHED */}
      <section className="space-y-8 mb-16">
        
        {/* Guide Section */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircle className="text-orange-500 w-8 h-8" /> 
                How to Jitter Click: The Ultimate Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 leading-relaxed">
                <div>
                    <p className="mb-4">
                        <strong>Jitter clicking</strong> is a technique used by competitive Geometry Dash and Minecraft players to achieve high clicks per second (CPS) by vibrating the muscles in their forearm rather than using the finger muscles alone. Mastering this can boost your speed from 6 CPS to over 14 CPS.
                    </p>
                    <h4 className="text-white font-bold mb-2 mt-6">Step-by-Step Technique:</h4>
                    <ol className="space-y-2 list-decimal pl-5">
                        <li><strong>Grip:</strong> Use a "Claw Grip" or "Fingertip Grip". Your hand should not rest heavily on the mouse.</li>
                        <li><strong>Tension:</strong> Stiffen your forearm muscles (specifically the brachioradialis) until your hand begins to spasm or vibrate uncontrollably.</li>
                        <li><strong>Transfer:</strong> Direct this vibration into your index finger tip.</li>
                        <li><strong>Aiming:</strong> This is the hard part. Use your wrist or thumb to stabilize the mouse while your finger vibrates.</li>
                    </ol>
                </div>
                <div className="space-y-6">
                    <div className="bg-orange-900/20 border border-orange-500/20 p-6 rounded-xl">
                        <h3 className="text-orange-400 font-bold flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5" /> Safety Warning
                        </h3>
                        <p className="text-sm">
                            Jitter clicking places significant stress on your forearm and wrist tendons. Do not practice for more than 10-15 minutes at a time. If you feel pain, stop immediately to prevent RSI (Repetitive Strain Injury) or Carpal Tunnel Syndrome.
                        </p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                        <h4 className="text-white font-bold mb-2">Pros vs Cons</h4>
                        <ul className="text-sm space-y-2">
                            <li className="flex justify-between"><span className="text-green-400">High CPS (12-15)</span> <span className="text-red-400">Hard to Aim</span></li>
                            <li className="flex justify-between"><span className="text-green-400">No Special Mouse Needed</span> <span className="text-red-400">High Fatigue</span></li>
                            <li className="flex justify-between"><span className="text-green-400">Allowed on Most Servers</span> <span className="text-red-400">Risk of RSI</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed FAQ for SEO Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
                <Crosshair className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-white mb-2">Is Jitter Clicking good for Geometry Dash?</h3>
                <p className="text-sm text-slate-400">Yes, specifically for spam wave sections. However, it's risky for sections requiring precision flying because the vibration makes fine movements difficult.</p>
            </div>
            <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
                <MousePointer2 className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="font-bold text-white mb-2">Butterfly vs Jitter Clicking?</h3>
                <p className="text-sm text-slate-400">Butterfly clicking is generally faster (15-20 CPS) and less tiring, but requires a mouse with double-clicking switches. Jitter works on any mouse but is harder to master.</p>
            </div>
            <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
                <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
                <h3 className="font-bold text-white mb-2">World Record Jitter Click?</h3>
                <p className="text-sm text-slate-400">The highest consistent Jitter Click speed recorded is around 16 CPS, though some players can burst up to 18 CPS for short durations.</p>
            </div>
        </div>

      </section>

      {/* INTERNAL LINKING: Contextual Guide Recommendation */}
      <Link 
        href="/blog/common-spam-mistakes"
        className="block mb-12 group relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-900/40 to-slate-900/40 p-8 transition-all hover:border-orange-400/50"
      >
         <div className="absolute right-0 top-0 h-full w-1/3 bg-orange-500/10 blur-[50px] transition-all group-hover:bg-orange-500/20"></div>
         <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                    <BookOpen className="h-4 w-4" /> Improve Your Form
                </div>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-orange-200">
                   Hurting your hand while Jittering?
                </h3>
                <p className="max-w-xl text-slate-400">
                    Jitter clicking can lead to injury if done incorrectly. Read our guide on the "10 Common Spam Mistakes" to fix your posture and reduce strain.
                </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg shadow-orange-900/50 transition-transform group-hover:translate-x-2 group-hover:scale-110">
                <ArrowRight className="h-6 w-6" />
            </div>
         </div>
      </Link>
    </div>
  );
};

export default JitterClickTest;
