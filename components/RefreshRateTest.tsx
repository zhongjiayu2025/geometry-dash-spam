"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));
import { Monitor, Info, RefreshCw, Zap } from 'lucide-react';


export default function RefreshRateTest() {
    const [fps, setFps] = useState<number>(0);
    const [maxHz, setMaxHz] = useState<number>(0);
    const [stabilizedHz, setStabilizedHz] = useState<number | null>(null);

    const requestRef = useRef<number>(0);
    const timesRef = useRef<number[]>([]);

    useEffect(() => {
        let isActive = true;

        const loop = () => {
            if (!isActive) return;
            
            const now = performance.now();
            
            // Remove timestamps older than 1 second
            while (timesRef.current.length > 0 && timesRef.current[0] <= now - 1000) {
                timesRef.current.shift();
            }
            
            timesRef.current.push(now);
            
            const currentFps = timesRef.current.length;
            setFps(currentFps);
            
            setMaxHz(prev => {
                if (currentFps > prev) return currentFps;
                return prev;
            });
            
            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);

        // Stabilize reading after 3 seconds
        const timer = setTimeout(() => {
            setStabilizedHz(maxHz || fps);
        }, 3000);

        return () => {
            isActive = false;
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            clearTimeout(timer);
        };
    }, []);

    // Also update stabilized if maxHz goes even higher later
    useEffect(() => {
        if (stabilizedHz !== null && maxHz > stabilizedHz) {
            setStabilizedHz(maxHz);
        }
    }, [maxHz, stabilizedHz]);

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
            <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 mb-6 border border-cyan-500/20">
                    <Monitor className="w-10 h-10 text-cyan-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 shadow-cyan-500 drop-shadow-lg">
                    Monitor Refresh Rate (Hz)
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                    Detect your display's actual refresh rate by counting your browser's render frames per second.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in fade-in duration-700 delay-100">
                <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors"></div>
                    <RefreshCw className={`w-12 h-12 text-cyan-500/20 absolute -right-2 -bottom-2 ${stabilizedHz === null ? 'animate-spin' : ''}`} />
                    
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 relative z-10">Detected Refresh Rate</h3>
                    <div className="flex items-end gap-2 relative z-10">
                        <span className="text-7xl font-display font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] tabular-nums">
                            {stabilizedHz !== null ? stabilizedHz : fps}
                        </span>
                        <span className="text-2xl text-slate-400 font-bold mb-2">Hz</span>
                    </div>
                    {stabilizedHz === null && (
                        <div className="mt-4 text-xs text-cyan-500 animate-pulse font-mono relative z-10">Detecting...</div>
                    )}
                </div>

                <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <Zap className="w-6 h-6 text-yellow-400" />
                        </div>
                        <h3 className="font-bold text-white text-lg">Live Frame Counter</h3>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 mb-4">
                        <span className="text-slate-400">Current FPS</span>
                        <span className="text-2xl font-mono font-bold text-white tabular-nums">{fps}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-slate-400">Peak FPS</span>
                        <span className="text-2xl font-mono font-bold text-yellow-400 tabular-nums">{maxHz}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 md:p-8 animate-in fade-in duration-700 delay-200 mb-16">
                 <div className="flex items-start gap-4">
                     <Info className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                     <div>
                         <h3 className="font-bold text-white mb-2">Why isn't it reaching my monitor's Hz?</h3>
                         <ul className="list-disc list-inside text-slate-400 text-sm space-y-2 leading-relaxed">
                             <li>Make sure your browser is focused and visible.</li>
                             <li>Check if hardware acceleration is disabled in your browser settings (it must be ON).</li>
                             <li>Ensure your OS display settings actually have the correct Hz selected (Windows: Advanced display settings).</li>
                             <li>Laptops on battery power might cap the browser framerate to 60fps to save power.</li>
                         </ul>
                     </div>
                 </div>
            </div>

            <RelatedTools currentTool="systemInfo" />
        </div>
    );
}
