"use client";

import type { MouseEvent, RefObject } from "react";
import { Activity, Crown, Maximize, Minimize, Volume2, VolumeX, ZapOff } from "lucide-react";
import { GameStatus } from "../types";

export default function WaveCanvasHud({
  status,
  isEndless,
  highScore,
  runTimeSeconds,
  progressPercent,
  timeDisplayRef,
  progressRef,
  reduceMotion,
  onToggleMotion,
  canFullscreen,
  isFullscreen,
  onToggleFullscreen,
  isMuted,
  onToggleMute,
}: {
  status: GameStatus;
  isEndless: boolean;
  highScore: number;
  runTimeSeconds: number;
  progressPercent: number;
  timeDisplayRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  onToggleMotion: (event: MouseEvent<HTMLButtonElement>) => void;
  canFullscreen: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isMuted: boolean;
  onToggleMute: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <>
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
          <div
            ref={timeDisplayRef}
            className="text-3xl sm:text-4xl font-display font-black text-white italic drop-shadow-lg tabular-nums"
          >
            {runTimeSeconds.toFixed(2)}s
          </div>

          {!isEndless ? (
            <div className="w-32 sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
              <div
                ref={progressRef}
                className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest">
                Best: {highScore.toFixed(2)}s
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            aria-label={reduceMotion ? "Enable motion effects" : "Reduce motion effects"}
            aria-pressed={reduceMotion}
            title={reduceMotion ? "Enable Motion/Pulse" : "Reduce Motion/Shake"}
            onClick={onToggleMotion}
            className={`p-2 rounded-full backdrop-blur-md transition-colors border border-transparent ${reduceMotion ? "bg-blue-600 text-white border-blue-400" : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white"}`}
          >
            {reduceMotion ? <ZapOff className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
          </button>

          {canFullscreen && (
            <button
              type="button"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              aria-pressed={isFullscreen}
              title="Toggle Fullscreen"
              onClick={(event) => {
                event.stopPropagation();
                onToggleFullscreen();
              }}
              className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          )}

          <button
            type="button"
            aria-label={isMuted ? "Unmute" : "Mute"}
            aria-pressed={isMuted}
            onClick={onToggleMute}
            className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {status === GameStatus.Playing && (
        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300 backdrop-blur sm:hidden pointer-events-none">
          Hold = rise · release = fall
        </div>
      )}
    </>
  );
}
