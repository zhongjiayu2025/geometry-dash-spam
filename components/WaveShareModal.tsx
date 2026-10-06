"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2, X } from "lucide-react";
import { useManagedTimeout } from "../lib/useManagedTimeout";

export default function WaveShareModal({
  shareText,
  onClose,
}: {
  shareText: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { schedule: scheduleCopiedReset } = useManagedTimeout();

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      scheduleCopiedReset(() => setCopied(false), 2000);
    } catch {}
  };

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wave-share-title"
        className="share-modal-content relative w-[90%] max-w-sm rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close share dialog"
          onClick={onClose}
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
          type="button"
          onClick={copyShare}
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
  );
}
