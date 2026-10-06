"use client";

import React, { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Brain, Play, Trophy } from 'lucide-react';
import { usePersistentBestNumber } from '../lib/usePersistentBestNumber';
import { useManagedTimeout } from '../lib/useManagedTimeout';

type MemoryTestRuntime = typeof import('../lib/memoryTestRuntime');

const VisualMemoryGameOver = dynamic(() => import('./VisualMemoryGameOver'), { ssr: false });
const VisualMemoryGrid = dynamic(() => import('./VisualMemoryGrid'), { ssr: false });


export default function VisualMemoryTest() {
    const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'finished' | 'failed'>('idle');
    const [level, setLevel] = useState(1);
    const [bestScore, commitBestScore] = usePersistentBestNumber('visualMemoryBest');
    const [strikes, setStrikes] = useState(0);
    const [gridSize, setGridSize] = useState(3); // 3x3 initially
    const [activeSquares, setActiveSquares] = useState<number[]>([]);
    const [clickedSquares, setClickedSquares] = useState<number[]>([]);
    const [missedSquares, setMissedSquares] = useState<number[]>([]); // To show red when wrong
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

    const startLevel = useCallback((currentLevel: number) => {
        void ensureRuntime().then((runtime) => {
            if (!runtime) return;
            const next = runtime.generateVisualLevel(currentLevel);
            setGridSize(next.gridSize);
            setActiveSquares(next.activeSquares);
            setClickedSquares([]);
            setMissedSquares([]);
            setGameState('showing');

            scheduleTimeout(() => {
                setGameState('playing');
            }, next.revealMs);
        });
    }, [ensureRuntime, scheduleTimeout]);

    const startGame = () => {
        clearTimeout();
        setLevel(1);
        setStrikes(0);
        startLevel(1);
    };

    const handleSquareClick = (index: number) => {
        if (gameState !== 'playing') return;
        if (clickedSquares.includes(index) || missedSquares.includes(index)) return;
        
        if (activeSquares.includes(index)) {
            // Correct
            const newClicked = [...clickedSquares, index];
            setClickedSquares(newClicked);
            
            if (newClicked.length === activeSquares.length) {
                // Level complete
                setGameState('finished'); // Temp intermediate state
                scheduleTimeout(() => {
                    const nextLevel = level + 1;
                    setLevel(nextLevel);
                    startLevel(nextLevel);
                }, 800);
            }
        } else {
            // Wrong
            setMissedSquares(prev => [...prev, index]);
            setStrikes(prev => prev + 1);
            
            // Show all correct ones to user
            setGameState('failed');
            scheduleTimeout(() => {
                if (strikes + 1 >= 3) {
                    setGameState('idle');
                    commitBestScore(level);
                } else {
                    startLevel(level);
                }
            }, 1500);
        }
    };


    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-1/2 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="w-full mb-8 flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                        <div className="flex-1">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Level</div>
                            <div className="text-4xl md:text-5xl font-display font-bold text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                                {gameState === 'idle' && strikes >= 3 ? "Game Over" : level}
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

                    <div className="w-full min-h-[400px] flex flex-col items-center justify-center transition-all duration-300 relative">
                        {gameState === 'idle' && strikes === 0 && (
                            <div className="text-center text-slate-500 flex flex-col items-center max-w-sm">
                                <Brain className="w-16 h-16 mb-4 text-fuchsia-500" />
                                <h3 className="text-3xl font-display font-bold text-white mb-4">Visual Memory</h3>
                                {bestScore !== null && (
                                    <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-full font-bold border border-yellow-400/20 shadow-lg">
                                        <Trophy className="w-5 h-5" /> Best Level: {bestScore}
                                    </div>
                                )}
                                <p className="text-slate-400 mb-8">
                                    Memorize the white squares. Once they turn blue, click the ones you remember. The grid gets larger as you progress.
                                </p>
                                <button
                                    onPointerEnter={preloadRuntime}
                                    onPointerDown={preloadRuntime}
                                    onFocus={preloadRuntime}
                                    onClick={startGame}
                                    className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                                >
                                    <Play className="w-5 h-5" /> Start Test
                                </button>
                            </div>
                        )}

                        {gameState === 'idle' && strikes >= 3 && (
                            <VisualMemoryGameOver level={level} bestScore={bestScore} onRestart={startGame} />
                        )}

                        {gameState !== 'idle' && (
                            <VisualMemoryGrid
                                gameState={gameState}
                                gridSize={gridSize}
                                activeSquares={activeSquares}
                                clickedSquares={clickedSquares}
                                missedSquares={missedSquares}
                                onSquareClick={handleSquareClick}
                            />
                        )}
                    </div>
                </div>
            </div>
</div>
    );
}
