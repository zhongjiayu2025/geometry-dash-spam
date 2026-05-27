"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { RotateCcw, Activity } from 'lucide-react';

export default function ScrollTest() {
    const [pixels, setPixels] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    
    // Animate wheel icon
    const [scrollY, setScrollY] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleScroll = useCallback((e: WheelEvent) => {
        if (isFinished) return;
        
        // Prevent default scrolling on the page to lock the test area
        e.preventDefault();

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
        }

        const delta = Math.abs(e.deltaY);
        setPixels((prev) => prev + delta);
        
        // Move visual indicator
        setScrollY(prev => (prev + (e.deltaY > 0 ? 10 : -10)) % 40);
        
    }, [isActive, isFinished]);

    useEffect(() => {
        const target = document.getElementById('scroll-target');
        if (target) {
            target.addEventListener('wheel', handleScroll, { passive: false });
        }
        return () => {
            if (target) {
                target.removeEventListener('wheel', handleScroll);
            }
        };
    }, [handleScroll]);

    const endTest = () => {
        setIsActive(false);
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const resetTest = () => {
        setPixels(0);
        setTimeLeft(10);
        setIsActive(false);
        setIsFinished(false);
        setScrollY(0);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const pixelsPerSecond = Math.round(pixels / 10);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="flex w-full justify-between items-center mb-8 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                        <div className="text-center">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Time Left</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-white">{timeLeft}s</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Pixels Scrolled</div>
                            <div className="text-3xl md:text-4xl font-display font-bold text-teal-400">{Math.round(pixels)}</div>
                        </div>
                    </div>

                    {!isFinished ? (
                        <div
                            id="scroll-target"
                            className="w-full h-64 md:h-80 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 group select-none bg-teal-900/10 border-teal-500/20 hover:bg-teal-800/20 hover:border-teal-500/30 overflow-hidden relative cursor-n-resize"
                        >
                            <div className="absolute inset-0 opacity-10 bg-grid mask-image:linear-gradient(to_bottom,transparent,black,transparent)" 
                                 style={{ backgroundPositionY: `${scrollY}px` }}></div>
                                 
                            <Activity className="w-16 h-16 md:w-20 md:h-20 text-teal-500/50 group-hover:text-teal-400 transition-colors relative z-10" />
                            <div className="text-center relative z-10">
                                <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-300 group-hover:text-white transition-colors">
                                    {isActive ? 'Keep Scrolling!' : 'Scroll Up or Down Here'}
                                </h3>
                                <p className="text-slate-500 mt-2 text-sm">
                                    Wheel up or wheel down as fast as possible to measure your scrolling speed in pixels per second.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full animate-in zoom-in-95 duration-500">
                            <div className="bg-teal-900/20 border border-teal-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                                <h3 className="text-2xl text-teal-200 font-bold mb-2">Test Complete!</h3>
                                <div className="text-6xl font-display font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]">
                                    {pixelsPerSecond} <span className="text-2xl text-teal-400">px/s</span>
                                </div>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                    You scrolled a total of {Math.round(pixels)} pixels in 10 seconds.
                                </p>

                                <button
                                    onClick={resetTest}
                                    className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2 mx-auto shadow-lg shadow-teal-600/20"
                                >
                                    <RotateCcw className="w-5 h-5" /> Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <RelatedTools currentTool="scroll" />
        </div>
    );
}
