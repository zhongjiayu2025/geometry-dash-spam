"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));

import { Keyboard, RotateCcw, Trophy, Share2, Check } from 'lucide-react';

const WORDS = [
    "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I", "with", "as", "not", "on", "she", "at", 
    "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", 
    "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", 
    "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", 
    "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", 
    "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", 
    "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", 
    "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", 
    "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", 
    "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", 
    "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", 
    "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", 
    "early", "course", "change", "help", "line"
];

function generateText(wordCount: number) {
    let text = [];
    for (let i = 0; i < wordCount; i++) {
        text.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    return text.join(" ");
}

export default function TypingTest() {
    const [targetText, setTargetText] = useState("");
    const [userInput, setUserInput] = useState("");
    const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
    const [timeLeft, setTimeLeft] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [copied, setCopied] = useState(false);
    
    const [bestWpm, setBestWpm] = useState<number | null>(null);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setTargetText(generateText(200));
        const saved = localStorage.getItem('typingTestBestWpm');
        if (saved) {
            try { setBestWpm(parseInt(saved, 10)); } catch(e) {}
        }
    }, []);

    const startGame = () => {
        if (status !== 'idle') return;
        setStatus('running');
        
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const endGame = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus('finished');
        calculateScore();
    };

    const calculateScore = () => {
        const wordsTyped = userInput.trim().split(/\s+/).length;
        const targetWords = targetText.trim().split(/\s+/);
        const typedWords = userInput.trim().split(/\s+/);
        
        let correctWords = 0;
        for (let i = 0; i < typedWords.length; i++) {
            if (typedWords[i] === targetWords[i]) {
                correctWords++;
            }
        }

        const calculatedWpm = Math.round((correctWords / 60) * 60); // It's a 60 second test
        const acc = typedWords.length > 0 ? Math.round((correctWords / typedWords.length) * 100) : 0;
        
        setWpm(calculatedWpm);
        setAccuracy(acc);
        
        setBestWpm(prev => {
            if (prev === null || calculatedWpm > prev) {
                localStorage.setItem('typingTestBestWpm', calculatedWpm.toString());
                return calculatedWpm;
            }
            return prev;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (status === 'idle') {
            startGame();
        }
        setUserInput(val);

        // Auto extend text if user is typing fast
        if (val.length > targetText.length - 100) {
            setTargetText(prev => prev + " " + generateText(50));
        }
    };

    const resetTest = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus('idle');
        setTimeLeft(60);
        setUserInput("");
        setTargetText(generateText(200));
        setWpm(0);
        setAccuracy(100);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const shareScore = async () => {
        const text = `I type at ${wpm} WPM with ${accuracy}% accuracy on the Geometry Dash Typing Test! Can you beat me?`;
        const url = `https://geometrydashspam.cc/typing-test`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: 'Typing Test', text, url });
            } catch(e) { console.log(e); }
        } else {
            navigator.clipboard.writeText(`${text} ${url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Render text with highlights
    const renderText = () => {
        const chars = targetText.split('');
        const inputChars = userInput.split('');

        return chars.map((char, i) => {
            let color = "text-slate-500"; // default
            if (i < inputChars.length) {
                if (inputChars[i] === char) {
                    color = "text-white"; // correct
                } else {
                    color = "text-red-500 bg-red-500/20"; // incorrect
                }
            } else if (i === inputChars.length) {
                color = "text-slate-300 border-l border-white animate-pulse"; // cursor
            }
            return <span key={i} className={color}>{char}</span>;
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
            <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    
                    <div className="w-full mb-8 flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                        <div className="flex-1">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Time Left</div>
                            <div className={`text-4xl md:text-5xl font-display font-bold ${timeLeft < 10 && status === 'running' ? 'text-red-400' : 'text-sky-400'}`}>
                                {timeLeft}s
                            </div>
                        </div>
                        <div className="w-px h-16 bg-white/10 mx-4"></div>
                        <div className="flex-1">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Current WPM</div>
                            <div className="text-4xl md:text-5xl font-display font-bold text-white">
                                {status === 'finished' ? wpm : '--'}
                            </div>
                        </div>
                    </div>

                    {status === 'finished' ? (
                        <div className="w-full animate-in zoom-in-95 duration-500 bg-slate-900/40 border border-sky-500/30 rounded-3xl p-8 text-center">
                            <h3 className="text-3xl text-sky-200 font-bold mb-6">Test Complete!</h3>
                            
                            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-6">
                                <div className="bg-slate-800/50 p-6 rounded-2xl">
                                    <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Speed</div>
                                    <div className="text-4xl font-bold text-sky-400 mb-1">{wpm} WPM</div>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-2xl">
                                    <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Accuracy</div>
                                    <div className="text-4xl font-bold text-white mb-1">{accuracy}%</div>
                                </div>
                            </div>
                            
                            {bestWpm !== null && (
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-black/40 px-4 py-2 rounded-full border border-white/10 mb-8 mx-auto w-max">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    Personal Best: <strong className="text-white">{bestWpm} WPM</strong>
                                </div>
                            )}

                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={resetTest}
                                    className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-sky-600/20"
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
                    ) : (
                        <div 
                            className="w-full min-h-64 rounded-3xl border-2 bg-slate-900/40 border-white/10 p-8 relative cursor-text group"
                            onClick={() => inputRef.current?.focus()}
                        >
                            {!userInput && status === 'idle' && (
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="animate-pulse text-xs uppercase tracking-widest text-sky-500 font-bold flex items-center gap-2">
                                        <Keyboard className="w-4 h-4" /> Start typing...
                                    </span>
                                </div>
                            )}
                            <div className="text-2xl font-mono leading-relaxed max-h-64 overflow-hidden mask-image:linear-gradient(to_bottom,black_60%,transparent)">
                                {renderText()}
                            </div>
                            
                            {/* Hidden input field */}
                            <textarea
                                ref={inputRef}
                                value={userInput}
                                onChange={handleChange}
                                className="absolute opacity-0 w-0 h-0"
                                disabled={false}
                                autoFocus
                            />
                        </div>
                    )}

                </div>
            </div>
            
            <RelatedTools currentTool="typing" />
        </div>
    );
}
