"use client";

import { Check, RotateCcw, Share2, Trophy } from "lucide-react";

import { useShareResult } from "../lib/useShareResult";
interface TypingResultProps {
  wpm: number;
  accuracy: number;
  bestWpm: number | null;
  onReset: () => void;
}

export default function TypingResult({ wpm, accuracy, bestWpm, onReset }: TypingResultProps) {

  const { copied, share: shareScore } = useShareResult({
    title: "Typing Speed Test",
    text: `I typed ${wpm} WPM with ${accuracy}% character accuracy on the 60-second typing test.`,
    url: "https://geometrydashspam.cc/typing-test",
  });

  return (
    <div className="w-full rounded-3xl border border-sky-500/30 bg-slate-900/40 p-8 text-center">
      <h2 className="mb-6 text-3xl font-bold text-sky-200">Test Complete</h2>
      <div className="mx-auto mb-6 grid max-w-lg grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-800/50 p-5">
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">Speed</div>
          <div className="text-4xl font-bold text-sky-400">{wpm} WPM</div>
        </div>
        <div className="rounded-2xl bg-slate-800/50 p-5">
          <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">Character accuracy</div>
          <div className="text-4xl font-bold text-white">{accuracy}%</div>
        </div>
      </div>
      {bestWpm !== null && (
        <div className="mx-auto mb-8 flex w-max items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-300">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Personal Best: <strong className="text-white">{bestWpm} WPM</strong>
        </div>
      )}
      <p className="mx-auto mb-7 max-w-xl text-sm leading-6 text-slate-500">
        WPM is calculated from correctly matched characters using the common five-characters-per-word convention over the 60-second test.
      </p>
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-4 font-bold text-white transition-colors hover:bg-sky-500"
        >
          <RotateCcw className="h-5 w-5" /> Try Again
        </button>
        <button
          type="button"
          onClick={shareScore}
          className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-800 p-4 text-white transition-colors hover:bg-slate-700"
          title={copied ? "Copied" : "Share your score"}
          aria-label={copied ? "Typing result copied" : "Share typing result"}
        >
          {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
