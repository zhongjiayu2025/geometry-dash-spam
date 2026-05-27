"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { RotateCcw, MousePointer2, Share2, Check, Trophy } from 'lucide-react';

export default function DragClickTest() {
    const [clicks, setClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [cpsArray, setCpsArray] = useState<number[]>(Array(10).fill(0));
    
    // For drag clicking, tracking the "drag" visually helps the feedback.
    const [dragActive, setDragActive] = useState(false);

    const [copied, setCopied] = useState(false);
    const [bestCps, setBestCps] = useState<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const cpsIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const clicksThisSecond = useRef(0);

    const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent default on touch to stop double firing (touch + click)
        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        if (isFinished) return;

        if (!isActive) {
            setIsActive(true);
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            cpsIntervalRef.current = setInterval(() => {
                setCpsArray(prev => {
                    const newArr = [...prev];
                    newArr.shift();
                    newArr.push(clicksThisSecond.current);
                    return newArr;
                });
                clicksThisSecond.current = 0;
            }, 1000);
        }

        setClicks((prev) => prev + 1);
        clicksThisSecond.current += 1;
        
        // Trigger visual ping
        setDragActive(true);
        setTimeout(() => setDragActive(false), 50);
    };

    const onClickButtonDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isFinished) {
            setDragActive(true);
        }
    };

    const onClickButtonUp = (e: React.MouseEvent | React.TouchEvent) => {
        setDragActive(false);
    };

    const endTest = () => {
        setIsActive(false);
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
        if (cpsIntervalRef.current) clearInterval(cpsIntervalRef.current);
        
        // Push final second
        setCpsArray(prev => {
            const newArr = [...prev];
            newArr.shift();
            newArr.push(clicksThisSecond.current);
            return newArr;
        });
    };

    const resetTest = () => {
        setClicks(0);
        setTimeLeft(10);
        setIsActive(false);
        setIsFinished(false);
        setCpsArray(Array(10).fill(0));
        clicksThisSecond.current = 0;
        if (timerRef.current) clearInterval(timerRef.current);
        if (cpsIntervalRef.current) clearInterval(cpsIntervalRef.current);
    };

    useEffect(() => {
        const saved = localStorage.getItem('dragClickBest');
        if (saved) {
            try { setBestCps(parseFloat(saved)); } catch(e) {}
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (cpsIntervalRef.current) clearInterval(cpsIntervalRef.current);
        };
    }, []);

    const finalCps = (clicks / 10).toFixed(2);
    const maxCps = Math.max(...cpsArray);

    useEffect(() => {
        if (isFinished) {
            setBestCps(prev => {
                const fCps = Math.max(...cpsArray); // Usually max CPS is evaluated for drag clicking over a single burst
                if (prev === null || fCps > prev) {
                    localStorage.setItem('dragClickBest', fCps.toString());
                    return fCps;
                }
                return prev;
            });
        }
    }, [isFinished, cpsArray]);

    const shareScore = async () => {
        const text = `I got a max burst of ${maxCps} CPS on the Geometry Dash Drag Click Test! Can you beat me?`;
        const url = `https://geometrydashspam.cc/drag-click`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: 'Drag Click Test', text, url });
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="flex w-full justify-between items-center mb-8 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                        <div className="text-center">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Time Left</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-white">{timeLeft}s</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Current CPS</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-indigo-400">
                                {isActive ? clicksThisSecond.current : (isFinished ? finalCps : '0.0')}
                            </div>
                        </div>
                        <div className="text-center relative group">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Trophy className="w-3 h-3 text-yellow-500" /> Best Burst</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-white">{bestCps !== null ? bestCps : '--'}</div>
                        </div>
                    </div>

                    {!isFinished ? (
                        <button
                            onMouseDown={onClickButtonDown}
                            onMouseUp={onClickButtonUp}
                            onMouseLeave={onClickButtonUp}
                            onTouchStart={handleClick} // Touch handles its own click via this prop
                            onTouchEnd={onClickButtonUp}
                            onClick={handleClick} // Mouse clicks
                            className={`
                                w-full h-64 md:h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-75 group select-none
                                ${dragActive 
                                    ? 'bg-indigo-600/20 border-indigo-500/50 scale-[0.98]' 
                                    : 'bg-indigo-900/10 border-indigo-500/20 hover:bg-indigo-800/20 hover:border-indigo-500/30'}
                            `}
                        >
                            <MousePointer2 className={`w-16 h-16 md:w-20 md:h-20 transition-all duration-75 ${dragActive ? 'text-indigo-400 scale-90' : 'text-indigo-500/50 group-hover:text-indigo-400'}`} />
                            <div className="text-center">
                                <h3 className={`text-2xl md:text-3xl font-display font-bold transition-colors ${dragActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                    {isActive ? 'Keep Dragging!' : 'Drag Click Here'}
                                </h3>
                                <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto px-4">
                                    Drag your finger across the mouse button to generate friction and trigger multiple clicks rapidly.
                                </p>
                            </div>
                        </button>
                    ) : (
                        <div className="w-full animate-in zoom-in-95 duration-500">
                            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
                                <h3 className="text-2xl text-indigo-200 font-bold mb-2">Test Complete!</h3>
                                <div className="text-6xl font-display font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                    {finalCps} <span className="text-2xl text-indigo-400">CPS</span>
                                </div>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                    You clicked {clicks} times in 10 seconds. Your maximum burst was <strong className="text-white">{maxCps} CPS</strong>.
                                </p>
                                
                                {/* CPS Chart Visualization */}
                                <div className="w-full h-32 flex items-end gap-1 mb-8 opacity-80">
                                    {cpsArray.map((val, i) => (
                                        <div key={i} className="flex-1 bg-indigo-500/20 hover:bg-indigo-400/40 rounded-t-sm transition-all relative group flex justify-center" style={{ height: `${Math.max(5, (val / Math.max(1, maxCps)) * 100)}%` }}>
                                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-xs text-white px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                                                {val} CPS
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={resetTest}
                                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                                    >
                                        <RotateCcw className="w-5 h-5" /> Try Again
                                    </button>
                                    <button
                                        onClick={shareScore}
                                        className="p-4 bg-slate-800 text-white rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors border border-white/10"
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
            
            <RelatedTools currentTool="dragClick" />
        </div>
    );
}

