import React, { useState, useRef } from 'react';
import { Timer, AlertCircle, Play } from 'lucide-react';

type TestState = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

const ReactionTest: React.FC = () => {
  const [state, setState] = useState<TestState>('idle');
  const [result, setResult] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTest = () => {
    setState('waiting');
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
    
    timeoutRef.current = window.setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'idle') {
      startTest();
    } else if (state === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('early');
    } else if (state === 'ready') {
      // Success
      const endTime = Date.now();
      setResult(endTime - startTimeRef.current);
      setState('result');
    } else if (state === 'result' || state === 'early') {
      startTest();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div 
        onMouseDown={handleClick}
        className={`
          relative w-full h-[400px] rounded-2xl cursor-pointer transition-all duration-200 select-none flex flex-col items-center justify-center p-8 text-center shadow-2xl
          ${state === 'idle' ? 'bg-slate-800 hover:bg-slate-700 border-4 border-slate-600' : ''}
          ${state === 'waiting' ? 'bg-red-600 border-4 border-red-800' : ''}
          ${state === 'ready' ? 'bg-green-500 border-4 border-green-700' : ''}
          ${state === 'result' ? 'bg-slate-800 border-4 border-slate-600' : ''}
          ${state === 'early' ? 'bg-yellow-600 border-4 border-yellow-800' : ''}
        `}
      >
        
        {state === 'idle' && (
          <>
            <Play className="w-20 h-20 text-slate-400 mb-4" />
            <h2 className="text-4xl font-display font-bold text-white mb-2">Reaction Time Test</h2>
            <p className="text-slate-300 text-lg">Click anywhere to start.</p>
            <p className="text-slate-500 mt-4 text-sm">When the red box turns green, click as fast as you can.</p>
          </>
        )}

        {state === 'waiting' && (
          <>
             <div className="w-20 h-20 rounded-full border-4 border-white/20 border-t-white animate-spin mb-6"></div>
             <h2 className="text-5xl font-display font-bold text-white drop-shadow-lg">WAIT FOR GREEN...</h2>
          </>
        )}

        {state === 'ready' && (
           <>
             <Timer className="w-24 h-24 text-white mb-4 animate-ping" />
             <h2 className="text-6xl font-display font-black text-white drop-shadow-xl">CLICK!</h2>
           </>
        )}

        {state === 'result' && (
          <>
            <div className="text-8xl font-display font-black text-white mb-2 text-glow">{result} ms</div>
            <p className="text-slate-300 text-xl mb-8">Your reaction time</p>
            <div className="px-6 py-3 bg-slate-700 rounded-full text-white font-bold hover:bg-slate-600 transition-colors">
              Click to Try Again
            </div>
          </>
        )}

        {state === 'early' && (
          <>
            <AlertCircle className="w-20 h-20 text-white mb-4" />
            <h2 className="text-4xl font-display font-bold text-white mb-2">TOO SOON!</h2>
            <p className="text-white/80 text-lg">You clicked before it turned green.</p>
            <p className="mt-8 text-white/60 font-mono">Click to restart</p>
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
         <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
             <div className="text-slate-500 text-xs uppercase mb-1">Average Human</div>
             <div className="text-white font-bold text-xl">250 ms</div>
         </div>
         <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
             <div className="text-slate-500 text-xs uppercase mb-1">Pro Gamer</div>
             <div className="text-green-400 font-bold text-xl">150-200 ms</div>
         </div>
         <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
             <div className="text-slate-500 text-xs uppercase mb-1">Interpretation</div>
             <div className="text-slate-300 text-sm">Visual stimulus processing speed</div>
         </div>
      </div>
    </div>
  );
};

export default ReactionTest;