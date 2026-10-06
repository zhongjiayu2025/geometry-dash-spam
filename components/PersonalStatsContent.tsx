"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Keyboard,
  MousePointer2,
  RotateCcw,
  Target,
  Timer,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { UserStats } from "./PersonalStats";

const DashboardWaveHistory = dynamic(() => import("./DashboardWaveHistory"), { ssr: false });

export default function PersonalStatsContent({
  stats,
  onClear,
}: {
  stats: UserStats;
  onClear: () => void;
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            My Local Records
          </h2>
          <p className="text-slate-400 text-sm">
            Your personal best scores are stored locally in this browser and are not uploaded by this dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold transition-colors border border-red-500/20"
        >
          <RotateCcw className="w-4 h-4" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <DashboardWaveHistory runs={stats.waveRuns} />

        <div className="lg:col-span-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-8 mb-2">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <MousePointer2 className="w-5 h-5 text-blue-400" /> Standard CPS Records
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 3, 5, 10, 30, 60].map((duration) => (
              <div key={duration} className="bg-black/40 rounded-xl p-4 border border-white/5 text-center">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{duration} Second</div>
                <div className="text-2xl font-bold text-white">
                  {stats.cpsTests[duration] ? stats.cpsTests[duration].toFixed(2) : "--"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <StatCard title="Jitter Click Best" value={stats.jitterCps?.toFixed(2)} unit="CPS" icon={Activity} href="/jitter-click" emptyText="Try the 10s Jitter click test" />
        <StatCard title="Butterfly Click Best" value={stats.butterflyCps?.toFixed(2)} unit="CPS" icon={MousePointer2} href="/butterfly-click" emptyText="Try the 10s Butterfly test" />
        <StatCard title="Right Click Best" value={stats.rightClickCps?.toFixed(2)} unit="CPS" icon={MousePointer2} href="/right-click" emptyText="Try the Right Click test" />
        <StatCard title="Drag Click Peak" value={stats.dragPeakCps?.toFixed(0)} unit="CPS" icon={MousePointer2} href="/drag-click" emptyText="Try the Drag Click test" />
        <StatCard title="Visual Reaction Best" value={stats.reactionMs?.toFixed(0)} unit="ms" icon={Timer} href="/reaction-test" emptyText="Try the visual reaction test" />
        <StatCard title="Sound Reaction Best" value={stats.soundReactionMs?.toFixed(0)} unit="ms" icon={Timer} href="/sound-reaction" emptyText="Try the audio reaction test" />
        <StatCard title="Aim Trainer Best" value={stats.aimScore} unit="Targets" icon={Target} href="/aim-trainer" emptyText="Play the 30s Aim challenge" />
        <StatCard title="Chimp Test Best" value={stats.chimpScore} unit="Numbers" icon={BrainCircuit} href="/chimp-test" emptyText="Test your visual memory" />
        <StatCard title="Visual Memory Best" value={stats.visualMemoryScore} unit="Levels" icon={BrainCircuit} href="/visual-memory" emptyText="Grid recall game" />
        <StatCard title="Typing Speed Best" value={stats.typingWpm} unit="WPM" icon={Keyboard} href="/typing-test" emptyText="Take the 60s Typing test" />
        <StatCard title="Spacebar Best" value={stats.spacebarCps?.toFixed(2)} unit="CPS" icon={Timer} href="/spacebar-counter" emptyText="Take the 10s Spacebar test" />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  href,
  emptyText,
}: {
  title: string;
  value: string | number | null | undefined;
  unit: string;
  icon: LucideIcon;
  href: string;
  emptyText: string;
}) {
  const numericValue = typeof value === "string" ? Number(value) : value;
  const hasValue = value !== null && value !== undefined && !Number.isNaN(numericValue);

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
          <div className="text-slate-500 text-sm italic py-2">{emptyText}</div>
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
}
