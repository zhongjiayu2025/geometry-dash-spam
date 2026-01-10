"use client";

import React, { useState, useRef } from 'react';
import { Timer, AlertCircle, Play, Eye, BarChart2 } from 'lucide-react';
import RelatedTools from './RelatedTools';

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

      {/* Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-16">
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

      {/* SEO CONTENT SECTION */}
      <section className="space-y-12 pb-12">
          
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 md:p-12">
             <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
                 <Eye className="w-8 h-8 text-green-500"/> Sight Reading vs Muscle Memory
             </h2>
             <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                 <p>
                     In Geometry Dash, there are two main skills: <strong>Memory</strong> (memorizing a level's layout) and <strong>Sight Reading</strong> (reacting to obstacles as they appear). A low reaction time is critical for Sight Reading, especially in fast-paced gamemodes like the Wave or Ship at 3x/4x speed.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                     <div>
                         <h4 className="text-white font-bold mb-2">How Latency Affects Gameplay:</h4>
                         <ul className="list-disc pl-5 space-y-2 text-sm">
                             <li><strong>Input Lag:</strong> If your mouse or monitor adds 30ms of delay, your effective reaction time is slower.</li>
                             <li><strong>Hardware:</strong> 144Hz monitors update the frame 2.4x faster than 60Hz monitors, giving you a visual advantage of ~9ms.</li>
                         </ul>
                     </div>
                     <div>
                         <h4 className="text-white font-bold mb-2">Improving Reaction Time:</h4>
                         <p className="text-sm">
                             While genetics play a role, staying hydrated, sleeping well, and "warming up" your eyes with tests like this can shave 10-20ms off your time before a serious gaming session.
                         </p>
                     </div>
                 </div>
             </div>
          </div>

          {/* TABLE SEO OPTIMIZATION: Link Bait for "Average Reaction Time by Age" */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-yellow-400" /> Reaction Time Benchmarks by Age
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                  Reaction time naturally slows down with age. Compare your score to the global averages below to see where you stand.
              </p>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-white/10 text-slate-500 text-xs uppercase tracking-wider">
                              <th className="p-3 font-medium">Age Group</th>
                              <th className="p-3 font-medium">Average Reaction Time</th>
                              <th className="p-3 font-medium">Competitive Gamer Speed</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm text-slate-300">
                          <tr className="border-b border-white/5 bg-white/5">
                              <td className="p-3 font-bold text-white">18 - 25 Years</td>
                              <td className="p-3">230 ms</td>
                              <td className="p-3 text-green-400">150 - 180 ms</td>
                          </tr>
                          <tr className="border-b border-white/5">
                              <td className="p-3 font-bold text-white">26 - 35 Years</td>
                              <td className="p-3">250 ms</td>
                              <td className="p-3 text-green-400">180 - 200 ms</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-white/5">
                              <td className="p-3 font-bold text-white">36 - 45 Years</td>
                              <td className="p-3">270 ms</td>
                              <td className="p-3 text-green-400">200 - 220 ms</td>
                          </tr>
                          <tr className="border-b border-white/5">
                              <td className="p-3 font-bold text-white">46 - 55 Years</td>
                              <td className="p-3">300 ms</td>
                              <td className="p-3 text-green-400">230 - 250 ms</td>
                          </tr>
                          <tr>
                              <td className="p-3 font-bold text-white">55+ Years</td>
                              <td className="p-3">350+ ms</td>
                              <td className="p-3 text-green-400">270+ ms</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <RelatedTools currentTool="reaction" />
      </section>

    </div>
  );
};

export default ReactionTest;