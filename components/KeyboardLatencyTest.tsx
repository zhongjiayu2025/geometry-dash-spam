"use client";

import React, { useState, useEffect, useRef } from 'react';

import { Keyboard, RotateCcw } from 'lucide-react';

type TimingState = {
    shortestPress: number | null;
    averagePress: number | null;
    recentPresses: number[];
    activeKey: string | null;
};

const EMPTY_TIMING: TimingState = {
    shortestPress: null,
    averagePress: null,
    recentPresses: [],
    activeKey: null,
};

export default function KeyboardLatencyTest() {
    const [timing, setTiming] = useState<TimingState>(EMPTY_TIMING);
    const { shortestPress, averagePress, recentPresses, activeKey } = timing;

    const pressTimes = useRef<Map<string, number>>(new Map());
    const allPressDurations = useRef<number[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return; // Ignore hold repetition
            
            // Prevent scrolling
            if ([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)) {
                e.preventDefault();
            }

            setTiming((current) => ({ ...current, activeKey: e.key }));
            pressTimes.current.set(e.code, performance.now());
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const startTime = pressTimes.current.get(e.code);

            if (startTime === undefined) {
                setTiming((current) => ({ ...current, activeKey: null }));
                return;
            }

            const duration = Math.round(performance.now() - startTime);

            allPressDurations.current.push(duration);
            if (allPressDurations.current.length > 100) {
                allPressDurations.current.shift();
            }

            const sum = allPressDurations.current.reduce((a, b) => a + b, 0);
            const average = Math.round(sum / allPressDurations.current.length);

            setTiming((current) => ({
                activeKey: null,
                shortestPress:
                    current.shortestPress === null
                        ? duration
                        : Math.min(current.shortestPress, duration),
                averagePress: average,
                recentPresses: [duration, ...current.recentPresses].slice(0, 15),
            }));

            pressTimes.current.delete(e.code);
        };

        const clearInterruptedPress = () => {
            setTiming((current) => ({ ...current, activeKey: null }));
            pressTimes.current.clear();
        };

        const handleVisibilityChange = () => {
            if (document.hidden) clearInterruptedPress();
        };

        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', clearInterruptedPress);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', clearInterruptedPress);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const resetTest = () => {
        setTiming(EMPTY_TIMING);
        allPressDurations.current = [];
        pressTimes.current.clear();
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8">
                    
                    <div className="flex-1 flex flex-col items-center">
                        <div className="w-full mb-8 grid grid-cols-2 gap-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                            <div>
                                <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Shortest Hold</div>
                                <div className="text-4xl md:text-5xl font-display font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                    {shortestPress !== null ? `${shortestPress}ms` : '--'}
                                </div>
                            </div>
                            <div className="border-l border-white/10">
                                <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Average Hold</div>
                                <div className="text-4xl md:text-5xl font-display font-bold text-white">
                                    {averagePress !== null ? `${averagePress}ms` : '--'}
                                </div>
                            </div>
                        </div>

                        <div className={`w-full h-64 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-100 select-none ${activeKey ? 'bg-yellow-900/20 border-yellow-500/50 scale-[0.98]' : 'bg-slate-900/40 border-white/10'}`}>
                            <Keyboard className={`w-20 h-20 transition-colors ${activeKey ? 'text-yellow-400' : 'text-slate-600'}`} />
                            <div className="text-center">
                                <h3 className={`text-2xl font-display font-bold transition-colors ${activeKey ? 'text-white' : 'text-slate-400'}`}>
                                    {activeKey ? `Key: ${activeKey.toUpperCase()}` : 'Tap and Release Any Key'}
                                </h3>
                                {!activeKey && (
                                    <p className="max-w-xs mx-auto text-sm text-slate-500 mt-2">
                                        Tap and release a key repeatedly, then compare your own hold-duration results on the same device and browser.
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={resetTest}
                            className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    </div>

                    <div className="w-full md:w-64 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden h-96">
                        <div className="p-4 border-b border-white/5 bg-slate-900/80">
                            <span className="font-bold text-sm uppercase tracking-wider text-slate-400">Recent Taps</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 layout-scrollbar space-y-1">
                            {recentPresses.length === 0 ? (
                                <div className="text-center mt-10 text-sm text-slate-600">Start tapping...</div>
                            ) : (
                                recentPresses.map((dur, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center px-4 py-2 rounded-lg text-sm font-mono animate-in fade-in slide-in-from-left-2 duration-300 text-slate-300 hover:bg-white/5"
                                    >
                                        <span>Tap</span>
                                        <span>{dur} ms</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
</div>
    );
}
