import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, RotateCcw, Timer, Activity, Fingerprint, Mouse, ArrowRight, Zap, Trophy, Share2, Check } from 'lucide-react';

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

const CpsTest: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10.00);
  const [ripples, setRipples] = useState<ClickEffect[]>([]);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startTest = () => {
    setActive(true);
    setFinished(false);
    setClicks(1);
    setTimeLeft(10.00);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent default touch behaviors (zooming, scrolling)
    e.preventDefault();
    
    // Add Visual Ripple
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    // Cleanup ripple after animation
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
    setTimeLeft(10.00);
    setCopied(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const shareScore = (e: React.MouseEvent) => {
     e.stopPropagation();
     const score = (clicks / 10).toFixed(2);
     const text = `I just hit ${score} CPS on the Geometry Dash Spam Test! ⚡ How fast are you? https://geometrydashspam.cc`;
     navigator.clipboard.writeText(text);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
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
  const cpsNum = parseFloat(cps);

  // Gamification: Rank System
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
      
      {/* Main Testing Area */}
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
            {/* Ripples */}
            {ripples.map(r => (
               <span 
                 key={r.id}
                 className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
                 style={{
                   left: r.x,
                   top: r.y,
                   width: '20px',
                   height: '20px',
                   transform: 'translate(-50%, -50%)'
                 }}
               />
            ))}

            {!active && !finished && (
              <>
                <MousePointer2 className="w-16 h-16 text-white mb-4 animate-bounce" />
                <span className="text-3xl font-display font-bold text-white tracking-widest">CLICK TO START</span>
                <span className="text-blue-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
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
                    <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-600" strokeDasharray={113} strokeDashoffset={113 * (1 - timeLeft/10)} />
                 </svg>
              </div>
           </div>

           {/* Result Main */}
           <div className="flex-grow bg-slate-900/50 backdrop-blur border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
               
               <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">Your Speed</h3>
               <div className="text-7xl font-display font-black text-white mb-2 text-glow relative z-10">{finished ? cps : (active ? cps : '0.00')}</div>
               <div className="text-xl text-blue-400 font-mono relative z-10 mb-6">CPS</div>
               
               {/* Rank Display */}
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
                    className="px-4 py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-colors shadow-lg"
                   >
                     {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                   </button>
                 </div>
               )}
           </div>
        </div>
      </div>

      {/* Cross-Link / Internal Navigation (SEO Booster) */}
      <div className="border-t border-white/10 pt-12">
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-blue-500" /> Advanced Click Techniques
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <a href="#" onClick={(e) => { e.preventDefault(); (window as any).location.reload(); /* In a real router, navigate */ }} className="group block bg-slate-900/40 border border-white/5 rounded-xl p-6 hover:border-orange-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-900/20 rounded-lg text-orange-400"><Zap className="w-6 h-6"/></div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-orange-400 transition-colors"/>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Jitter Clicking</h3>
                <p className="text-sm text-slate-400">Learn to vibrate your arm muscles to reach 14+ CPS without macros.</p>
            </a>

            <a href="#" className="group block bg-slate-900/40 border border-white/5 rounded-xl p-6 hover:border-pink-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-pink-900/20 rounded-lg text-pink-400"><Fingerprint className="w-6 h-6"/></div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-pink-400 transition-colors"/>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">Butterfly Clicking</h3>
                <p className="text-sm text-slate-400">Use two fingers on one button. The meta for modern Minecraft and GD spam.</p>
            </a>

            <a href="#" className="group block bg-slate-900/40 border border-white/5 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-900/20 rounded-lg text-emerald-400"><Mouse className="w-6 h-6"/></div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors"/>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Right Click Test</h3>
                <p className="text-sm text-slate-400">Don't neglect your middle finger. Essential for MOBA players.</p>
            </a>
            
        </div>
      </div>
    </div>
  );
};

export default CpsTest;