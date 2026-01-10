import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, RotateCcw, Timer, Fingerprint } from 'lucide-react';

const ButterflyClickTest: React.FC = () => {
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
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-mono text-pink-400 mb-4">
            <Fingerprint className="w-3 h-3" /> DOUBLE FINGER TECHNIQUE
         </div>
         <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 drop-shadow-2xl uppercase">
            Butterfly Click Test
         </h1>
         <p className="text-slate-400 max-w-2xl mx-auto">
            Master the double-finger rhythm. The preferred spam technique for wide mouse buttons.
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
                : 'bg-gradient-to-br from-pink-600 to-purple-800 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:shadow-[0_0_60px_rgba(236,72,153,0.5)] cursor-pointer'
              }
            `}
          >
            {!active && !finished && (
              <>
                <div className="flex gap-2 mb-4">
                    <MousePointer2 className="w-12 h-12 text-white animate-bounce" style={{ animationDelay: '0s' }} />
                    <MousePointer2 className="w-12 h-12 text-pink-200 animate-bounce" style={{ animationDelay: '0.1s' }} />
                </div>
                <span className="text-3xl font-display font-bold text-white tracking-widest">BUTTERFLY CLICK</span>
                <span className="text-pink-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
              </>
            )}
            
            {active && (
              <>
                <span className="text-8xl font-display font-black text-white drop-shadow-lg scale-110 transition-transform">{clicks}</span>
                <span className="text-pink-200 mt-4 font-mono uppercase tracking-widest">Clicks</span>
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
                 <div className="p-3 rounded-lg bg-slate-800 text-pink-400">
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
               <div className="absolute inset-0 bg-pink-600/5 group-hover:bg-pink-600/10 transition-colors"></div>
               <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">Your Butterfly Speed</h3>
               <div className="text-7xl font-display font-black text-white mb-2 text-glow relative z-10">{finished ? cps : (active ? cps : '0.00')}</div>
               <div className="text-xl text-pink-400 font-mono relative z-10">CPS</div>
               
               {finished && (
                 <div className="mt-8 animate-in fade-in zoom-in duration-300 relative z-10">
                   <button 
                    onClick={reset}
                    className="px-8 py-3 bg-white text-pink-900 font-bold rounded-lg flex items-center gap-2 hover:bg-pink-50 transition-colors shadow-lg"
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
        <h2 className="text-3xl font-display font-bold text-white mb-6">What is Butterfly Clicking?</h2>
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <p>
                <strong>Butterfly clicking</strong> involves using two fingers (usually the index and middle finger) to hit the mouse button in an alternating rhythm. This effectively doubles the number of inputs you can send compared to single-finger clicking.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Why is it popular in Geometry Dash?</h3>
            <p>
                Unlike Minecraft PVP, where double-clicking switches are required for high CPS, Geometry Dash spam relies on consistent registration. Butterfly clicking allows players to maintain a high CPS (12-16) for longer durations because the workload is split between two fingers, reducing fatigue during long Wave sections.
            </p>
            <h3 className="text-xl font-bold text-white mt-4">Recommended Hardware</h3>
            <p>
                To butterfly click effectively, you need a mouse with wide primary buttons (like the <em>Glorious Model O</em> or <em>Razer Viper</em>). Narrow mice make it difficult to fit both fingers on the switch.
            </p>
        </div>
      </section>
    </div>
  );
};

export default ButterflyClickTest;