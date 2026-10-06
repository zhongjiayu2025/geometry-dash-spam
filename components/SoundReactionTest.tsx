"use client";

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Volume2, Ear } from 'lucide-react';
import type { ClickSoundEngine } from '../lib/clickSound';

export default function SoundReactionTest() {
    const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [bestTime, setBestTime] = useState<number | null>(null);
    const [earlyClick, setEarlyClick] = useState(false);

    const startTimeRef = useRef<number>(0);
    const timeoutRef = useRef<number | null>(null);
    const audioEngineRef = useRef<ClickSoundEngine | null>(null);
    const audioLoadRef = useRef<Promise<ClickSoundEngine | null> | null>(null);
    const audioDisposedRef = useRef(false);

    useEffect(() => {
        const saved = localStorage.getItem('soundReactionBest');
        if (saved) {
            const parsed = Number(saved);
            if (Number.isFinite(parsed)) setBestTime(parsed);
        }

        return () => {
            audioDisposedRef.current = true;
            const engine = audioEngineRef.current;
            audioEngineRef.current = null;
            if (engine) void engine.destroy();
        };
    }, []);

    const ensureAudio = useCallback(async () => {
        if (audioDisposedRef.current) return null;

        if (audioEngineRef.current) {
            await audioEngineRef.current.resume();
            return audioEngineRef.current;
        }

        if (!audioLoadRef.current) {
            audioLoadRef.current = import('../lib/clickSound')
                .then(({ createClickSoundEngine }) => createClickSoundEngine())
                .catch(() => null);
        }

        const engine = await audioLoadRef.current;
        if (!engine) return null;

        if (audioDisposedRef.current) {
            await engine.destroy();
            return null;
        }

        audioEngineRef.current = engine;
        await engine.resume();
        return engine;
    }, []);

    const createBeep = useCallback(() => {
        const engine = audioEngineRef.current;
        if (engine) {
            engine.play('soundReaction');
        } else {
            void ensureAudio().then((loadedEngine) => loadedEngine?.play('soundReaction'));
        }
    }, [ensureAudio]);

    const startTest = () => {
        void ensureAudio();
        
        setGameState('waiting');
        setEarlyClick(false);
        setReactionTime(null);

        // Random delay between 2 and 5 seconds
        const delay = Math.floor(Math.random() * 3000) + 2000;
        
        timeoutRef.current = window.setTimeout(() => {
            setGameState('ready');
            startTimeRef.current = performance.now();
            createBeep();
        }, delay);
    };

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
        // Prevent default for touch or spacebar
        if (e.type === 'touchstart' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === ' ')) {
            e.preventDefault();
        }

        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== ' ') {
            return;
        }

        if (gameState === 'idle' || gameState === 'result') {
            startTest();
        } else if (gameState === 'waiting') {
            // Clicked too early
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setEarlyClick(true);
            setGameState('result');
        } else if (gameState === 'ready') {
            // Valid reaction
            const endTime = performance.now();
            const time = Math.round(endTime - startTimeRef.current);
            setReactionTime(time);
            
            if (bestTime === null || time < bestTime) {
                setBestTime(time);
                localStorage.setItem('soundReactionBest', time.toString());
            }
            
            setGameState('result');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ' && document.activeElement?.tagName !== 'BUTTON') {
                handleInteraction(e as any);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [gameState]); // Re-bind when game state changes

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="flex w-full justify-center gap-8 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center">
                        <div>
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Previous Time</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-white">{reactionTime ? `${reactionTime}ms` : '--'}</div>
                        </div>
                        <div className="w-px bg-white/10"></div>
                        <div>
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Best Time</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-violet-400">{bestTime ? `${bestTime}ms` : '--'}</div>
                        </div>
                    </div>

                    <div
                        onPointerDown={(event) => handleInteraction(event as any)}
                        className={`
                            touch-none w-full h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 select-none cursor-pointer
                            ${gameState === 'idle' ? 'bg-violet-900/10 border-violet-500/20 hover:bg-violet-800/20 hover:border-violet-500/30' : ''}
                            ${gameState === 'waiting' ? 'bg-amber-900/40 border-amber-500/40' : ''}
                            ${gameState === 'ready' ? 'bg-green-600/40 border-green-400/50' : ''}
                            ${gameState === 'result' && !earlyClick ? 'bg-violet-900/20 border-violet-500/40' : ''}
                            ${gameState === 'result' && earlyClick ? 'bg-rose-900/20 border-rose-500/40' : ''}
                        `}
                    >
                        {gameState === 'idle' && (
                            <>
                                <Ear className="w-20 h-20 text-violet-500/50" />
                                <div className="text-center">
                                    <h3 className="text-3xl font-display font-bold text-slate-300">Start Audio Test</h3>
                                    <p className="text-slate-500 mt-2 px-4 max-w-sm mx-auto">Click anywhere or press Space when you hear the beep.</p>
                                </div>
                            </>
                        )}

                        {gameState === 'waiting' && (
                            <div className="text-center animate-pulse">
                                <Volume2 className="w-20 h-20 text-amber-500/50 mx-auto mb-4" />
                                <h3 className="text-3xl font-display font-bold text-amber-400">Wait for the sound...</h3>
                            </div>
                        )}

                        {gameState === 'ready' && (
                            <div className="text-center font-display font-bold text-white">
                                <h3 className="text-6xl drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">CLICK!</h3>
                            </div>
                        )}

                        {gameState === 'result' && (
                            <div className="text-center animate-in zoom-in-95 duration-300">
                                {earlyClick ? (
                                    <>
                                        <h3 className="text-3xl font-display font-bold text-rose-400 mb-2">Too Early!</h3>
                                        <p className="text-slate-400">You must wait for the sound.</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-6xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] mb-2">
                                            {reactionTime} <span className="text-2xl text-violet-400">ms</span>
                                        </div>
                                        <p className="text-slate-400 mt-2">Click to try again</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
</div>
    );
}
