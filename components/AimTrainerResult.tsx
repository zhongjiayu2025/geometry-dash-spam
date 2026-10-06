"use client";

import React, { useState } from "react";
import { Check, RotateCcw, Share2 } from "lucide-react";

interface AimTrainerResultProps {
  score: number;
  misses: number;
  accuracy: string;
  averageTime: number;
  onReset: () => void;
}

export default function AimTrainerResult({ score, misses, accuracy, averageTime, onReset }: AimTrainerResultProps) {
  const [copied, setCopied] = useState(false);

  const shareScore = async () => {
    const text = `I got a score of ${score} with ${accuracy}% accuracy on the Geometry Dash Aim Trainer!`;
    const url = "https://geometrydashspam.cc/aim-trainer";

    if (navigator.share) {
      try {
        await navigator.share({ title: "Aim Trainer Test", text, url });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full animate-in zoom-in-95 duration-500">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-cyan-900/20 p-8 text-center">
        <h3 className="mb-2 text-2xl font-bold text-cyan-200">Trainer Complete!</h3>
        <div className="my-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="mb-1 text-sm uppercase tracking-wider text-slate-400">Score</div>
            <div className="text-3xl font-bold text-cyan-400">{score}</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="mb-1 text-sm uppercase tracking-wider text-slate-400">Misses</div>
            <div className="text-3xl font-bold text-rose-400">{misses}</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="mb-1 text-sm uppercase tracking-wider text-slate-400">Accuracy</div>
            <div className="text-3xl font-bold text-white">{accuracy}%</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="mb-1 text-sm uppercase tracking-wider text-slate-400">Avg Hit Interval</div>
            <div className="text-3xl font-bold text-yellow-400">{averageTime}ms</div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-8 py-4 font-bold text-white shadow-lg shadow-cyan-600/20 transition-colors hover:bg-cyan-500"
          >
            <RotateCcw className="h-5 w-5" /> Try Again
          </button>
          <button
            type="button"
            onClick={shareScore}
            className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-800 px-5 py-4 text-white transition-colors hover:bg-slate-700"
            title={copied ? "Copied" : "Share your score"}
            aria-label={copied ? "Aim result copied" : "Share aim result"}
          >
            {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
