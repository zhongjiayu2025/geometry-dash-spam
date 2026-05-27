import React from 'react';
import Link from 'next/link';
import { MousePointer2, Activity, Fingerprint, Mouse, Keyboard, Timer, Zap, Target, ArrowRight, BrainCircuit } from 'lucide-react';

interface RelatedToolsProps {
  currentTool: string;
}

const RelatedTools: React.FC<RelatedToolsProps> = ({ currentTool }) => {
  const tools = [
    { id: 'game', label: 'Wave Simulator', icon: Target, path: '/', desc: 'Geometry Dash Physics', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'hover:border-blue-500/50' },
    { id: 'chimpTest', label: 'Chimp Test', icon: BrainCircuit, path: '/chimp-test', desc: 'Visual Memory', color: 'text-indigo-400', bg: 'bg-indigo-900/20', border: 'hover:border-indigo-500/50' },
    { id: 'visualMemory', label: 'Memory Grid', icon: BrainCircuit, path: '/visual-memory', desc: 'Spatial Memory', color: 'text-fuchsia-400', bg: 'bg-fuchsia-900/20', border: 'hover:border-fuchsia-500/50' },
    { id: 'cps', label: 'CPS Test', icon: MousePointer2, path: '/cps-test', desc: 'Click Speed Test', color: 'text-green-400', bg: 'bg-green-900/20', border: 'hover:border-green-500/50' },
    { id: 'jitter', label: 'Jitter Click', icon: Activity, path: '/jitter-click', desc: 'Vibration Technique', color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'hover:border-orange-500/50' },
    { id: 'butterfly', label: 'Butterfly Click', icon: Fingerprint, path: '/butterfly-click', desc: 'Double Click Tech', color: 'text-pink-400', bg: 'bg-pink-900/20', border: 'hover:border-pink-500/50' },
    { id: 'rightClick', label: 'Right Click', icon: Mouse, path: '/right-click', desc: 'RMB Speed', color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'hover:border-emerald-500/50' },
    { id: 'spacebar', label: 'Spacebar', icon: Keyboard, path: '/spacebar-counter', desc: 'Keyboard Latency', color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'hover:border-purple-500/50' },
    { id: 'reaction', label: 'Reaction Time', icon: Timer, path: '/reaction-test', desc: 'Visual Reflexes', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'hover:border-yellow-500/50' },
    { id: 'dragClick', label: 'Drag Click', icon: MousePointer2, path: '/drag-click', desc: 'Friction Clicking', color: 'text-indigo-400', bg: 'bg-indigo-900/20', border: 'hover:border-indigo-500/50' },
    { id: 'scroll', label: 'Scroll Test', icon: Activity, path: '/scroll-test', desc: 'Scroll Speed Test', color: 'text-teal-400', bg: 'bg-teal-900/20', border: 'hover:border-teal-500/50' },
    { id: 'bpm', label: 'BPM Tapper', icon: Timer, path: '/bpm-tapper', desc: 'Rhythm Test', color: 'text-rose-400', bg: 'bg-rose-900/20', border: 'hover:border-rose-500/50' },
    { id: 'aim', label: 'Aim Trainer', icon: Target, path: '/aim-trainer', desc: 'Mouse Precision', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'hover:border-cyan-500/50' },
    { id: 'rollover', label: 'Key Rollover', icon: Keyboard, path: '/key-rollover', desc: 'Anti-Ghosting Test', color: 'text-amber-400', bg: 'bg-amber-900/20', border: 'hover:border-amber-500/50' },
    { id: 'doubleClick', label: 'Double Click', icon: MousePointer2, path: '/double-click', desc: 'Bounce Issue Test', color: 'text-fuchsia-400', bg: 'bg-fuchsia-900/20', border: 'hover:border-fuchsia-500/50' },
    { id: 'pollingRate', label: 'Mouse Hz', icon: Activity, path: '/polling-rate', desc: 'Sensor Polling Test', color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'hover:border-emerald-500/50' },
    { id: 'soundReaction', label: 'Audio Reflex', icon: Timer, path: '/sound-reaction', desc: 'Sound Reaction Time', color: 'text-violet-400', bg: 'bg-violet-900/20', border: 'hover:border-violet-500/50' },
    { id: 'keyboardLatency', label: 'Kb Latency', icon: Keyboard, path: '/keyboard-latency', desc: 'Key Scan Rate Check', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'hover:border-yellow-500/50' },
    { id: 'mouseAcceleration', label: 'Accel Check', icon: MousePointer2, path: '/mouse-acceleration', desc: 'Pointer Precision Test', color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'hover:border-orange-500/50' },
    { id: 'typingTest', label: 'Typing Test', icon: Keyboard, path: '/typing-test', desc: 'WPM Speed Test', color: 'text-sky-400', bg: 'bg-sky-900/20', border: 'hover:border-sky-500/50' },
    { id: 'dashboard', label: 'My Stats', icon: Activity, path: '/dashboard', desc: 'Personal Records', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'hover:border-blue-500/50' },
    { id: 'leaderboard', label: 'Leaderboards', icon: Target, path: '/leaderboard', desc: 'Global Rankings', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'hover:border-yellow-500/50' },
    { id: 'refreshRate', label: 'Hz Test', icon: Activity, path: '/refresh-rate', desc: 'Monitor Refresh Rate', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'hover:border-cyan-500/50' },
    { id: 'systemInfo', label: 'System Info', icon: Activity, path: '/system-info', desc: 'Hardware Details', color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'hover:border-emerald-500/50' },
    { id: 'keyboardGhosting', label: 'Kb Ghosting', icon: Keyboard, path: '/keyboard-ghosting', desc: 'N-Key Rollover Matrix', color: 'text-amber-400', bg: 'bg-amber-900/20', border: 'hover:border-amber-500/50' },
  ];

  // Filter out the current page to avoid self-linking (which dilutes SEO value slightly)
  const filteredTools = tools.filter(t => t.id !== currentTool).slice(0, 3); // Show top 3 related

  return (
    <nav className="border-t border-white/10 pt-12 mt-12 w-full max-w-4xl mx-auto">
        <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" /> Improve Other Skills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
                <Link 
                    key={tool.id} 
                    href={tool.path} 
                    className={`group block bg-slate-900/40 border border-white/5 rounded-xl p-6 transition-all ${tool.border}`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${tool.bg} ${tool.color}`}>
                            <tool.icon className="w-6 h-6"/>
                        </div>
                        <ArrowRight className={`w-5 h-5 text-slate-600 group-hover:${tool.color} transition-colors`}/>
                    </div>
                    <h4 className={`font-bold text-white mb-1 group-hover:${tool.color} transition-colors`}>{tool.label}</h4>
                    <p className="text-xs text-slate-400">{tool.desc}</p>
                </Link>
            ))}
        </div>
    </nav>
  );
};

export default RelatedTools;