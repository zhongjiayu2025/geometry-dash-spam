"use client";

import { Check, RotateCcw, Share2, Trophy } from "lucide-react";

import { useShareResult } from "../lib/useShareResult";
interface VisualMemoryGameOverProps {
  level: number;
  bestScore: number | null;
  onRestart: () => void;
}

export default function VisualMemoryGameOver({ level, bestScore, onRestart }: VisualMemoryGameOverProps) {

  const { copied, share: shareScore } = useShareResult({
    title: "Visual Memory Test",
    text: `I reached Level ${level} on the Geometry Dash Visual Memory Test! Can you beat me?`,
    url: "https://geometrydashspam.cc/visual-memory",
  });

  return (
    <div className="text-center animate-in zoom-in-95 duration-500">
      <h3 className="mb-2 text-3xl font-bold text-red-400">OUT OF CHANCES</h3>
      <p className="mb-6 text-xl text-white">You survived to Level {level}</p>
      {bestScore !== null && (
        <div className="mb-6 flex items-center justify-center gap-2 font-bold text-yellow-400">
          <Trophy className="h-4 w-4" /> Personal Best: {bestScore}
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-bold text-fuchsia-900 shadow-lg transition-colors hover:bg-slate-200"
        >
          <RotateCcw className="h-5 w-5" /> Try Again
        </button>
        <button
          type="button"
          onClick={shareScore}
          className="flex items-center justify-center rounded-lg border border-fuchsia-500/30 bg-fuchsia-900/50 p-3 text-white transition-colors hover:bg-fuchsia-800"
          title={copied ? "Copied" : "Share your score"}
          aria-label={copied ? "Visual memory result copied" : "Share visual memory result"}
        >
          {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
