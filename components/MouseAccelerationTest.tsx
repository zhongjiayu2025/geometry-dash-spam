"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { MousePointer2, RotateCcw, AlertTriangle } from 'lucide-react';

export default function MouseAccelerationTest() {
    const [state, setState] = useState<'start' | 'moveRight' | 'moveLeft' | 'result'>('start');
    const [startX, setStartX] = useState<number | null>(null);
    const [endX, setEndX] = useState<number | null>(null);
    const [returnX, setReturnX] = useState<number | null>(null);
    const [difference, setDifference] = useState<number>(0);
    
    // We use a physical object to measure "physical" vs "software" distance
    // This is hard on the web, so we instruct the user explicitly.
    
    const handleMouseClick = (e: React.MouseEvent) => {
        if (state === 'start') {
            setStartX(e.clientX);
            setState('moveRight');
        } else if (state === 'moveRight') {
            setEndX(e.clientX);
            setState('moveLeft');
        } else if (state === 'moveLeft') {
            setReturnX(e.clientX);
            const diff = Math.abs((startX || 0) - e.clientX);
            setDifference(diff);
            setState('result');
        }
    };

    const resetTest = () => {
        setState('start');
        setStartX(null);
        setEndX(null);
        setReturnX(null);
        setDifference(0);
    };

    const hasAccel = difference > 50;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="mb-8 w-full max-w-2xl bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <ol className="list-decimal list-inside space-y-3 text-slate-300">
                            <li>Place your mouse against the left edge of your mousepad.</li>
                            <li><strong>Click inside the box below to set Point A.</strong></li>
                            <li>Move your mouse <strong>RAPIDLY</strong> to the right edge of your mousepad.</li>
                            <li><strong>Click again to set Point B.</strong></li>
                            <li>Move your mouse <strong>SLOWLY</strong> back to the left edge (starting physical position).</li>
                            <li><strong>Click a final time to set Point C.</strong></li>
                        </ol>
                    </div>

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

                        {state === 'result' && (
                            <div className="text-center animate-in zoom-in-95 duration-300 w-full">
                                <h3 className="text-3xl font-display font-bold text-white mb-6">Results</h3>
                                
                                <div className="grid grid-cols-3 gap-4 md:gap-8 mb-8">
                                    <div className="bg-slate-800/50 p-4 rounded-xl">
                                        <div className="text-xs text-slate-500 uppercase mb-1">Point A (Start)</div>
                                        <div className="font-mono text-xl text-white">{startX}px</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl">
                                        <div className="text-xs text-slate-500 uppercase mb-1">Point B (Fast)</div>
                                        <div className="font-mono text-xl text-white">{endX}px</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl">
                                        <div className="text-xs text-slate-500 uppercase mb-1">Point C (Slow Return)</div>
                                        <div className="font-mono text-xl text-white">{returnX}px</div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl border ${hasAccel ? 'bg-rose-900/20 border-rose-500/50' : 'bg-emerald-900/20 border-emerald-500/50'}`}>
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        {hasAccel && <AlertTriangle className="w-6 h-6 text-rose-400" />}
                                        <h4 className={`text-2xl font-display font-bold ${hasAccel ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {hasAccel ? 'Acceleration Detected!' : 'No Acceleration Detected'}
                                        </h4>
                                    </div>
                                    <p className="text-slate-300">
                                        Cursor difference: <strong className="text-white">{difference}px</strong>
                                    </p>
                                    {hasAccel ? (
                                        <p className="text-sm text-rose-300/80 mt-2">
                                            Your cursor did not return to the exact starting point despite your physical mouse doing so. Enhance Pointer Precision is likely ON in Windows.
                                        </p>
                                    ) : (
                                        <p className="text-sm text-emerald-300/80 mt-2">
                                            Your cursor returned close to the original position. You have raw input!
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); resetTest(); }}
                                    className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <RotateCcw className="w-4 h-4" /> Try Again
                                </button>
                            </div>
                        )}
                        
                        {/* Visual markers */}
                        {state === 'result' && startX !== null && (
                            <div className="absolute top-0 bottom-0 w-px bg-orange-500/50" style={{ left: `${startX}px` }}></div>
                        )}
                        {state === 'result' && returnX !== null && (
                            <div className="absolute top-0 bottom-0 w-px bg-green-500/50" style={{ left: `${returnX}px` }}></div>
                        )}
                    </div>
                </div>
            </div>
            
            <RelatedTools currentTool="mouseAcceleration" />
        </div>
    );
}
