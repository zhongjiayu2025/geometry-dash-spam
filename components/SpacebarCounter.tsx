import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard, RotateCcw, Zap } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
};

export default SpacebarCounter;