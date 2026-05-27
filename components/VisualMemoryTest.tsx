"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));
import { Brain, RotateCcw, Play, Trophy, Share2, Check } from 'lucide-react';


export default function VisualMemoryTest() {
    const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'finished' | 'failed'>('idle');
    const [level, setLevel] = useState(1);
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const [strikes, setStrikes] = useState(0);
    const [gridSize, setGridSize] = useState(3); // 3x3 initially
    const [activeSquares, setActiveSquares] = useState<number[]>([]);
    const [clickedSquares, setClickedSquares] = useState<number[]>([]);
    const [missedSquares, setMissedSquares] = useState<number[]>([]); // To show red when wrong
    
    // Level formula: active squares = level + 2
    // Grid size increases gradually
    
    useEffect(() => {
        const saved = localStorage.getItem('visualMemoryBest');
        if (saved) {
            try { setBestScore(parseInt(saved, 10)); } catch(e) {}
        }
    }, []);

    const startLevel = (currentLevel: number) => {
        let currentGridSize = 3;
        if (currentLevel >= 3) currentGridSize = 4;
        if (currentLevel >= 7) currentGridSize = 5;
        if (currentLevel >= 12) currentGridSize = 6;
        if (currentLevel >= 20) currentGridSize = 7;
        
        setGridSize(currentGridSize);
        
        const numActive = currentLevel + 2;
        const totalSquares = currentGridSize * currentGridSize;
        
        const newActive: number[] = [];
        while (newActive.length < numActive) {
            const r = Math.floor(Math.random() * totalSquares);
            if (!newActive.includes(r)) {
                newActive.push(r);
            }
        }
        
        setActiveSquares(newActive);
        setClickedSquares([]);
        setMissedSquares([]);
        setGameState('showing');
        
        // Hide after some time depending on grid size
        setTimeout(() => {
            setGameState('playing');
        }, Math.max(1000, 1500 - (currentLevel * 20))); // Gradually gets slightly faster, but minimum 1s
    };

    const startGame = () => {
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
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    startLevel(level + 1);
                }, 800);
            }
        } else {
            // Wrong
            setMissedSquares(prev => [...prev, index]);
            setStrikes(prev => prev + 1);
            
            // Show all correct ones to user
            setGameState('failed');
            setTimeout(() => {
                if (strikes + 1 >= 3) {
                    // Game Over
                    setGameState('idle');
                    // Store best score
                    setBestScore(prev => {
                        if (prev === null || level > prev) {
                            localStorage.setItem('visualMemoryBest', level.toString());
                            return level;
                        }
                        return prev;
                    });
                } else {
                    // Retry level
                    startLevel(level);
                }
            }, 1500);
        }
    };

    const shareScore = async () => {
        const text = `I reached Level ${level} on the Geometry Dash Visual Memory Test! Can you beat me?`;
        const url = `https://geometrydashspam.cc/visual-memory`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: 'Visual Memory Test', text, url });
            } catch(e) { console.log(e); }
        } else {
            navigator.clipboard.writeText(`${text} ${url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
                                    onClick={startGame}
                                    className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                                >
                                    <Play className="w-5 h-5" /> Start Test
                                </button>
                            </div>
                        )}

                        {gameState === 'idle' && strikes >= 3 && (
                            <div className="text-center animate-in zoom-in-95 duration-500">
                                <h3 className="text-3xl font-bold text-red-400 mb-2">OUT OF CHANCES</h3>
                                <p className="text-white text-xl mb-6">You survived to Level {level}</p>
                                {bestScore !== null && (
                                    <div className="flex items-center justify-center gap-2 mb-6 text-yellow-400 font-bold">
                                        <Trophy className="w-4 h-4" /> Personal Best: {bestScore}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 justify-center">
                                    <button
                                        onClick={startGame}
                                        className="px-8 py-3 bg-white hover:bg-slate-200 text-fuchsia-900 font-bold rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg"
                                    >
                                        <RotateCcw className="w-5 h-5" /> Try Again
                                    </button>
                                    <button
                                        onClick={shareScore}
                                        className="p-3 bg-fuchsia-900/50 text-white rounded-lg flex items-center justify-center hover:bg-fuchsia-800 transition-colors border border-fuchsia-500/30"
                                        title="Share your score"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {gameState !== 'idle' && (
                            <div 
                                className="grid gap-2 p-2 bg-slate-900 rounded-2xl border border-white/10"
                                style={{ 
                                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                                    width: '100%',
                                    maxWidth: `${Math.max(300, gridSize * 80)}px`
                                }}
                            >
                                {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                                    const isActive = activeSquares.includes(i);
                                    const isClicked = clickedSquares.includes(i);
                                    const isMissed = missedSquares.includes(i);
                                    
                                    let bgColor = 'bg-slate-800'; // Default
                                    
                                    if (gameState === 'showing' && isActive) {
                                        bgColor = 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]'; // Flash white
                                    } else if (gameState === 'failed') {
                                        if (isActive && !isClicked) bgColor = 'bg-white/50 border border-white'; // Reveal missed
                                        if (isClicked) bgColor = 'bg-fuchsia-500'; // Correctly clicked
                                        if (isMissed) bgColor = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'; // Wrongly clicked
                                    } else if (isClicked) {
                                        bgColor = 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]'; // Reveal correct
                                    } else if (isMissed) {
                                        bgColor = 'bg-red-500'; // Show mistake temporarily (if not failed yet)
                                    } else {
                                        bgColor = 'bg-slate-800 hover:bg-slate-700 cursor-pointer border border-white/5'; // Playable state
                                    }
                                    
                                    // If playing, we don't show active squares, they are hidden in 'slate-800'
                                    
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => handleSquareClick(i)}
                                            className={`aspect-square rounded-xl transition-all duration-300 ${bgColor} ${gameState === 'playing' ? 'active:scale-95' : ''}`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <RelatedTools currentTool="visualMemory" />
        </div>
    );
}
