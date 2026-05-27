"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { Mouse, RotateCcw, Activity } from 'lucide-react';

export default function PollingRateTest() {
    const [isTracking, setIsTracking] = useState(false);
    const [hz, setHz] = useState(0);
    const [maxHz, setMaxHz] = useState(0);
    const [avgHz, setAvgHz] = useState(0);

    const eventCountRef = useRef(0);
    const totalEventsRef = useRef(0);
    const trackingSecondsRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseMove = () => {
        if (!isTracking) return;
        eventCountRef.current += 1;
        totalEventsRef.current += 1;
    };

    const startTracking = () => {
        setIsTracking(true);
        setHz(0);
        setMaxHz(0);
        setAvgHz(0);
        eventCountRef.current = 0;
        totalEventsRef.current = 0;
        trackingSecondsRef.current = 0;

        if (intervalRef.current) clearInterval(intervalRef.current);
        
        intervalRef.current = setInterval(() => {
            const currentHz = eventCountRef.current; // events in the last 1 second
            setHz(currentHz);
            
            setMaxHz(prev => Math.max(prev, currentHz));
            
            trackingSecondsRef.current += 1;
            setAvgHz(Math.round(totalEventsRef.current / trackingSecondsRef.current));
            
            eventCountRef.current = 0;
        }, 1000);
    };

    const stopTracking = () => {
        setIsTracking(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const estimatedCategory = maxHz >= 900 ? '1000Hz+ Gaming Mouse' 
                            : maxHz >= 450 ? '500Hz Gaming Mouse' 
                            : maxHz >= 200 ? '250Hz Mouse / Tablet'
                            : maxHz >= 100 ? '125Hz Standard Office Mouse'
                            : maxHz > 0 ? 'Low Polling Rate / Bluetooth' 
                            : 'Unknown';

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="w-full mb-8 grid grid-cols-3 gap-2 bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center">
                        <div>
                            <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Current Hz</div>
                            <div className="text-3xl md:text-5xl font-display font-bold text-white transition-colors duration-100">{hz}</div>
                        </div>
                        <div className="border-x border-white/10">
                            <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Average Hz</div>
                            <div className="text-3xl md:text-5xl font-display font-bold text-slate-300">{avgHz}</div>
                        </div>
                        <div>
                            <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Max Hz</div>
                            <div className="text-3xl md:text-5xl font-display font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{maxHz}</div>
                        </div>
                    </div>

                    <div 
                        onMouseMove={handleMouseMove}
                        className={`w-full min-h-80 rounded-3xl border-2 flex flex-col items-center justify-center p-8 transition-all duration-300 relative overflow-hidden group ${
                            isTracking ? 'bg-emerald-900/10 border-emerald-500/40 cursor-crosshair' : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-800/40'
                        }`}
                    >
                        {!isTracking ? (
                            <div className="text-center">
                                <Mouse className="w-20 h-20 text-slate-500/50 mx-auto mb-6 group-hover:text-emerald-400/50 transition-colors" />
                                <button
                                    onClick={startTracking}
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-lg shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                                >
                                    Start Tracker
                                </button>
                                <p className="text-slate-500 mt-4 max-w-sm mx-auto text-sm">
                                    Click Start and move your mouse continuously in circles inside this box for at least 3 seconds.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <Activity className={`w-32 h-32 text-emerald-500/20 mb-4 transition-transform ${hz > 0 ? 'scale-110 animate-pulse' : ''}`} />
                                <h3 className="text-4xl font-display font-bold text-emerald-500/30">KEEP MOVING</h3>
                            </div>
                        )}
                    </div>
                    
                    {maxHz > 0 && (
                        <div className="mt-8 w-full bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-6 flex flex-col items-center text-center animate-in zoom-in-95">
                            <span className="text-emerald-200 font-medium mb-1">Estimated Hardware:</span>
                            <span className="text-2xl font-display font-bold text-white">{estimatedCategory}</span>
                            
                            {isTracking && (
                                <button
                                    onClick={stopTracking}
                                    className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    Stop & Reset
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <RelatedTools currentTool="pollingRate" />
        </div>
    );
}
