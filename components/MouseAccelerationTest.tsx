"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MousePointer2 } from 'lucide-react';

const MouseAccelerationResult = dynamic(() => import('./MouseAccelerationResult'), { ssr: false });

export default function MouseAccelerationTest() {
    const [state, setState] = useState<'start' | 'moveRight' | 'moveLeft' | 'result'>('start');
    const [startX, setStartX] = useState<number | null>(null);
    const [endX, setEndX] = useState<number | null>(null);
    const [returnX, setReturnX] = useState<number | null>(null);
    const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const relativeX = Math.round(e.clientX - bounds.left);

        if (state === 'start') {
            setStartX(relativeX);
            setState('moveRight');
        } else if (state === 'moveRight') {
            setEndX(relativeX);
            setState('moveLeft');
        } else if (state === 'moveLeft') {
            setReturnX(relativeX);
            setState('result');
        }
    };

    const resetTest = () => {
        setState('start');
        setStartX(null);
        setEndX(null);
        setReturnX(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div 
                        onClick={handleMouseClick}
                        className={`w-full min-h-80 rounded-3xl border-2 flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-crosshair select-none relative
                            ${state === 'start' ? 'bg-orange-900/10 border-orange-500/20 hover:border-orange-500/40' : ''}
                            ${state === 'moveRight' ? 'bg-blue-900/10 border-blue-500/40' : ''}
                            ${state === 'moveLeft' ? 'bg-green-900/10 border-green-500/40' : ''}
                            ${state === 'result' ? 'bg-slate-900/40 border-white/10' : ''}
                        `}
                    >
                        {state === 'start' && (
                            <div className="text-center animate-in zoom-in-95 duration-300">
                                <MousePointer2 className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-display font-bold text-white mb-2">Step 1: Set Point A</h3>
                                <p className="text-slate-400">Position mouse physically on the left. Click here.</p>
                            </div>
                        )}

                        {state === 'moveRight' && (
                            <div className="text-center animate-in zoom-in-95 duration-300">
                                <span className="block text-4xl mb-4">⏩</span>
                                <h3 className="text-2xl font-display font-bold text-blue-400 mb-2">Step 2: Move RAPIDLY Right</h3>
                                <p className="text-slate-400">Move mouse fast. Click here.</p>
                            </div>
                        )}

                        {state === 'moveLeft' && (
                            <div className="text-center animate-in zoom-in-95 duration-300">
                                <span className="block text-4xl mb-4">⏪</span>
                                <h3 className="text-2xl font-display font-bold text-green-400 mb-2">Step 3: Move SLOWLY Left</h3>
                                <p className="text-slate-400">Move mouse slow to original physical spot. Click.</p>
                            </div>
                        )}

                        {state === 'result' && startX !== null && endX !== null && returnX !== null && (
                            <MouseAccelerationResult
                                startX={startX}
                                endX={endX}
                                returnX={returnX}
                                onReset={resetTest}
                            />
                        )}
                    </div>
                </div>
            </div>
</div>
    );
}
