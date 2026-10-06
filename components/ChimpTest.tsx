"use client";

import React, { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { BrainCircuit, Play, Trophy } from 'lucide-react';
import { usePersistentBestNumber } from '../lib/usePersistentBestNumber';
import { useManagedTimeout } from '../lib/useManagedTimeout';
import type { ChimpNumber } from '../lib/memoryTestRuntime';

type MemoryTestRuntime = typeof import('../lib/memoryTestRuntime');

const ChimpGameOver = dynamic(() => import('./ChimpGameOver'), { ssr: false });
const ChimpBoard = dynamic(() => import('./ChimpBoard'), { ssr: false });

export default function ChimpTest() {
    const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'finished' | 'failed'>('idle');
    const [level, setLevel] = useState(4); // Starts at 4 numbers
    const [bestScore, commitBestScore] = usePersistentBestNumber('chimpBestScore');
    const [numbers, setNumbers] = useState<ChimpNumber[]>([]);
    const [nextExpected, setNextExpected] = useState(1);
    const [strikes, setStrikes] = useState(0);
    const { schedule: scheduleTimeout, clear: clearTimeout } = useManagedTimeout();
    const runtimeRef = useRef<MemoryTestRuntime | null>(null);
    const runtimeLoadRef = useRef<Promise<MemoryTestRuntime | null> | null>(null);

    const ensureRuntime = useCallback(async () => {
        if (runtimeRef.current) return runtimeRef.current;
        if (!runtimeLoadRef.current) {
            runtimeLoadRef.current = import('../lib/memoryTestRuntime').catch(() => null);
        }
        const runtime = await runtimeLoadRef.current;
        if (runtime) runtimeRef.current = runtime;
        return runtime;
    }, []);

    const preloadRuntime = useCallback(() => {
        void ensureRuntime();
    }, [ensureRuntime]);

    const generateLevel = useCallback((currentLevel: number) => {
        if (currentLevel > 40) {
            commitBestScore(40);
            setGameState('finished');
            return;
        }

        void ensureRuntime().then((runtime) => {
            if (!runtime) return;
            setNumbers(runtime.generateChimpLevel(currentLevel));
            setNextExpected(1);
            setGameState('showing');
        });
    }, [commitBestScore, ensureRuntime]);

    const startGame = () => {
        clearTimeout();
        setLevel(4);
        setStrikes(0);
        generateLevel(4);
    };

    const handleNumberClick = (val: number) => {
        if (gameState !== 'showing' && gameState !== 'playing') return;

        if (val === nextExpected) {
            // First click hides the numbers
            if (val === 1) {
                setGameState('playing');
                setNumbers(prev => prev.map(n => ({...n, hidden: true})));
            }
            
            // Mark as clicked
            setNumbers(prev => prev.map(n => n.val === val ? {...n, clicked: true} : n));
            
            // Reached end of level
            if (val === level) {
                // Update local storage best score
                commitBestScore(level);

                if (level >= 40) {
                    setGameState('finished');
                    return;
                }

                scheduleTimeout(() => {
                    const nextLevel = level + 1;
                    setLevel(nextLevel);
                    generateLevel(nextLevel);
                }, 500);
            } else {
                setNextExpected(prev => prev + 1);
            }
        } else {
            const nextStrikes = strikes + 1;
            setStrikes(nextStrikes);
            setGameState('failed');
            setNumbers(prev => prev.map(n => ({...n, hidden: false})));

            if (nextStrikes >= 3) {
                scheduleTimeout(() => {
                    setGameState('finished');
                }, 900);
            }
        }
    };

    const retryLevel = () => {
        if (strikes >= 3) {
            setGameState('finished');
        } else {
            generateLevel(level);
        }
    };


    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="w-full mb-8 flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                        <div className="flex-1">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Numbers</div>
                            <div className="text-4xl md:text-5xl font-display font-bold text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                {level}
                            </div>
                        </div>
                        <div className="w-px h-16 bg-white/10 mx-4"></div>
                        <div className="flex-1">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Strikes</div>
                            <div className="flex justify-center gap-2 mt-2">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className={`w-4 h-4 rounded-full ${s <= strikes ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-slate-700'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full min-h-[400px] rounded-3xl border-2 bg-indigo-900/10 border-indigo-500/20 p-4 md:p-8 flex flex-col items-center justify-center transition-all duration-300 relative">
                        {gameState === 'idle' && (
                            <div className="text-center text-slate-500 flex flex-col items-center max-w-sm">
                                <BrainCircuit className="w-16 h-16 mb-4 text-indigo-500" />
                                <h3 className="text-3xl font-display font-bold text-white mb-4">Chimp Test</h3>
                                {bestScore !== null && (
                                    <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-full font-bold border border-yellow-400/20 shadow-lg">
                                        <Trophy className="w-5 h-5" /> Best Level: {bestScore}
                                    </div>
                                )}
                                <p className="text-slate-400 mb-8">
                                    Click the numbers in sequential order. After you click '1', the remaining numbers will hide. See how many positions you can recall in sequence.
                                </p>
                                <button
                                    onPointerEnter={preloadRuntime}
                                    onPointerDown={preloadRuntime}
                                    onFocus={preloadRuntime}
                                    onClick={startGame}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                                >
                                    <Play className="w-5 h-5" /> Start Trial
                                </button>
                            </div>
                        )}

                        {gameState === 'finished' && (
                            <ChimpGameOver level={level} bestScore={bestScore} onRestart={startGame} />
                        )}
                        
                        {gameState === 'failed' && strikes < 3 && (
                            <div className="text-center animate-in zoom-in-95 duration-300">
                                <h3 className="text-3xl font-bold text-red-400 mb-4">WRONG!</h3>
                                <button
                                    onClick={retryLevel}
                                    className="px-8 py-3 bg-white hover:bg-slate-200 text-indigo-900 font-bold rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg"
                                >
                                    <Play className="w-5 h-5" /> Retry Level
                                </button>
                            </div>
                        )}

                        {(gameState === 'showing' || gameState === 'playing' || (gameState === 'failed' && strikes < 3)) && (
                            <ChimpBoard
                                gameState={gameState}
                                numbers={numbers}
                                onNumberClick={handleNumberClick}
                            />
                        )}
                    </div>
                </div>
            </div>
</div>
    );
}
