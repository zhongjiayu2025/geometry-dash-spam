"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const RelatedTools = dynamic(() => import('./RelatedTools'));
import { Trophy, Activity, Keyboard, Target, Timer, MousePointer2, Medal } from 'lucide-react';


type Category = 'cps' | 'typing' | 'aim' | 'reaction';

export default function Leaderboard() {
    const [activeCategory, setActiveCategory] = useState<Category>('cps');
    
    // Mock data for leaderboards
    const getMockData = (category: Category) => {
        if (category === 'cps') {
            return [
                { rank: 1, name: 'ClickMaster99', score: '16.4 CPS', date: '2 hours ago' },
                { rank: 2, name: 'SpeedRunner_Z', score: '15.8 CPS', date: '5 hours ago' },
                { rank: 3, name: 'NeonNinja', score: '15.2 CPS', date: '1 day ago' },
                { rank: 4, name: 'Guest4829', score: '14.9 CPS', date: '1 day ago' },
                { rank: 5, name: 'MouseBreaker', score: '14.5 CPS', date: '2 days ago' },
            ];
        }
        if (category === 'typing') {
            return [
                { rank: 1, name: 'MechType', score: '185 WPM', date: '10 mins ago' },
                { rank: 2, name: 'QwertyKing', score: '172 WPM', date: '3 hours ago' },
                { rank: 3, name: 'FastFingers', score: '168 WPM', date: '5 hours ago' },
                { rank: 4, name: 'AliceTypes', score: '155 WPM', date: '1 day ago' },
                { rank: 5, name: 'CodeMonkey', score: '149 WPM', date: '2 days ago' },
            ];
        }
        if (category === 'aim') {
            return [
                { rank: 1, name: 'FlickGod', score: '42 Targets', date: '1 hour ago' },
                { rank: 2, name: 'SniperElite', score: '39 Targets', date: '4 hours ago' },
                { rank: 3, name: 'AimBot_Human', score: '38 Targets', date: '12 hours ago' },
                { rank: 4, name: 'ProGamerX', score: '35 Targets', date: '1 day ago' },
                { rank: 5, name: 'casual_player', score: '32 Targets', date: '2 days ago' },
            ];
        }
        return [
            { rank: 1, name: 'Flash', score: '120 ms', date: '3 hours ago' },
            { rank: 2, name: 'QuickReflex', score: '135 ms', date: '8 hours ago' },
            { rank: 3, name: 'Sonic_01', score: '142 ms', date: '1 day ago' },
            { rank: 4, name: 'EagleEye', score: '148 ms', date: '1 day ago' },
            { rank: 5, name: 'GamerDad', score: '155 ms', date: '3 days ago' },
        ];
    };

    const data = getMockData(activeCategory);

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
            <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-yellow-500/10 mb-6">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black text-white px-2 text-center mb-4 text-glow">Global Leaderboards</h1>
                <p className="text-slate-400 text-center max-w-2xl px-4">
                    Compete against players worldwide. This is a global top 5 rating for various tests. (Simulation)
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8 animate-in fade-in duration-700 delay-100">
                <button 
                  onClick={() => setActiveCategory('cps')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeCategory === 'cps' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                    <MousePointer2 className="w-4 h-4" /> Jitter CPS
                </button>
                <button 
                  onClick={() => setActiveCategory('typing')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeCategory === 'typing' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                    <Keyboard className="w-4 h-4" /> Typing
                </button>
                <button 
                  onClick={() => setActiveCategory('aim')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeCategory === 'aim' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                    <Target className="w-4 h-4" /> Aim Trainer
                </button>
                <button 
                  onClick={() => setActiveCategory('reaction')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeCategory === 'reaction' ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                    <Timer className="w-4 h-4" /> Reaction
                </button>
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-800/80 border-b border-white/10">
                                <th className="px-6 py-4 text-slate-400 font-bold uppercase tracking-wider text-sm w-24 text-center">Rank</th>
                                <th className="px-6 py-4 text-slate-400 font-bold uppercase tracking-wider text-sm">Player</th>
                                <th className="px-6 py-4 text-slate-400 font-bold uppercase tracking-wider text-sm text-right">Score</th>
                                <th className="px-6 py-4 text-slate-400 font-bold uppercase tracking-wider text-sm text-right">Achieved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center items-center">
                                            {row.rank === 1 ? (
                                                <Medal className="w-8 h-8 text-yellow-400" />
                                            ) : row.rank === 2 ? (
                                                <Medal className="w-7 h-7 text-slate-300" />
                                            ) : row.rank === 3 ? (
                                                <Medal className="w-6 h-6 text-amber-600" />
                                            ) : (
                                                <span className="text-slate-500 font-mono text-lg">{row.rank}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-white text-lg">{row.name}</div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className={`text-xl font-black font-display ${
                                            activeCategory === 'cps' ? 'text-blue-400' :
                                            activeCategory === 'typing' ? 'text-emerald-400' :
                                            activeCategory === 'aim' ? 'text-purple-400' : 'text-orange-400'
                                        }`}>{row.score}</div>
                                    </td>
                                    <td className="px-6 py-5 text-right text-slate-500 text-sm">
                                        {row.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <RelatedTools currentTool="leaderboard" />
        </div>
    );
}
