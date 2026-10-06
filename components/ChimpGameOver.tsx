"use client";

import { Check, RotateCcw, Share2, Trophy } from "lucide-react";

import { useShareResult } from "../lib/useShareResult";
interface ChimpGameOverProps {
  level: number;
  bestScore: number | null;
  onRestart: () => void;
}

export default function ChimpGameOver({ level, bestScore, onRestart }: ChimpGameOverProps) {

  const { copied, share: shareScore } = useShareResult({
    title: "Chimp Memory Test",
    text: `I reached Level ${level} on the Geometry Dash Chimp Test! How far can you get?`,
    url: "https://geometrydashspam.cc/chimp-test",
  });

  return (
    <div className="text-center animate-in zoom-in-95 duration-500">
      <h3 className="mb-2 text-3xl font-bold text-red-400">GAME OVER</h3>
      <p className="mb-4 text-xl text-white">You reached Level {level}</p>
      {bestScore !== null && (
        <div className="mb-6 flex items-center justify-center gap-2 font-bold text-yellow-400">
          <Trophy className="h-4 w-4" /> Personal Best: {bestScore}
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-bold text-indigo-900 shadow-lg transition-colors hover:bg-slate-200"
        >
          <RotateCcw className="h-5 w-5" /> Play Again
        </button>
        <button
          type="button"
          onClick={shareScore}
          className="flex items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-900/50 p-3 text-white transition-colors hover:bg-indigo-800"
          title={copied ? "Copied" : "Share your score"}
          aria-label={copied ? "Chimp result copied" : "Share chimp result"}
        >
          {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
