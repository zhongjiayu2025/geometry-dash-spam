"use client";

import type { ReactNode } from "react";
import { Timer, Trophy, Volume2, VolumeX } from "lucide-react";

export function ClickTestTimerCard({
  timeLeft,
  soundEnabled,
  onToggleSound,
  timerAccentClass,
  soundOnClass,
  progress,
}: {
  timeLeft: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  timerAccentClass: string;
  soundOnClass: string;
  progress?: number;
}) {
  const normalizedProgress = progress === undefined
    ? null
    : Math.max(0, Math.min(1, progress));

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-white/10 p-4 sm:p-6 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg bg-slate-800 ${timerAccentClass}`}>
          <Timer className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Time Remaining</h3>
          <p className="text-3xl font-mono font-bold text-white tabular-nums">{timeLeft.toFixed(2)}s</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? "Mute click sound" : "Enable click sound"}
          aria-pressed={soundEnabled}
          className={`p-3 rounded-xl border transition-colors ${soundEnabled ? soundOnClass : "bg-slate-800 border-white/10 text-slate-500 hover:text-slate-300"}`}
          title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {normalizedProgress !== null && (
          <div className="h-12 w-12 rounded-full border-4 border-slate-700 flex items-center justify-center relative" aria-hidden="true">
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-blue-600"
                strokeDasharray={113}
                strokeDashoffset={113 * (1 - normalizedProgress)}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export function ClickTestSpeedPanel({
  title,
  value,
  accentClass,
  bestCps,
  bestLabel = "Personal Best",
  children,
  hoverAccent = false,
}: {
  title: string;
  value: string;
  accentClass: string;
  bestCps: number | null | undefined;
  bestLabel?: string;
  children?: ReactNode;
  hoverAccent?: boolean;
}) {
  return (
    <div className="flex-grow bg-slate-900/50 backdrop-blur border border-white/10 p-5 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
      {hoverAccent && (
        <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
      )}

      <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">{title}</h3>
      <div className="text-5xl sm:text-7xl font-display font-black text-white mb-2 text-glow relative z-10">{value}</div>
      <div className={`text-xl ${accentClass} font-mono relative z-10 mb-6`}>CPS</div>

      {bestCps ? (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 mb-6 relative z-10">
          <Trophy className="w-4 h-4 text-yellow-500" />
          {bestLabel}: <strong className="text-white">{bestCps.toFixed(2)} CPS</strong>
        </div>
      ) : null}

      {children}
    </div>
  );
}
