"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Copy,
  Crown,
  Menu,
  RotateCcw,
  Share2,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { GameStatus } from "../types";

export interface WaveRunStats {
  clickCount: number;
  averageCps: number;
  peakCps: number;
  intervalStdDev: number;
}

type WaveRunOverlaysProps = {
  status: GameStatus;
  isNewBest: boolean;
  runTimeSeconds: number;
  highScore: number;
  runStats: WaveRunStats;
  consistency: string;
  showShareModal: boolean;
  shareText: string;
  copied: boolean;
  onRetry: () => void;
  onMenu: () => void;
  onShare: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseShare: () => void;
  onCopyShare: () => void;
};

export default function WaveRunOverlays({
  status,
  isNewBest,
  runTimeSeconds,
  highScore,
  runStats,
  consistency,
  showShareModal,
  shareText,
  copied,
  onRetry,
  onMenu,
  onShare,
  onCloseShare,
  onCopyShare,
}: WaveRunOverlaysProps) {
  return (
    <>
      {status === GameStatus.Lost && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-sm animate-in zoom-in duration-100">
          <div
            className="pointer-events-auto flex max-h-[calc(100%_-_1rem)] w-[calc(100%_-_1rem)] max-w-md flex-col items-center overflow-y-auto rounded-2xl border border-white/10 bg-black/55 p-4 shadow-2xl backdrop-blur-md sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            {isNewBest && (
              <div className="mb-4 flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-1 font-black uppercase tracking-widest text-black shadow-lg shadow-yellow-500/50 animate-bounce">
                <Crown className="h-4 w-4" /> New Best Score!
              </div>
            )}

            <AlertTriangle className="mb-1 h-10 w-10 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] sm:mb-2 sm:h-16 sm:w-16" />
            <h2 className="mb-2 text-3xl font-display font-black tracking-tighter text-white sm:text-5xl">CRASHED</h2>

            <div className="mb-4 grid w-full grid-cols-2 gap-2 sm:mb-6 sm:gap-3">
              <Metric label="Survival" value={`${runTimeSeconds.toFixed(2)}s`} />
              <Metric label="Local Best" value={`${highScore.toFixed(2)}s`} valueClass="text-yellow-400" />
              <Metric label="Average CPS" value={runStats.averageCps.toFixed(2)} valueClass="text-blue-300" />
              <Metric label="Clicks" value={String(runStats.clickCount)} />
              <Metric label="Peak CPS" value={runStats.peakCps.toFixed(2)} valueClass="text-purple-300" />
              <Metric label="Timing SD" value={`${runStats.intervalStdDev.toFixed(0)}ms`} />
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                onClick={onRetry}
                className="flex items-center gap-2 rounded bg-white px-4 py-2.5 font-bold text-black shadow-lg transition-colors hover:bg-slate-200 sm:px-6 sm:py-3"
              >
                <RotateCcw className="h-4 w-4" /> RETRY
              </button>
              <Link
                href="/cps-test"
                className="rounded border border-white/10 bg-slate-800 px-4 py-2.5 font-bold text-white transition-colors hover:bg-slate-700 sm:px-5 sm:py-3"
              >
                CHECK CPS
              </Link>
              <button
                onClick={onShare}
                className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2.5 font-bold text-white shadow-lg transition-colors hover:bg-blue-500 sm:px-6 sm:py-3"
              >
                <Share2 className="h-4 w-4" /> SHARE
              </button>
            </div>

            <button
              onClick={onMenu}
              className="mt-4 flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <Menu className="h-3 w-3" /> RETURN TO MENU
            </button>
          </div>
        </div>
      )}

      {status === GameStatus.Won && (
        <div
          className="pointer-events-auto absolute inset-0 z-20 flex flex-col items-center justify-center bg-green-900/40 backdrop-blur-sm animate-in zoom-in duration-500"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex max-h-[calc(100%_-_1rem)] w-[calc(100%_-_1rem)] max-w-md flex-col items-center overflow-y-auto rounded-2xl border border-white/10 bg-black/55 p-4 shadow-2xl backdrop-blur-md sm:p-8">
            {isNewBest && (
              <div className="mb-4 flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-1 font-black uppercase tracking-widest text-black shadow-lg shadow-yellow-500/50 animate-bounce">
                <Crown className="h-4 w-4" /> New Best Score!
              </div>
            )}

            <Trophy className="mb-2 h-12 w-12 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce sm:mb-4 sm:h-20 sm:w-20" />
            <h2 className="mb-2 text-3xl font-display font-black tracking-tighter text-white sm:text-5xl">COMPLETE!</h2>

            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Zap className="h-5 w-5 text-yellow-400" />
              <p className="font-mono text-lg text-green-100">
                Consistency Score: <span className="text-xl font-bold text-white">{consistency}</span>
              </p>
            </div>

            <div className="mb-4 grid w-full grid-cols-3 gap-2 sm:mb-6 sm:gap-3">
              <Metric compact label="Average CPS" value={runStats.averageCps.toFixed(2)} valueClass="text-blue-300" />
              <Metric compact label="Peak CPS" value={runStats.peakCps.toFixed(2)} valueClass="text-purple-300" />
              <Metric compact label="Clicks" value={String(runStats.clickCount)} />
            </div>

            <div className="mb-3 flex flex-wrap justify-center gap-2 sm:mb-4 sm:gap-3">
              <button
                onClick={onRetry}
                className="flex items-center gap-2 rounded bg-white px-4 py-2.5 font-bold text-black shadow-lg transition-colors hover:bg-slate-200 sm:px-6 sm:py-3"
              >
                <RotateCcw className="h-4 w-4" /> REPLAY
              </button>
              <Link
                href="/cps-test"
                className="rounded border border-white/10 bg-slate-800 px-4 py-2.5 font-bold text-white transition-colors hover:bg-slate-700 sm:px-5 sm:py-3"
              >
                CHECK CPS
              </Link>
              <button
                onClick={onShare}
                className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2.5 font-bold text-white shadow-lg transition-colors hover:bg-blue-500 sm:px-6 sm:py-3"
              >
                <Share2 className="h-4 w-4" /> SHARE
              </button>
            </div>

            <button
              onClick={onMenu}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <Menu className="h-3 w-3" /> RETURN TO MENU
            </button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onCloseShare}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wave-share-title"
            className="share-modal-content relative w-[90%] max-w-sm rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close share dialog"
              onClick={onCloseShare}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 id="wave-share-title" className="mb-4 flex items-center gap-2 text-xl font-display font-bold text-white">
              <Share2 className="h-5 w-5 text-blue-400" /> Share Result
            </h3>

            <div className="mb-4 rounded-lg border border-white/5 bg-black/50 p-4">
              <p className="select-all whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-slate-300">
                {shareText}
              </p>
            </div>

            <button
              onClick={onCopyShare}
              className={`mb-4 flex w-full items-center justify-center gap-2 rounded py-3 font-bold transition-all ${copied ? "bg-green-600 text-white" : "bg-white text-black hover:bg-slate-200"}`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "COPIED!" : "COPY TEXT"}
            </button>

            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded bg-[#1DA1F2] py-2 text-center text-white transition-colors hover:bg-[#1a91da]"
              >
                <span className="text-sm font-bold">X</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://geometrydashspam.cc")}&quote=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded bg-[#4267B2] py-2 text-center text-white transition-colors hover:bg-[#365899]"
              >
                <span className="text-sm font-bold">f</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Metric({
  label,
  value,
  valueClass = "text-white",
  compact = false,
}: {
  label: string;
  value: string;
  valueClass?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-lg bg-white/5 p-2 text-center sm:p-3">
      <div className={`${compact ? "text-[10px]" : "text-xs"} mb-1 uppercase tracking-wider text-slate-400`}>{label}</div>
      <div className={`${compact ? "text-lg" : "text-xl"} font-mono font-bold ${valueClass}`}>{value}</div>
    </div>
  );
}
