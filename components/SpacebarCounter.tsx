"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard, RotateCcw, Zap, Gauge } from 'lucide-react';
import RelatedTools from './RelatedTools';

const SpacebarCounter: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10.00);
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<number | null>(null);

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

      setIsPressed(true);

      if (finished) return;
      
      if (!active) {
        startTest();
        return;
      }
      setCount(c => c + 1);
    }
  }, [active, finished, startTest]);

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
        }
      }, 10);
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
                <button 
                  onClick={reset}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg inline-flex items-center gap-2 transition-colors shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" /> RESET COUNTER
                </button>
             </div>
          )}
        </div>

        {/* Background Decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
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
          <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5 flex flex-col items-center">
             <RotateCcw className="w-8 h-8 text-blue-500 mb-2 cursor-pointer hover:rotate-180 transition-transform" onClick={reset} />
             <span className="text-slate-400 text-xs uppercase">Reset</span>
             <span className="text-white font-bold">MANUAL</span>
          </div>
      </div>

      {/* SEO CONTENT SECTION */}
      <section className="space-y-12 pb-12">
          
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 md:p-12">
             <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
                 <Keyboard className="w-8 h-8 text-purple-500"/> Why is the Spacebar King in Geometry Dash?
             </h2>
             <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                 <p>
                     While the mouse allows for micro-adjustments in ship flying, the <strong>spacebar</strong> is often preferred for "Endurance Spam" sections in Geometry Dash. This is because the thumb is the strongest digit on the human hand, capable of sustaining repetitive motion longer than the index finger without cramping.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                     <div>
                         <h4 className="text-white font-bold mb-2">Advantages of Spacebar Spam:</h4>
                         <ul className="list-disc pl-5 space-y-2 text-sm">
                             <li><strong>Higher Stamina:</strong> The thumb has more muscle mass.</li>
                             <li><strong>Mechanical Switches:</strong> Keyboards often have faster actuation points (e.g., Cherry MX Silver) compared to standard mouse switches.</li>
                             <li><strong>Stability:</strong> Pressing a keyboard key doesn't move your crosshair/aim like clicking a mouse might.</li>
                         </ul>
                     </div>
                     <div>
                         <h4 className="text-white font-bold mb-2">When to use it:</h4>
                         <p className="text-sm">
                             Use the spacebar for long, straight wave corridors or UFO sections where rhythm is key. Avoid it for rapid direction changes where the travel distance of the key (3-4mm) might be too slow compared to a mouse click (0.5mm).
                         </p>
                     </div>
                 </div>
             </div>
          </div>

          {/* TABLE SEO OPTIMIZATION: Link Bait for "Best Switches for Spam" */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-purple-400" /> Best Keyboard Switches for Speed Spam
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                  Not all mechanical switches are equal. For Geometry Dash spam, you need a high actuation point and light operating force.
              </p>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-white/10 text-slate-500 text-xs uppercase tracking-wider">
                              <th className="p-3 font-medium">Switch Type</th>
                              <th className="p-3 font-medium">Actuation Distance</th>
                              <th className="p-3 font-medium">Force</th>
                              <th className="p-3 font-medium">Spam Rating</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm text-slate-300">
                          <tr className="border-b border-white/5 bg-white/5">
                              <td className="p-3 font-bold text-white">Cherry MX Silver (Speed)</td>
                              <td className="p-3">1.2 mm</td>
                              <td className="p-3">45g</td>
                              <td className="p-3 text-purple-400">★★★★★</td>
                          </tr>
                          <tr className="border-b border-white/5">
                              <td className="p-3 font-bold text-white">Gateron Red</td>
                              <td className="p-3">2.0 mm</td>
                              <td className="p-3">45g</td>
                              <td className="p-3 text-purple-400">★★★★☆</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-white/5">
                              <td className="p-3 font-bold text-white">Razer Opto-Mechanical</td>
                              <td className="p-3">1.0 mm</td>
                              <td className="p-3">40g</td>
                              <td className="p-3 text-purple-400">★★★★★</td>
                          </tr>
                          <tr className="border-b border-white/5">
                              <td className="p-3 font-bold text-white">Cherry MX Blue (Clicky)</td>
                              <td className="p-3">2.2 mm</td>
                              <td className="p-3">60g</td>
                              <td className="p-3 text-slate-500">★★☆☆☆</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <RelatedTools currentTool="spacebar" />
      </section>

    </div>
  );
};

export default SpacebarCounter;