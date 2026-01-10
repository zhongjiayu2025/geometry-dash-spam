import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, RotateCcw, Timer, Zap, AlertTriangle } from 'lucide-react';

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

      {/* SEO Content / Tutorial */}
      <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-display font-bold text-white mb-6">How to Jitter Click?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 leading-relaxed">
            <div>
                <p className="mb-4">
                    <strong>Jitter clicking</strong> is a technique used by competitive Geometry Dash and Minecraft players to achieve high clicks per second (CPS) by vibrating the muscles in their forearm rather than using the finger muscles alone.
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>Place your index finger on the mouse button.</li>
                    <li>Tense your forearm muscles until your hand starts to vibrate.</li>
                    <li>Direct this vibration into your finger tip.</li>
                    <li>Do not press down hard; let the vibration trigger the switch.</li>
                </ol>
            </div>
            <div>
                <div className="bg-orange-900/20 border border-orange-500/20 p-6 rounded-xl">
                    <h3 className="text-orange-400 font-bold flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5" /> Safety Warning
                    </h3>
                    <p className="text-sm">
                        Jitter clicking places significant stress on your forearm and wrist tendons. Do not practice for more than 10-15 minutes at a time. If you feel pain, stop immediately to prevent RSI (Repetitive Strain Injury).
                    </p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default JitterClickTest;