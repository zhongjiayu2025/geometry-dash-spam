"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { Keyboard as KeyboardIcon, AlertCircle } from 'lucide-react';

export default function KeyRolloverTest() {
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
    const [maxKeys, setMaxKeys] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default for common scrolling keys if they are testing
            if ([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)) {
                e.preventDefault();
            }

            setActiveKeys(prev => {
                const next = new Set(prev);
                next.add(e.code);
                
                if (next.size > maxKeys) {
                    setMaxKeys(next.size);
                }
                
                return next;
            });
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setActiveKeys(prev => {
                const next = new Set(prev);
                next.delete(e.code);
                return next;
            });
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setActiveKeys(new Set());
            }
        };

        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [maxKeys]);

    const resetMax = () => {
        setMaxKeys(0);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="w-full mb-8 flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                        <div className="flex-1">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Simultaneous Keys</div>
                            <div className="text-5xl md:text-6xl font-display font-bold text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                                {activeKeys.size}
                            </div>
                        </div>
                        <div className="w-px h-16 bg-white/10 mx-4"></div>
                        <div className="flex-1">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Max Ghosting Limit</div>
                            <div className="text-5xl md:text-6xl font-display font-bold text-white">
                                {maxKeys}
                            </div>
                        </div>
                    </div>

                    <div className="w-full min-h-64 rounded-3xl border-2 bg-amber-900/10 border-amber-500/20 p-8 flex flex-col items-center justify-center transition-all duration-300">
                        {activeKeys.size === 0 ? (
                            <div className="text-center text-slate-500 flex flex-col items-center">
                                <KeyboardIcon className="w-16 h-16 mb-4 opacity-50 text-amber-500" />
                                <h3 className="text-2xl font-display font-bold text-slate-300 mb-2">Press & Hold Multiple Keys</h3>
                                <p className="max-w-md">
                                    Test your keyboard's N-Key rollover (anti-ghosting). Press as many keys as you can at the same time and see how many register.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-3 w-full">
                                {Array.from(activeKeys).map(code => (
                                    <div key={code} className="px-6 py-4 bg-white text-slate-900 font-bold font-mono rounded-xl shadow-[0_4px_0_#94a3b8,0_0_15px_rgba(251,191,36,0.5)] transform translate-y-1 transition-all">
                                        {code.replace(/^(Key|Digit)/, '')}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 w-full bg-slate-900/40 border border-amber-500/20 rounded-xl p-4 flex gap-4 items-start text-sm text-slate-300">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p>
                            <strong className="text-white block mb-1">What is Ghosting / Rollover?</strong>
                            Most standard office keyboards have a 2-KRO or 6-KRO limit, meaning they max out at 2 or 6 simultaneously pressed keys before "ghosting" (ignoring further inputs). Mechanical gaming keyboards usually have N-Key Rollover (NKRO), meaning they can register every single key pressed at once.
                        </p>
                    </div>

                    {maxKeys > 0 && (
                        <button
                            onClick={resetMax}
                            className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors text-sm"
                        >
                            Reset Max Record
                        </button>
                    )}
                </div>
            </div>
            
            <RelatedTools currentTool="rollover" />
        </div>
    );
}
