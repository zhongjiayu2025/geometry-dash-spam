"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { RotateCcw, MousePointer2 } from 'lucide-react';

export default function DoubleClickTest() {
    const [clicks, setClicks] = useState(0);
    const [doubleClicks, setDoubleClicks] = useState(0);
    const [lastDelta, setLastDelta] = useState<number | null>(null);
    const [history, setHistory] = useState<{ id: number, delta: number, isDouble: boolean }[]>([]);
    
    const lastClickTime = useRef<number>(0);
    const clickIdRef = useRef(0);

    const DBL_CLICK_THRESHOLD = 80; // ms

    const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent double fire on touch devices
        if (e.type === 'touchstart') e.preventDefault();

        const now = performance.now();
        const delta = now - lastClickTime.current;
        lastClickTime.current = now;

        setClicks(prev => prev + 1);

        // If it's the first click, delta will be huge, ignore it
        if (delta > 2000) return;

        const isDouble = delta < DBL_CLICK_THRESHOLD;
        if (isDouble) {
            setDoubleClicks(prev => prev + 1);
        }

        setLastDelta(Math.round(delta));
        clickIdRef.current += 1;

        setHistory(prev => {
            const newHistory = [{ id: clickIdRef.current, delta: Math.round(delta), isDouble }, ...prev];
            return newHistory.slice(0, 50); // Keep last 50
        });
    };

    const resetTest = () => {
        setClicks(0);
        setDoubleClicks(0);
        setLastDelta(null);
        setHistory([]);
        lastClickTime.current = 0;
    };

    const doubleClickRate = clicks > 1 ? ((doubleClicks / (clicks - 1)) * 100).toFixed(1) : '0.0';

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8">
                    
                    <div className="flex-1 flex flex-col items-center">
                        <div className="flex w-full justify-between items-center mb-8 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                            <div className="text-center">
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Clicks</div>
                                <div className="text-2xl font-display font-bold text-white">{clicks}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Double Clicks</div>
                                <div className="text-2xl font-display font-bold text-fuchsia-400">{doubleClicks}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Rate</div>
                                <div className="text-2xl font-display font-bold text-white">{doubleClickRate}%</div>
                            </div>
                        </div>

                        <button
                            onMouseDown={handleClick}
                            onTouchStart={handleClick}
                            className="w-full h-64 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-75 group select-none bg-fuchsia-900/10 border-fuchsia-500/20 hover:bg-fuchsia-800/20 hover:border-fuchsia-500/30"
                        >
                            <MousePointer2 className="w-16 h-16 text-fuchsia-500/50 group-hover:text-fuchsia-400 transition-colors" />
                            <div className="text-center">
                                <h3 className="text-2xl font-display font-bold text-slate-300 group-hover:text-white transition-colors">
                                    Click Here
                                </h3>
                                <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto px-4">
                                    Test your mouse for hardware bounce issues. Clicks under 80ms are marked as double clicks.
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={resetTest}
                            className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset Counters
                        </button>
                    </div>

                    {/* History Feed */}
                    <div className="w-full md:w-64 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden h-96">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/80">
                            <span className="font-bold text-sm uppercase tracking-wider text-slate-400">Time History</span>
                            <span className="text-xs text-slate-500">&lt; 80ms is bad</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 layout-scrollbar space-y-1">
                            {history.length === 0 ? (
                                <div className="text-center mt-10 text-sm text-slate-600">Start clicking...</div>
                            ) : (
                                history.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={`flex justify-between items-center px-4 py-2 rounded-lg text-sm font-mono animate-in fade-in slide-in-from-left-2 duration-300 ${item.isDouble ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-300 hover:bg-white/5'}`}
                                    >
                                        <span>Click #{item.id}</span>
                                        <span className={item.isDouble ? 'font-bold' : ''}>{item.delta} ms</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
            
            <RelatedTools currentTool="doubleClick" />
        </div>
    );
}
