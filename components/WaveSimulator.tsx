
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Difficulty, GameStatus } from '../types';
import { DIFFICULTY_CONFIGS } from '../constants';
import DifficultySelector from './DifficultySelector';
import GameCanvas from './GameCanvas';
import { Infinity as InfinityIcon, Minimize2, Star, MousePointerClick, Activity, Keyboard, Timer, Calendar } from 'lucide-react';

const WaveSimulator: React.FC = () => {
  // Initialize with saved difficulty if present
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('gd_spam_last_difficulty');
        return (saved && Object.values(Difficulty).includes(saved as Difficulty)) 
        ? (saved as Difficulty) 
        : Difficulty.Easy;
    }
    return Difficulty.Easy;
  });
  
  // Initialize Endless Mode state
  const [isEndless, setIsEndless] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('gd_spam_endless_mode') === 'true';
    }
    return false;
  });

  // Initialize Mini Wave state
  const [isMini, setIsMini] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('gd_spam_mini_mode') === 'true';
    }
    return false;
  });
  
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Idle);

  const handleDifficultySelect = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    setGameStatus(GameStatus.Idle);
    localStorage.setItem('gd_spam_last_difficulty', newDiff);
  };

  const toggleEndless = () => {
    const newState = !isEndless;
    setIsEndless(newState);
    localStorage.setItem('gd_spam_endless_mode', String(newState));
    setGameStatus(GameStatus.Idle);
  };

  const toggleMini = () => {
    const newState = !isMini;
    setIsMini(newState);
    localStorage.setItem('gd_spam_mini_mode', String(newState));
    setGameStatus(GameStatus.Idle);
  };

  const currentConfig = DIFFICULTY_CONFIGS[difficulty];

  // Generate today's date for dynamic content
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // Schema 1: HowTo
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Pass a Geometry Dash Spam Test",
    "description": "A step-by-step guide to mastering the wave spam mechanic in Geometry Dash using our simulator.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select Difficulty",
        "text": "Choose a difficulty level for your Geometry Dash Spam Test. Beginners should start with 'Easy'."
      },
      {
        "@type": "HowToStep",
        "name": "Configure Wave Settings",
        "text": "Toggle 'Mini Wave' if you want to practice faster vertical movement spam."
      },
      {
        "@type": "HowToStep",
        "name": "Start the Spam Test",
        "text": "Press Spacebar or Click to begin. The wave moves up when holding and down when releasing."
      },
      {
        "@type": "HowToStep",
        "name": "Analyze Consistency",
        "text": "After the run, check your 'Consistency Score' to see if you passed the spam test with even rhythm."
      }
    ]
  };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      
      <DifficultySelector 
        currentDifficulty={difficulty} 
        onSelect={handleDifficultySelect} 
        disabled={gameStatus === GameStatus.Playing}
      />

      {/* Mode Toggles */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 relative z-10">
        {/* Endless Toggle */}
        <button
            onClick={toggleEndless}
            disabled={gameStatus === GameStatus.Playing}
            className={`
                group flex items-center gap-3 px-5 py-2 rounded-full border transition-all duration-300
                ${gameStatus === GameStatus.Playing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
                ${isEndless 
                    ? 'bg-blue-900/30 border-blue-500 text-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                    : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-800'
                }
            `}
        >
            <div className={`
                w-4 h-4 rounded border flex items-center justify-center transition-all duration-300
                ${isEndless ? 'bg-blue-500 border-blue-500' : 'border-slate-500 bg-transparent'}
            `}>
                {isEndless && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
            </div>
            <div className="flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs md:text-sm">
                <InfinityIcon className={`w-4 h-4 ${isEndless ? 'text-blue-400' : 'text-slate-500'}`} />
                Endless
            </div>
        </button>

        {/* Mini Wave Toggle */}
        <button
            onClick={toggleMini}
            disabled={gameStatus === GameStatus.Playing}
            className={`
                group flex items-center gap-3 px-5 py-2 rounded-full border transition-all duration-300
                ${gameStatus === GameStatus.Playing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-purple-400'}
                ${isMini 
                    ? 'bg-purple-900/30 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                    : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-800'
                }
            `}
        >
            <div className={`
                w-4 h-4 rounded border flex items-center justify-center transition-all duration-300
                ${isMini ? 'bg-purple-500 border-purple-500' : 'border-slate-500 bg-transparent'}
            `}>
                {isMini && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
            </div>
            <div className="flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs md:text-sm">
                <Minimize2 className={`w-4 h-4 ${isMini ? 'text-purple-400' : 'text-slate-500'}`} />
                Mini Wave
            </div>
        </button>
      </div>

      <GameCanvas 
        difficulty={currentConfig}
        status={gameStatus}
        onStatusChange={setGameStatus}
        isEndless={isEndless}
        isMini={isMini}
      />
      
      {/* DAILY CHALLENGE SECTION */}
      <div className="w-full max-w-5xl mt-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
                      <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                      <div className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-1">Daily Practice • {today}</div>
                      <h3 className="text-xl font-display font-bold text-white mb-1">Slaughterhouse River Run</h3>
                      <p className="text-slate-400 text-sm max-w-md">
                          Today's <strong>Geometry Dash Spam</strong> Goal: Survive <span className="text-white font-bold">15 seconds</span> on <span className="text-white font-bold">Insane</span> difficulty using <span className="text-white font-bold">Mini Wave</span>.
                      </p>
                  </div>
              </div>

              <div className="flex flex-col items-center relative z-10">
                  <button 
                    onClick={() => {
                        setDifficulty(Difficulty.Insane);
                        setIsMini(true);
                        setIsEndless(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-lg shadow-yellow-900/20 transition-all flex items-center gap-2"
                  >
                      <Star className="w-4 h-4 fill-current" />
                      ACCEPT CHALLENGE
                  </button>
                  <p className="text-[10px] text-yellow-500/80 mt-2 font-mono">1,240 players completed this test today</p>
              </div>
          </div>
      </div>

      {/* Quick Access Training Modules (Modified to use Link) */}
      <div className="w-full max-w-5xl mt-8 mb-8">
        <h3 className="text-xl font-display font-bold text-white mb-4 px-2 border-l-4 border-blue-500">More Geometry Dash Spam Tests</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/cps-test" className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-blue-400/50 hover:bg-slate-900 transition-all cursor-pointer group block">
                <MousePointerClick className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform"/>
                <h4 className="font-bold text-white text-sm mb-1">CPS Test</h4>
                <p className="text-xs text-slate-400">Measure raw clicking speed.</p>
            </Link>
            <Link href="/jitter-click" className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-orange-400/50 hover:bg-slate-900 transition-all cursor-pointer group block">
                <Activity className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform"/>
                <h4 className="font-bold text-white text-sm mb-1">Jitter Click</h4>
                <p className="text-xs text-slate-400">Learn advanced vibration.</p>
            </Link>
            <Link href="/spacebar-counter" className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-purple-400/50 hover:bg-slate-900 transition-all cursor-pointer group block">
                <Keyboard className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform"/>
                <h4 className="font-bold text-white text-sm mb-1">Spacebar</h4>
                <p className="text-xs text-slate-400">Test keyboard latency.</p>
            </Link>
            <Link href="/reaction-test" className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-green-400/50 hover:bg-slate-900 transition-all cursor-pointer group block">
                <Timer className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform"/>
                <h4 className="font-bold text-white text-sm mb-1">Reaction</h4>
                <p className="text-xs text-slate-400">Test visual reflexes.</p>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default WaveSimulator;
