"use client";

import { Check, RotateCcw, Share2 } from "lucide-react";

import { useShareResult } from "../lib/useShareResult";
type Variant = "jitter" | "butterfly" | "rightClick";

const STYLES: Record<Variant, { reset: string }> = {
  jitter: {
    reset: "bg-white text-orange-900 hover:bg-orange-50",
  },
  butterfly: {
    reset: "bg-white text-pink-900 hover:bg-pink-50",
  },
  rightClick: {
    reset: "bg-white text-emerald-900 hover:bg-emerald-50",
  },
};

export default function SecondaryClickFinishedActions({
  variant,
  onReset,
  shareTitle,
  shareText,
  shareUrl,
  withTopMargin = false,
}: {
  variant: Variant;
  onReset: () => void;
  shareTitle: string;
  shareText: string;
  shareUrl: string;
  withTopMargin?: boolean;
}) {

  const { copied, share: shareScore } = useShareResult({
    title: shareTitle,
    text: shareText,
    url: shareUrl,
  });

  return (
    <div
      className={`${withTopMargin ? "mt-8 " : ""}relative z-10 flex gap-2 animate-in fade-in zoom-in duration-300`}
    >
      <button
        type="button"
        onClick={onReset}
        className={`flex items-center gap-2 rounded-lg px-8 py-3 font-bold shadow-lg transition-colors ${STYLES[variant].reset}`}
      >
        <RotateCcw className="h-5 w-5" aria-hidden="true" />
        TRY AGAIN
      </button>
      <button
        type="button"
        onClick={() => void shareScore()}
        className="flex items-center justify-center rounded-lg border border-white/10 bg-slate-800 p-3 text-white transition-colors hover:bg-slate-700"
        title="Share your score"
        aria-label={copied ? "Score copied" : "Share your score"}
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
        ) : (
          <Share2 className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
