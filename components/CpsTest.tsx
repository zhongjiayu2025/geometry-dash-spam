import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, RotateCcw, Timer, Activity, Fingerprint, Mouse, ArrowRight, Zap, Trophy, Share2, Check, Clock } from 'lucide-react';
import RelatedTools from './RelatedTools';

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

const CpsTest: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clicks, setClicks] = useState(0);
  
  // SEO Optimization: Configurable durations for long-tail keywords (e.g., "1 second cps test")
  const [selectedDuration, setSelectedDuration] = useState(10); 
  const [timeLeft, setTimeLeft] = useState(10.00);
  
  const [ripples, setRipples] = useState<ClickEffect[]>([]);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startTest = () => {
    setActive(true);
    setFinished(false);
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
    setClicks(c => c + 1);
  };

  const reset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActive(false);
    setFinished(false);
    setClicks(0);
    setTimeLeft(selectedDuration);
    setCopied(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const shareScore = async (e: React.MouseEvent) => {
     e.stopPropagation();
     const score = (clicks / selectedDuration).toFixed(2);
     const text = `I just hit ${score} CPS (${selectedDuration}s mode) on the Geometry Dash Spam Test! ⚡`;
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
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, selectedDuration - elapsed);
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
  }, [active, finished, selectedDuration]);

  const cps = finished ? (clicks / selectedDuration).toFixed(2) : (active ? (clicks / (selectedDuration - timeLeft)).toFixed(1) : "0.00");
  const cpsNum = parseFloat(cps);

  const getRank = (score: number) => {
    if (score < 5) return { label: "Stereo Madness", color: "text-slate-400" };
    if (score < 7) return { label: "Harder", color: "text-yellow-400" };
    if (score < 9) return { label: "Insane", color: "text-pink-400" };
    if (score < 12) return { label: "Easy Demon", color: "text-blue-400" };
    if (score < 15) return { label: "Extreme Demon", color: "text-purple-500" };
    return { label: "GODLIKE", color: "text-red-500 animate-pulse" };
  };

  const rank = finished ? getRank(cpsNum) : null;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
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
           {/* Timer */}
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
              <div className="h-12 w-12 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                 <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
                    <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-600" strokeDasharray={113} strokeDashoffset={113 * (1 - timeLeft/selectedDuration)} />
                 </svg>
              </div>
           </div>

           {/* Result Main */}
           <div className="flex-grow bg-slate-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
               
               <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">Your Speed</h3>
               <div className="text-7xl font-display font-black text-white mb-2 text-glow relative z-10">{finished ? cps : (active ? cps : '0.00')}</div>
               <div className="text-xl text-blue-400 font-mono relative z-10 mb-6">CPS</div>
               
               {finished && rank && (
                 <div className="animate-in zoom-in duration-300 mb-8 relative z-10">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Rank Achieved</div>
                    <div className={`text-3xl font-display font-black ${rank.color} drop-shadow-md flex items-center justify-center gap-2`}>
                        <Trophy className="w-6 h-6" /> {rank.label}
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
                      In <strong className="text-white">Geometry Dash</strong>, consistent CPS is more important than raw peak speed, which is why our test allows you to measure your consistency over longer durations like 30s or 60s.
                  </p>
              </div>
          </div>
      </section>

      {/* Cross-Link / Internal Navigation */}
      <RelatedTools currentTool="cps" />
    </div>
  );
};

export default CpsTest;