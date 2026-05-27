"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));
import { Keyboard as KeyboardIcon, AlertTriangle, Info, RotateCcw } from 'lucide-react';


const virtualKeyboardLayout = [
    ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
    ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
    ['Capslock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
    ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
    ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight']
];

const keyLabels: Record<string, string> = {
    'Escape': 'Esc', 'Backquote': '\`', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5', 'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0', 'Minus': '-', 'Equal': '=', 'Backspace': 'Backspace',
    'Tab': 'Tab', 'KeyQ': 'Q', 'KeyW': 'W', 'KeyE': 'E', 'KeyR': 'R', 'KeyT': 'T', 'KeyY': 'Y', 'KeyU': 'U', 'KeyI': 'I', 'KeyO': 'O', 'KeyP': 'P', 'BracketLeft': '[', 'BracketRight': ']', 'Backslash': '\\',
    'Capslock': 'Caps', 'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D', 'KeyF': 'F', 'KeyG': 'G', 'KeyH': 'H', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L', 'Semicolon': ';', 'Quote': "'", 'Enter': 'Enter',
    'ShiftLeft': 'Shift L', 'KeyZ': 'Z', 'KeyX': 'X', 'KeyC': 'C', 'KeyV': 'V', 'KeyB': 'B', 'KeyN': 'N', 'KeyM': 'M', 'Comma': ',', 'Period': '.', 'Slash': '/', 'ShiftRight': 'Shift R',
    'ControlLeft': 'Ctrl L', 'MetaLeft': 'Win', 'AltLeft': 'Alt', 'Space': 'Space', 'AltRight': 'Alt', 'MetaRight': 'Win', 'ContextMenu': 'Menu', 'ControlRight': 'Ctrl R'
};

const getKeyWidthClass = (code: string) => {
    switch(code) {
        case 'Backspace': return 'w-24';
        case 'Tab': return 'w-20';
        case 'Backslash': return 'w-16';
        case 'Capslock': return 'w-24';
        case 'Enter': return 'w-28';
        case 'ShiftLeft': return 'w-28';
        case 'ShiftRight': return 'w-32';
        case 'ControlLeft':
        case 'ControlRight':
        case 'AltLeft':
        case 'AltRight':
        case 'MetaLeft':
        case 'MetaRight':
        case 'ContextMenu': return 'w-16';
        case 'Space': return 'flex-1 min-w-[200px]';
        default: return 'w-12';
    }
};

export default function KeyboardGhostingTest() {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [maxKeys, setMaxKeys] = useState(0);
    const [ghostingDetected, setGhostingDetected] = useState(false);
    
    // Ghosting theoretically can't be perfectly detected via JS because the OS simply drops keys,
    // but we can simulate a known problem: if 3+ keys are held but some common combinations fail.
    // Given JS limitations, we just show the matrix and how many can be pressed simultaneously.

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Do not prevent default for F5, F12, Ctrl+R, Ctrl+W, etc.
            if (!['F5', 'F11', 'F12'].includes(e.code) && !(e.ctrlKey || e.metaKey)) {
                e.preventDefault();
            }
            setPressedKeys(prev => {
                const next = new Set(prev);
                next.add(e.code);
                if (next.size > maxKeys) setMaxKeys(next.size);
                return next;
            });
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            e.preventDefault();
            setPressedKeys(prev => {
                const next = new Set(prev);
                next.delete(e.code);
                return next;
            });
        };

        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp, { passive: false });
        
        // Reset keys when window loses focus
        const handleBlur = () => setPressedKeys(new Set());
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [maxKeys]);

    const reset = () => {
        setMaxKeys(0);
        setPressedKeys(new Set());
        setGhostingDetected(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
            <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 mb-6 border border-amber-500/20">
                    <KeyboardIcon className="w-10 h-10 text-amber-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                    Keyboard Ghosting & N-Key Rollover
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                    Press as many keys as you can simultaneously to test your keyboard's rollover matrix and detect ghosting dropped inputs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in fade-in duration-700 delay-100">
                <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Max Simultaneous</div>
                        <div className="text-4xl font-display font-black text-amber-400">{maxKeys} <span className="text-xl text-slate-500">keys</span></div>
                    </div>
                    <button 
                      onClick={reset}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                </div>
                <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-bold text-white">Ghosting Explained</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        If certain keys don't register when holding multiple keys down, your keyboard suffers from ghosting. High-end gaming keyboards have Anti-Ghosting (NKRO) guaranteeing all presses register.
                    </p>
                </div>
            </div>

            <div className="bg-slate-900 p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl overflow-x-auto min-w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="min-w-[800px] flex flex-col gap-2 mx-auto">
                    {virtualKeyboardLayout.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-2">
                            {row.map(code => {
                                const isPressed = pressedKeys.has(code);
                                return (
                                    <div 
                                        key={code}
                                        className={`
                                            ${getKeyWidthClass(code)} h-14 rounded-xl border-b-4 flex items-center justify-center font-bold text-sm transition-all duration-75
                                            ${isPressed 
                                                ? 'bg-amber-500 text-white border-amber-700 translate-y-1 shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                                                : 'bg-slate-800 text-slate-300 border-black shadow-lg'}
                                        `}
                                    >
                                        {keyLabels[code] || code.replace('Key', '')}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4 mb-8">
               <Info className="w-6 h-6 text-blue-400 shrink-0" />
               <p className="text-sm text-blue-200 leading-relaxed">
                   <strong>How to test:</strong> Try pressing both Shift keys and typing a sentence. If some letters fail to type, your keyboard has an imperfect matrix. Try pressing W + A + Space. If space doesn't work, this can ruin gaming experiences!
               </p>
            </div>
            
            <RelatedTools currentTool="keyboardGhosting" />
        </div>
    );
}
