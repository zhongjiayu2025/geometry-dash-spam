
"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Difficulty, GameStatus } from '../types';
import { DIFFICULTY_CONFIGS } from '../constants';
import DifficultySelector from './DifficultySelector';
import { Infinity as InfinityIcon, Minimize2, Star } from 'lucide-react';

const GameCanvas = dynamic(() => import('./GameCanvas'), { ssr: false });

interface WaveSimulatorProps {
  variant?: 'spam' | 'wave';
}

type WavePreset = 'normal' | 'mini' | 'spam' | 'precision' | 'endless' | 'custom';

const WAVE_PRESETS: Array<{ id: WavePreset; label: string; description: string }> = [
  { id: 'normal', label: 'Normal Wave', description: 'Balanced wave control practice.' },
  { id: 'mini', label: 'Mini Wave', description: 'Faster vertical movement with tighter corrections.' },
  { id: 'spam', label: 'Wave Spam', description: 'Rapid repeated inputs with a demanding pace.' },
  { id: 'precision', label: 'Precision', description: 'Narrower high-difficulty control practice.' },
  { id: 'endless', label: 'Endless', description: 'Survive as long as possible and chase a local best.' },
];

const WaveSimulator: React.FC<WaveSimulatorProps> = ({ variant = 'spam' }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [isEndless, setIsEndless] = useState(false);
  const [isMini, setIsMini] = useState(false);
  
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Idle);
  const [wavePreset, setWavePreset] = useState<WavePreset>('custom');
  const isWavePage = variant === 'wave';

  useEffect(() => {
    const savedDifficulty = localStorage.getItem('gd_spam_last_difficulty');
    if (savedDifficulty && Object.values(Difficulty).includes(savedDifficulty as Difficulty)) {
      setDifficulty(savedDifficulty as Difficulty);
    }

    setIsEndless(localStorage.getItem('gd_spam_endless_mode') === 'true');
    setIsMini(localStorage.getItem('gd_spam_mini_mode') === 'true');
  }, []);

  const handleDifficultySelect = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    setWavePreset('custom');
    setGameStatus(GameStatus.Idle);
    localStorage.setItem('gd_spam_last_difficulty', newDiff);
  };

  const toggleEndless = () => {
    const newState = !isEndless;
    setIsEndless(newState);
    setWavePreset('custom');
    localStorage.setItem('gd_spam_endless_mode', String(newState));
    setGameStatus(GameStatus.Idle);
  };

  const toggleMini = () => {
    const newState = !isMini;
    setIsMini(newState);
    setWavePreset('custom');
    localStorage.setItem('gd_spam_mini_mode', String(newState));
    setGameStatus(GameStatus.Idle);
  };

  const applyWavePreset = (preset: WavePreset) => {
    if (gameStatus === GameStatus.Playing) return;

    setWavePreset(preset);

    if (preset === 'normal') {
      setDifficulty(Difficulty.Hard);
      setIsMini(false);
      setIsEndless(false);
    } else if (preset === 'mini') {
      setDifficulty(Difficulty.Insane);
      setIsMini(true);
      setIsEndless(false);
    } else if (preset === 'spam') {
      setDifficulty(Difficulty.EasyDemon);
      setIsMini(true);
      setIsEndless(false);
    } else if (preset === 'precision') {
      setDifficulty(Difficulty.ExtremeDemon);
      setIsMini(false);
      setIsEndless(false);
    } else {
      setDifficulty(Difficulty.Hard);
      setIsMini(false);
      setIsEndless(true);
    }

    localStorage.setItem('gd_spam_last_difficulty', preset === 'normal' || preset === 'endless' ? Difficulty.Hard : preset === 'mini' ? Difficulty.Insane : preset === 'spam' ? Difficulty.EasyDemon : Difficulty.ExtremeDemon);
    localStorage.setItem('gd_spam_mini_mode', String(preset === 'mini' || preset === 'spam'));
    localStorage.setItem('gd_spam_endless_mode', String(preset === 'endless'));
    setGameStatus(GameStatus.Idle);
  };

  const currentConfig = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div id="spam-test-tool" className="flex flex-col items-center w-full animate-in fade-in duration-500 scroll-mt-20">
      <section className="w-full max-w-5xl mb-4 md:mb-6 rounded-2xl border border-white/10 bg-slate-900/35 p-3 md:p-5">
          <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between mb-3 md:mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-blue-400 font-bold">
                {isWavePage ? "Wave training presets" : "Spam training presets"}
              </p>
              <h2 className="text-xl font-display font-bold text-white">
                {isWavePage ? "Choose the skill you want to train" : "Choose a Geometry Dash spam drill"}
              </h2>
            </div>
            <p className="text-xs text-slate-500">Presets set difficulty, Mini Wave and Endless Mode for you.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
            {WAVE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyWavePreset(preset.id)}
                aria-pressed={wavePreset === preset.id}
                disabled={gameStatus === GameStatus.Playing}
                className={
                  "min-w-[156px] shrink-0 rounded-xl border p-3 text-left transition-colors disabled:opacity-40 md:min-w-0 " +
                  (wavePreset === preset.id
                    ? "border-blue-400/60 bg-blue-500/15 text-white"
                    : "border-white/10 bg-black/20 text-slate-400 hover:border-white/20 hover:text-white")
                }
              >
                <span className="block text-sm font-bold">{preset.label}</span>
                <span className="mt-1 block text-[11px] leading-4 text-slate-500">{preset.description}</span>
              </button>
            ))}
          </div>
        </section>

      <DifficultySelector 
        currentDifficulty={difficulty} 
        onSelect={handleDifficultySelect} 
        disabled={gameStatus === GameStatus.Playing}
      />

      {/* Mode Toggles */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-6 relative z-10">
        {/* Endless Toggle */}
        <button
            onClick={toggleEndless}
            aria-pressed={isEndless}
            disabled={gameStatus === GameStatus.Playing}
            className={`
                group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
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
            aria-pressed={isMini}
            disabled={gameStatus === GameStatus.Playing}
            className={`
                group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
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
      {!isWavePage && (
      <div className="w-full max-w-5xl mt-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
                      <Star className="w-6 h-6" />
                  </div>
                  <div>
                      <div className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-1">Practice Drill</div>
                      <h3 className="text-xl font-display font-bold text-white mb-1">15-Second Mini Wave Drill</h3>
                      <p className="text-slate-400 text-sm max-w-md">
                          Practice goal: Survive <span className="text-white font-bold">15 seconds</span> on <span className="text-white font-bold">Insane</span> difficulty using <span className="text-white font-bold">Mini Wave</span>.
                      </p>
                  </div>
              </div>

              <div className="flex flex-col items-center relative z-10">
                  <button 
                    onClick={() => {
                        setDifficulty(Difficulty.Insane);
                        setIsMini(true);
                        setIsEndless(false);
                        setWavePreset('mini');
                        setGameStatus(GameStatus.Idle);
                        localStorage.setItem('gd_spam_last_difficulty', Difficulty.Insane);
                        localStorage.setItem('gd_spam_mini_mode', 'true');
                        localStorage.setItem('gd_spam_endless_mode', 'false');
                        document.getElementById('spam-test-tool')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-lg shadow-yellow-900/20 transition-all flex items-center gap-2"
                  >
                      <Star className="w-4 h-4 fill-current" />
                      ACCEPT CHALLENGE
                  </button>
              </div>
          </div>
      </div>
      )}

    </div>
  );
};

export default WaveSimulator;
