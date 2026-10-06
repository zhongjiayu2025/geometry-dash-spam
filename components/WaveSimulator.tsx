
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Difficulty, GameStatus } from '../types';
import { DIFFICULTY_CONFIGS } from '../constants';
import DifficultySelector from './DifficultySelector';
import { Infinity as InfinityIcon, Minimize2 } from 'lucide-react';
import { readStorage, writeStorage } from '../lib/browserStorage';

const WavePracticeDrill = dynamic(() => import('./WavePracticeDrill'), { ssr: false });

const GameCanvas = dynamic(() => import('./GameCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[330px] w-full max-w-5xl items-center justify-center rounded-lg border border-white/10 bg-slate-950 text-sm text-slate-500 sm:h-auto sm:aspect-video md:h-[500px]"
      role="status"
      aria-live="polite"
    >
      Loading Geometry Dash wave trainer…
    </div>
  ),
});

interface WaveSimulatorProps {
  variant?: 'spam' | 'wave';
}

type WavePreset = 'normal' | 'mini' | 'spam' | 'precision' | 'endless';
type WavePresetState = WavePreset | 'custom';

const WAVE_PRESETS: Array<{
  id: WavePreset;
  label: string;
  description: string;
  difficulty: Difficulty;
  mini: boolean;
  endless: boolean;
}> = [
  { id: 'normal', label: 'Normal Wave', description: 'Balanced wave control practice.', difficulty: Difficulty.Hard, mini: false, endless: false },
  { id: 'mini', label: 'Mini Wave', description: 'Faster vertical movement with tighter corrections.', difficulty: Difficulty.Insane, mini: true, endless: false },
  { id: 'spam', label: 'Wave Spam', description: 'Rapid repeated inputs with a demanding pace.', difficulty: Difficulty.EasyDemon, mini: true, endless: false },
  { id: 'precision', label: 'Precision', description: 'Narrower high-difficulty control practice.', difficulty: Difficulty.ExtremeDemon, mini: false, endless: false },
  { id: 'endless', label: 'Endless', description: 'Survive as long as possible and chase a local best.', difficulty: Difficulty.Hard, mini: false, endless: true },
];

const persistWaveSettings = (difficulty: Difficulty, mini: boolean, endless: boolean) => {
  writeStorage('gd_spam_last_difficulty', difficulty);
  writeStorage('gd_spam_mini_mode', String(mini));
  writeStorage('gd_spam_endless_mode', String(endless));
};

const WaveSimulator: React.FC<WaveSimulatorProps> = ({ variant = 'spam' }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [isEndless, setIsEndless] = useState(false);
  const [isMini, setIsMini] = useState(false);
  
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Idle);
  const [wavePreset, setWavePreset] = useState<WavePresetState>('custom');
  const isWavePage = variant === 'wave';

  useEffect(() => {
    const savedDifficulty = readStorage('gd_spam_last_difficulty');
    if (savedDifficulty && Object.values(Difficulty).includes(savedDifficulty as Difficulty)) {
      setDifficulty(savedDifficulty as Difficulty);
    }

    setIsEndless(readStorage('gd_spam_endless_mode') === 'true');
    setIsMini(readStorage('gd_spam_mini_mode') === 'true');
  }, []);

  const handleDifficultySelect = useCallback((newDiff: Difficulty) => {
    setDifficulty(newDiff);
    setWavePreset('custom');
    setGameStatus(GameStatus.Idle);
    writeStorage('gd_spam_last_difficulty', newDiff);
  }, []);

  const toggleEndless = () => {
    const newState = !isEndless;
    setIsEndless(newState);
    setWavePreset('custom');
    writeStorage('gd_spam_endless_mode', String(newState));
    setGameStatus(GameStatus.Idle);
  };

  const toggleMini = () => {
    const newState = !isMini;
    setIsMini(newState);
    setWavePreset('custom');
    writeStorage('gd_spam_mini_mode', String(newState));
    setGameStatus(GameStatus.Idle);
  };

  const applyWavePreset = useCallback((presetId: WavePreset) => {
    if (gameStatus === GameStatus.Playing) return;

    const preset = WAVE_PRESETS.find(({ id }) => id === presetId);
    if (!preset) return;

    setWavePreset(preset.id);
    setDifficulty(preset.difficulty);
    setIsMini(preset.mini);
    setIsEndless(preset.endless);
    persistWaveSettings(preset.difficulty, preset.mini, preset.endless);
    setGameStatus(GameStatus.Idle);
  }, [gameStatus]);

  const currentConfig = DIFFICULTY_CONFIGS[difficulty];

  const acceptPracticeDrill = () => {
    setDifficulty(Difficulty.Insane);
    setIsMini(true);
    setIsEndless(false);
    setWavePreset('mini');
    setGameStatus(GameStatus.Idle);
    persistWaveSettings(Difficulty.Insane, true, false);
    document.getElementById('spam-test-tool')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
      
      {!isWavePage && <WavePracticeDrill onAccept={acceptPracticeDrill} />}

    </div>
  );
};

export default WaveSimulator;
