"use client";

import React, { useState } from "react";
import { Check, Share2, Trophy } from "lucide-react";

interface ReactionResultProps {
  result: number;
  bestScore: number | null;
}

export default function ReactionResult({ result, bestScore }: ReactionResultProps) {
  const [copied, setCopied] = useState(false);

  const shareScore = async (event: React.PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const text = `I got a reaction time of ${result}ms on the Geometry Dash Reaction Test! Can you beat me?`;
    const url = "https://geometrydashspam.cc/reaction-test";

    if (navigator.share) {
      try {
        await navigator.share({ title: "Reaction Time Test", text, url });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="mb-2 text-8xl font-display font-black text-white text-glow">{result} ms</div>
      <p className="mb-6 text-xl text-slate-300">Your reaction time</p>
      {bestScore && (
        <div className="mb-8 flex items-center justify-center gap-2 font-bold text-yellow-400">
          <Trophy className="h-4 w-4" /> Best: {bestScore} ms
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-slate-700 px-6 py-3 font-bold text-white transition-colors hover:bg-slate-600">
          Click to Try Again
        </div>
        <button
          type="button"
          onPointerDown={shareScore}
          className="relative z-10 flex items-center justify-center rounded-full border border-white/10 bg-slate-800 p-3 text-white transition-colors hover:bg-slate-700"
          title={copied ? "Copied" : "Share your score"}
          aria-label={copied ? "Reaction result copied" : "Share reaction result"}
        >
          {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}
