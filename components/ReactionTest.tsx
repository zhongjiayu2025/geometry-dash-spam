"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Timer, AlertCircle, Play, Trophy } from 'lucide-react';

const ReactionResult = dynamic(() => import('./ReactionResult'), { ssr: false });


type TestState = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

const ReactionTest: React.FC = () => {
  const [state, setState] = useState<TestState>('idle');
  const [result, setResult] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            handleClick();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('reactionBestScore');
    if (saved) {
      setBestScore(parseInt(saved, 10));
    }
  }, []);

  const startTest = () => {
    setState('waiting');
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
    
    timeoutRef.current = window.setTimeout(() => {
      setState('ready');
      startTimeRef.current = performance.now();
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
      const endTime = performance.now();
      const newResult = Math.round(endTime - startTimeRef.current);
      setResult(newResult);
      if (bestScore === null || newResult < bestScore) {
          setBestScore(newResult);
          localStorage.setItem('reactionBestScore', newResult.toString());
      }
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
          relative w-full h-[400px] rounded-2xl cursor-pointer transition-all duration-200 select-none flex flex-col items-center justify-center p-8 text-center shadow-2xl mb-12
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
            <p className="text-slate-300 text-lg mb-4">Click anywhere to start.</p>
            {bestScore && (
              <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20">
                <Trophy className="w-5 h-5" /> Best: {bestScore} ms
              </div>
            )}
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
          <ReactionResult result={result} bestScore={bestScore} />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-16">
         <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
             <div className="text-slate-500 text-xs uppercase mb-1">Current Result</div>
             <div className="text-white font-bold text-xl">{result > 0 ? `${result} ms` : "--"}</div>
         </div>
         <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
             <div className="text-slate-500 text-xs uppercase mb-1">Local Best</div>
             <div className="text-green-400 font-bold text-xl">{bestScore ? `${bestScore} ms` : "--"}</div>
         </div>
         <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
             <div className="text-slate-500 text-xs uppercase mb-1">Measurement</div>
             <div className="text-slate-300 text-sm">Browser cue-to-input time</div>
         </div>
      </div>


    </div>
  );
};

export default ReactionTest;