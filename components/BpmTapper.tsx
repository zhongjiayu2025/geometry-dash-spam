"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { RotateCcw, Timer } from 'lucide-react';

export default function BpmTapper() {
    const [taps, setTaps] = useState<number[]>([]);
    const [bpm, setBpm] = useState<number>(0);
    const [isActive, setIsActive] = useState(false);
    
    // Auto-reset timeout
    const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTap = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
        // Prevent default for spacebar scrolling or touch double-firing
        if (e.type === 'touchstart' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === ' ')) {
            e.preventDefault();
        }

        // Only accept Spacebar if it's a keyboard event
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== ' ') {
            return;
        }

        const now = Date.now();
        
        setIsActive(true);

        setTaps(prev => {
            // Keep only taps from the last 3 seconds for active BPM calculation
            // to allow BPM to shift if the user changes speed
            let newTaps = [...prev, now];
            if (newTaps.length > 1) {
                // Keep max 10 taps for stability
                if (newTaps.length > 10) {
                    newTaps = newTaps.slice(newTaps.length - 10);
                }
            }
            calculateBpm(newTaps);
            return newTaps;
        });

        // Reset inactivity timer (resets completely after 3 seconds of no tapping)
        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = setTimeout(() => {
            handleReset();
        }, 3000);
    };

    const calculateBpm = (tapArray: number[]) => {
        if (tapArray.length < 2) {
            setBpm(0);
            return;
        }

        let totalDuration = 0;
        for (let i = 1; i < tapArray.length; i++) {
            totalDuration += (tapArray[i] - tapArray[i - 1]);
        }
        
        const averageInterval = totalDuration / (tapArray.length - 1);
        // interval is ms per beat. (60,000 ms per minute) / interval = BPM
        const currentBpm = Math.round(60000 / averageInterval);
        
        // Cap absurd values
        if (currentBpm < 1000) {
           setBpm(currentBpm);
        }
    };

    const handleReset = () => {
        setTaps([]);
        setBpm(0);
        setIsActive(false);
        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };

    useEffect(() => {
        // Global keydown listener for spacebar
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ' && document.activeElement?.tagName !== 'BUTTON' && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault(); // Stop page scrolling
                const syntheticEvent = { type: 'keydown', key: ' ', preventDefault: () => {} } as any;
                handleTap(syntheticEvent);
                
                // Visual feedback on the button
                const btn = document.getElementById('bpm-btn');
                if (btn) {
                    btn.classList.add('bg-rose-600/40', 'scale-[0.98]');
                    setTimeout(() => {
                        btn.classList.remove('bg-rose-600/40', 'scale-[0.98]');
                    }, 100);
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        };
    }, [handleTap]);


    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="w-full mb-8 text-center bg-slate-900/50 p-8 rounded-2xl border border-white/5 relative">
                        <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Estimated BPM</div>
                        <div className="text-7xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-400 to-orange-400 drop-shadow-lg">
                            {bpm > 0 ? bpm : '--'}
                        </div>
                        {isActive && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-rose-400 font-mono animate-pulse">
                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div> Recording
                            </div>
                        )}
                    </div>

                    <button
                        id="bpm-btn"
                        onMouseDown={handleTap}
                        onTouchStart={handleTap}
                        className="w-full h-64 md:h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-75 group select-none bg-rose-900/10 border-rose-500/20 hover:bg-rose-800/20 hover:border-rose-500/30"
                    >
                        <Timer className="w-16 h-16 md:w-20 md:h-20 text-rose-500/50 group-hover:text-rose-400 transition-colors" />
                        <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-300 group-hover:text-white transition-colors">
                                Tap Here or Press Space
                            </h3>
                            <p className="text-slate-500 mt-2 text-sm">
                                Tap continuously to the beat of a song. Resets automatically after 3 seconds of inactivity.
                            </p>
                        </div>
                    </button>
                    
                    <button
                        onClick={handleReset}
                        className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset Manually
                    </button>
                </div>
            </div>
            
            <RelatedTools currentTool="bpm" />
        </div>
    );
}
