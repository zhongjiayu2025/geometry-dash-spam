"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, MousePointer2, Target, Keyboard, Timer, Activity, RotateCcw, ArrowRight, BrainCircuit } from 'lucide-react';


interface WaveRun {
    time: number;
    averageCps: number;
    peakCps: number;
    timingSd: number;
    clicks: number;
    result: "won" | "lost";
    timestamp: number;
    mode: string;
}

interface UserStats {
    cpsTests: Record<string, number>;
    waveRuns: WaveRun[];
    jitterCps: number | null;
    butterflyCps: number | null;
    rightClickCps: number | null;
    dragPeakCps: number | null;
    spacebarCps: number | null;
    reactionMs: number | null;
    soundReactionMs: number | null;
    aimScore: number | null;
    typingWpm: number | null;
    chimpScore: number | null;
    visualMemoryScore: number | null;
}

export default function PersonalStats() {
    const [stats, setStats] = useState<UserStats>({
        cpsTests: {},
        waveRuns: [],
        jitterCps: null,
        butterflyCps: null,
        rightClickCps: null,
        dragPeakCps: null,
        spacebarCps: null,
        reactionMs: null,
        soundReactionMs: null,
        aimScore: null,
        typingWpm: null,
        chimpScore: null,
        visualMemoryScore: null
    });
    
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const loadStat = (key: string) => {
                const val = localStorage.getItem(key);
                return val ? parseFloat(val) : null;
            };

            const loadObj = (key: string) => {
                const val = localStorage.getItem(key);
                try {
                    return val ? JSON.parse(val) : {};
                } catch {
                    return {};
                }
            };

            const waveRuns: WaveRun[] = [];
            for (let index = 0; index < localStorage.length; index += 1) {
                const key = localStorage.key(index);
                if (!key?.startsWith('gd_spam_runs_')) continue;

                const stored = loadObj(key);
                if (Array.isArray(stored)) {
                    const suffix = key.slice('gd_spam_runs_'.length);
                    const parts = suffix.split('_');
                    const inputMode = parts.at(-1) === 'mini' ? 'Mini' : 'Normal';
                    const runMode = parts.at(-2) === 'endless' ? 'Endless' : '15s';
                    const difficulty = parts.slice(0, -2).join('_') || 'Unknown';

                    waveRuns.push(
                        ...stored.map((run: Partial<WaveRun>) => ({
                            time: Number(run.time || 0),
                            averageCps: Number(run.averageCps || 0),
                            peakCps: Number(run.peakCps || 0),
                            timingSd: Number(run.timingSd || 0),
                            clicks: Number(run.clicks || 0),
                            result: (run.result === 'won' ? 'won' : 'lost') as WaveRun["result"],
                            timestamp: Number(run.timestamp || 0),
                            mode: run.mode || `${difficulty} · ${inputMode} · ${runMode}`,
                        }))
                    );
                }
            }
            waveRuns.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            setStats({
                cpsTests: loadObj('cpsBestScores'),
                waveRuns,
                jitterCps: loadStat('jitterClickBest'),
                butterflyCps: loadStat('butterflyClickBest'),
                rightClickCps: loadStat('rightClickBest'),
                dragPeakCps: loadStat('dragClickBest'),
                spacebarCps: loadStat('spacebarBest'),
                reactionMs: loadStat('reactionBestScore'),
                soundReactionMs: loadStat('soundReactionBest'),
                aimScore: loadStat('aimTrainerBest'),
                typingWpm: loadStat('typingTestBestWpm'),
                chimpScore: loadStat('chimpBestScore'),
                visualMemoryScore: loadStat('visualMemoryBest')
            });
        }
    }, []);

    const clearStats = () => {
        if (confirm("Are you sure you want to clear all your local stats? This cannot be undone.")) {
            localStorage.removeItem('cpsBestScores');
            localStorage.removeItem('cpsRunHistory');
            localStorage.removeItem('jitterClickBest');
            localStorage.removeItem('butterflyClickBest');
            localStorage.removeItem('rightClickBest');
            localStorage.removeItem('dragClickBest');
            localStorage.removeItem('spacebarBest');
            localStorage.removeItem('reactionBestScore');
            localStorage.removeItem('soundReactionBest');
            localStorage.removeItem('aimTrainerBest');
            localStorage.removeItem('typingTestBestWpm');
            localStorage.removeItem('chimpBestScore');
            localStorage.removeItem('visualMemoryBest');

            const dynamicKeys: string[] = [];
            for (let index = 0; index < localStorage.length; index += 1) {
                const key = localStorage.key(index);
                if (key?.startsWith('gd_spam_runs_') || key?.startsWith('gd_spam_best_')) {
                    dynamicKeys.push(key);
                }
            }
            dynamicKeys.forEach((key) => localStorage.removeItem(key));
            
            setStats({
                cpsTests: {},
                waveRuns: [],
                jitterCps: null,
                butterflyCps: null,
                rightClickCps: null,
                dragPeakCps: null,
                spacebarCps: null,
                reactionMs: null,
                soundReactionMs: null,
                aimScore: null,
                typingWpm: null,
                chimpScore: null,
                visualMemoryScore: null
            });
        }
    };

    if (!mounted) return null;

    const recentWaveRuns = stats.waveRuns.slice(0, 10);
    const latestWaveRun = recentWaveRuns[0] ?? null;
    const completedWaveRuns = stats.waveRuns.filter((run) => run.result === 'won').length;
    const recentModes = new Set(recentWaveRuns.map((run) => run.mode)).size;

    const StatCard = ({ title, value, unit, icon: Icon, href, emptyText }: any) => {
        const hasValue = value !== null && value !== undefined && !isNaN(value);

        return (
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-300">{title}</h3>
            </div>
            
            <div className="relative z-10 mb-6">
                {hasValue ? (
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-display font-bold text-white drop-shadow-md">{value}</span>
                        <span className="text-slate-400 font-mono mb-1">{unit}</span>
                    </div>
                ) : (
                    <div className="text-slate-500 text-sm italic py-2">{emptyText || "No data yet"}</div>
                )}
            </div>

            <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors relative z-10">
                {hasValue ? "Improve Score" : "Take Test"} <ArrowRight className="w-4 h-4" />
            </Link>
            
            <div className="absolute -bottom-8 -right-8 text-white/[0.02] group-hover:text-blue-500/5 transition-colors pointer-events-none">
                <Icon className="w-48 h-48" />
            </div>
        </div>
        );
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        My Local Records
                    </h2>
                    <p className="text-slate-400 text-sm">Your personal best scores are stored locally in this browser and are not uploaded by this dashboard.</p>
                </div>
                
                <button 
                    onClick={clearStats}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold transition-colors border border-red-500/20"
                >
                    <RotateCcw className="w-4 h-4" /> Clear History
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                
                <div className="lg:col-span-3 rounded-3xl border border-blue-500/20 bg-blue-950/15 p-8">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Wave training history</div>
                            <h3 className="mt-1 text-xl font-bold text-white">Geometry Dash Spam Runs</h3>
                        </div>
                        <Link href="/" className="text-sm font-bold text-blue-400 hover:text-blue-300">
                            Open Spam Test <ArrowRight className="ml-1 inline h-4 w-4" />
                        </Link>
                    </div>

                    {stats.waveRuns.length ? (
                        <>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                                    <div className="text-xs uppercase tracking-wider text-slate-500">Saved Runs</div>
                                    <div className="mt-1 text-3xl font-display font-bold text-white">{stats.waveRuns.length}</div>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                                    <div className="text-xs uppercase tracking-wider text-slate-500">Completed Runs</div>
                                    <div className="mt-1 text-3xl font-display font-bold text-white">{completedWaveRuns}</div>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                                    <div className="text-xs uppercase tracking-wider text-slate-500">Latest Survival</div>
                                    <div className="mt-1 text-3xl font-display font-bold text-white">{latestWaveRun?.time.toFixed(2)}s</div>
                                    <div className="mt-1 text-xs text-slate-500">{latestWaveRun?.mode}</div>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                                    <div className="text-xs uppercase tracking-wider text-slate-500">Latest CPS</div>
                                    <div className="mt-1 text-3xl font-display font-bold text-white">{latestWaveRun?.averageCps.toFixed(2)}</div>
                                    <div className="mt-1 text-xs text-slate-500">{recentModes} mode{recentModes === 1 ? '' : 's'} in recent history</div>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-2">
                                {recentWaveRuns.slice(0, 5).map((run, index) => (
                                    <div key={`${run.timestamp}-${index}`} className="flex flex-col gap-2 rounded-xl border border-white/5 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-white">{run.mode}</div>
                                            <div className="text-xs text-slate-500">{run.result === 'won' ? 'Completed' : 'Crashed'} · {run.clicks} inputs</div>
                                        </div>
                                        <div className="flex gap-4 text-xs font-mono text-slate-300">
                                            <span>{run.time.toFixed(2)}s</span>
                                            <span>{run.averageCps.toFixed(2)} CPS</span>
                                            <span>{run.peakCps.toFixed(2)} peak</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-sm leading-6 text-slate-400">
                            No saved spam runs yet. Complete or crash a run to start a browser-only training history.
                        </p>
                    )}
                </div>

                {/* Regular CPS Stats */}
                <div className="lg:col-span-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-8 mb-2">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <MousePointer2 className="w-5 h-5 text-blue-400" /> Standard CPS Records
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {[1, 3, 5, 10, 30, 60].map(duration => (
                            <div key={duration} className="bg-black/40 rounded-xl p-4 border border-white/5 text-center">
                                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{duration} Second</div>
                                <div className="text-2xl font-bold text-white">
                                    {stats.cpsTests[duration] ? stats.cpsTests[duration].toFixed(2) : '--'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Specialized Clicks */}
                <StatCard title="Jitter Click Best" value={stats.jitterCps?.toFixed(2)} unit="CPS" icon={Activity} href="/jitter-click" emptyText="Try the 10s Jitter click test" />
                <StatCard title="Butterfly Click Best" value={stats.butterflyCps?.toFixed(2)} unit="CPS" icon={MousePointer2} href="/butterfly-click" emptyText="Try the 10s Butterfly test" />
                <StatCard title="Right Click Best" value={stats.rightClickCps?.toFixed(2)} unit="CPS" icon={MousePointer2} href="/right-click" emptyText="Try the Right Click test" />
                <StatCard title="Drag Click Peak" value={stats.dragPeakCps?.toFixed(0)} unit="CPS" icon={MousePointer2} href="/drag-click" emptyText="Try the Drag Click test" />
                <StatCard title="Visual Reaction Best" value={stats.reactionMs?.toFixed(0)} unit="ms" icon={Timer} href="/reaction-test" emptyText="Try the visual reaction test" />
                <StatCard title="Sound Reaction Best" value={stats.soundReactionMs?.toFixed(0)} unit="ms" icon={Timer} href="/sound-reaction" emptyText="Try the audio reaction test" />
                
                {/* Aim & Keyboard */}
                <StatCard title="Aim Trainer Best" value={stats.aimScore} unit="Targets" icon={Target} href="/aim-trainer" emptyText="Play the 30s Aim challenge" />
                <StatCard title="Chimp Test Best" value={stats.chimpScore} unit="Numbers" icon={BrainCircuit} href="/chimp-test" emptyText="Test your visual memory" />
                <StatCard title="Visual Memory Best" value={stats.visualMemoryScore} unit="Levels" icon={BrainCircuit} href="/visual-memory" emptyText="Grid recall game" />
                <StatCard title="Typing Speed Best" value={stats.typingWpm} unit="WPM" icon={Keyboard} href="/typing-test" emptyText="Take the 60s Typing test" />
                <StatCard title="Spacebar Best" value={stats.spacebarCps?.toFixed(2)} unit="CPS" icon={Timer} href="/spacebar-counter" emptyText="Take the 10s Spacebar test" />

            </div>
        </div>
    );
}
