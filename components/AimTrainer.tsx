"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from "next/dynamic";

const RelatedTools = dynamic(() => import('./RelatedTools'), { ssr: true });
import { RotateCcw, Target, Trophy, Volume2, VolumeX, Share2, Check } from 'lucide-react';

const playSound = (audioCtx: AudioContext | null, type: 'hit' | 'miss') => {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type === 'hit' ? 'square' : 'sawtooth';
    oscillator.frequency.setValueAtTime(type === 'hit' ? 600 : 150, audioCtx.currentTime);
    if (type === 'hit') {
       oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    } else {
       oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
    }
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (type === 'hit' ? 0.05 : 0.1));
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + (type === 'hit' ? 0.05 : 0.1));
};

export default function AimTrainer() {
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
    
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [copied, setCopied] = useState(false);
    
    const clickTimes = useRef<number[]>([]);
    const lastClickTime = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioCtxRef.current = new AudioContextClass();
            }
            const saved = localStorage.getItem('aimTrainerBest');
            if (saved) {
                try { setBestScore(parseInt(saved, 10)); } catch(e) {}
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const generateTarget = () => {
        // Generate random coordinates between 10% and 90% to keep target fully visible
        const x = Math.floor(Math.random() * 80) + 10;
        const y = Math.floor(Math.random() * 80) + 10;
        setTargetPos({ x, y });
    };

    const startGame = () => {
        setIsActive(true);
        setIsFinished(false);
        setScore(0);
        setMisses(0);
        setTimeLeft(30);
        clickTimes.current = [];
        lastClickTime.current = Date.now();
        generateTarget();

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const endGame = () => {
        setIsActive(false);
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
        
        setScore(currentScore => {
             setBestScore(prevBest => {
                 if (prevBest === null || currentScore > prevBest) {
                     localStorage.setItem('aimTrainerBest', currentScore.toString());
                     return currentScore;
                 }
                 return prevBest;
             });
             return currentScore;
        });
    };

    const handleTargetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isActive || isFinished) return;
        
        if (soundEnabled && audioCtxRef.current) {
            if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
            playSound(audioCtxRef.current, 'hit');
        }
        
        const now = Date.now();
        const reactionTime = now - lastClickTime.current;
        clickTimes.current.push(reactionTime);
        lastClickTime.current = now;

        setScore(prev => prev + 1);
        generateTarget();
    };

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (!isActive || isFinished) return;
        
        if (soundEnabled && audioCtxRef.current) {
            if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
            playSound(audioCtxRef.current, 'miss');
        }
        
        setMisses(prev => prev + 1);
    };

    const resetGame = () => {
        setIsActive(false);
        setIsFinished(false);
        setScore(0);
        setMisses(0);
        setTimeLeft(30);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const totalClicks = score + misses;
    const accuracy = totalClicks > 0 ? ((score / totalClicks) * 100).toFixed(1) : '0.0';
    const averageTime = clickTimes.current.length > 0
        ? Math.round(clickTimes.current.reduce((a, b) => a + b, 0) / clickTimes.current.length)
        : 0;

    const shareScore = async () => {
        const text = `I got a score of ${score} with ${accuracy}% accuracy on the Geometry Dash Aim Trainer!`;
        const url = `https://geometrydashspam.cc/aim-trainer`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: 'Aim Trainer Test', text, url });
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="flex w-full justify-between items-center mb-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                        <div className="text-center">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Time Left</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-white">{timeLeft}s</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Score</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-cyan-400">{score}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Accuracy</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-white">{accuracy}%</div>
                        </div>
                        <div className="text-center hidden md:block">
                            <button 
                              onClick={() => setSoundEnabled(!soundEnabled)}
                              className={`p-2 rounded-xl border transition-colors ${soundEnabled ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-600/30' : 'bg-slate-800 border-white/10 text-slate-500 hover:text-slate-300'}`}
                              title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
                            >
                               {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="w-full flex justify-between items-center mb-4 px-2">
                         {bestScore !== null ? (
                             <div className="flex items-center gap-2 text-sm text-slate-400">
                                 <Trophy className="w-4 h-4 text-yellow-500" />
                                 Best Score: <strong className="text-white">{bestScore}</strong>
                             </div>
                         ) : <div></div>}
                         <div className="md:hidden">
                            <button 
                              onClick={() => setSoundEnabled(!soundEnabled)}
                              className={`p-1.5 rounded-lg border transition-colors ${soundEnabled ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400' : 'bg-slate-800 border-white/10 text-slate-500'}`}
                            >
                               {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {!isActive && !isFinished ? (
                        <button
                            onClick={startGame}
                            className="w-full h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 group select-none bg-cyan-900/10 border-cyan-500/20 hover:bg-cyan-800/20 hover:border-cyan-500/30"
                        >
                            <Target className="w-16 h-16 md:w-20 md:h-20 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                            <div className="text-center">
                                <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-300 group-hover:text-white transition-colors">
                                    Start Aim Trainer
                                </h3>
                                <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto px-4">
                                    Click the targets as fast as you can. Any clicks outside the target count as a miss. Test your mouse precision!
                                </p>
                            </div>
                        </button>
                    ) : isActive ? (
                        <div 
                            className="w-full h-80 bg-slate-900/40 border border-white/5 rounded-3xl relative overflow-hidden cursor-crosshair"
                            onClick={handleBackgroundClick}
                        >
                            <div 
                                className="absolute w-12 h-12 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] cursor-pointer flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                                onMouseDown={handleTargetClick}
                            >
                                <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full animate-in zoom-in-95 duration-500">
                            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                                <h3 className="text-2xl text-cyan-200 font-bold mb-2">Trainer Complete!</h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Score</div>
                                        <div className="text-3xl font-bold text-cyan-400">{score}</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Misses</div>
                                        <div className="text-3xl font-bold text-rose-400">{misses}</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Accuracy</div>
                                        <div className="text-3xl font-bold text-white">{accuracy}%</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Avg Time</div>
                                        <div className="text-3xl font-bold text-yellow-400">{averageTime}ms</div>
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={resetGame}
                                        className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-cyan-600/20"
                                    >
                                        <RotateCcw className="w-5 h-5" /> Try Again
                                    </button>
                                    <button
                                        onClick={shareScore}
                                        className="px-5 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors flex items-center justify-center border border-white/10"
                                        title="Share your score"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <RelatedTools currentTool="aim" />
        </div>
    );
}
