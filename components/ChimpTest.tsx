"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { Target, RotateCcw, BrainCircuit, Play, Trophy, Share2, Check } from 'lucide-react';

export default function ChimpTest() {
    const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'finished' | 'failed'>('idle');
    const [level, setLevel] = useState(4); // Starts at 4 numbers
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const [numbers, setNumbers] = useState<{ id: number, val: number, x: number, y: number, hidden: boolean, clicked: boolean }[]>([]);
    const [nextExpected, setNextExpected] = useState(1);
    const [strikes, setStrikes] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('chimpBestScore');
        if (saved) {
            try { setBestScore(parseInt(saved, 10)); } catch(e) {}
        }
    }, []);

    const generateLevel = (currentLevel: number) => {
        // Grid is approx 8x5
        const cols = 8;
        const rows = 5;
        const totalCells = cols * rows;
        
        let availablePositions = Array.from(Array(totalCells).keys());
        
        // Shuffle positions
        for (let i = availablePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
        }
        
        const selected = availablePositions.slice(0, currentLevel);
        const newNumbers = selected.map((pos, index) => {
            return {
                id: pos,
                val: index + 1,
                x: pos % cols,
                y: Math.floor(pos / cols),
                hidden: false,
                clicked: false
            };
        });
        
        setNumbers(newNumbers);
        setNextExpected(1);
        setGameState('showing');
    };

    const startGame = () => {
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
                const currentBest = localStorage.getItem('chimpBestScore');
                if (!currentBest || level > parseInt(currentBest, 10)) {
                    localStorage.setItem('chimpBestScore', level.toString());
                    setBestScore(level);
                }

                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    generateLevel(level + 1);
                }, 500);
            } else {
                setNextExpected(prev => prev + 1);
            }
        } else {
            // Wrong click
            setStrikes(prev => prev + 1);
            setGameState('failed');
            // Unhide everything to show them what they missed
            setNumbers(prev => prev.map(n => ({...n, hidden: false})));
        }
    };

    const retryLevel = () => {
        if (strikes >= 3) {
            setGameState('finished');
        } else {
            generateLevel(level);
        }
    };

    const shareScore = async () => {
        const text = `I reached Level ${level} on the Geometry Dash Chimp Test! Am I smarter than a chimp?`;
        const url = `https://geometrydashspam.cc/chimp-test`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: 'Chimp Memory Test', text, url });
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
                                    Click the numbers in sequential order. After you click '1', the remaining numbers will hide. Can you beat the memory of a chimpanzee?
                                </p>
                                <button
                                    onClick={startGame}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                                >
                                    <Play className="w-5 h-5" /> Start Trial
                                </button>
                            </div>
                        )}

                        {gameState === 'finished' && (
                            <div className="text-center animate-in zoom-in-95 duration-500">
                                <h3 className="text-3xl font-bold text-red-400 mb-2">GAME OVER</h3>
                                <p className="text-white text-xl mb-4">You reached Level {level}</p>
                                {bestScore !== null && (
                                    <div className="flex items-center justify-center gap-2 mb-6 text-yellow-400 font-bold">
                                        <Trophy className="w-4 h-4" /> Personal Best: {bestScore}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 justify-center">
                                    <button
                                        onClick={startGame}
                                        className="px-8 py-3 bg-white hover:bg-slate-200 text-indigo-900 font-bold rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg"
                                    >
                                        <RotateCcw className="w-5 h-5" /> Play Again
                                    </button>
                                    <button
                                        onClick={shareScore}
                                        className="p-3 bg-indigo-900/50 text-white rounded-lg flex items-center justify-center hover:bg-indigo-800 transition-colors border border-indigo-500/30"
                                        title="Share your score"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
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
                            <div className="relative w-full max-w-[600px] aspect-[8/5] bg-black/20 rounded-xl overflow-hidden border border-white/5">
                                {numbers.map((n) => {
                                    if (n.clicked) return null; // Hide clicked blocks
                                    return (
                                        <button
                                            key={n.id}
                                            onClick={() => handleNumberClick(n.val)}
                                            style={{
                                                left: `${(n.x / 8) * 100}%`,
                                                top: `${(n.y / 5) * 100}%`,
                                                width: `${100 / 8}%`,
                                                height: `${100 / 5}%`
                                            }}
                                            className="absolute flex items-center justify-center p-1"
                                            disabled={gameState === 'failed'}
                                        >
                                            <div className={`w-full h-full flex items-center justify-center rounded-lg shadow-md font-display font-medium text-xl md:text-2xl transition-all duration-150 border active:scale-95
                                                ${n.hidden 
                                                    ? 'bg-indigo-600/90 border-indigo-400/30 text-transparent' 
                                                    : 'bg-white border-white text-indigo-900 hover:bg-slate-100'}
                                                ${gameState === 'failed' && 'bg-red-500/20 border-red-500 text-white'}
                                            `}>
                                                {!n.hidden && n.val}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <RelatedTools currentTool="aimTrainer" />
        </div>
    );
}
