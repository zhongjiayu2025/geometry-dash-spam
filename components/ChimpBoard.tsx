"use client";

import type { ChimpNumber } from "../lib/memoryTestRuntime";

export default function ChimpBoard({
  gameState,
  numbers,
  onNumberClick,
}: {
  gameState: "showing" | "playing" | "failed";
  numbers: ChimpNumber[];
  onNumberClick: (value: number) => void;
}) {
  return (
    <div className="relative w-full max-w-[600px] aspect-[8/5] bg-black/20 rounded-xl overflow-hidden border border-white/5">
      {numbers.map((number) => {
        if (number.clicked) return null;

        return (
          <button
            key={number.id}
            type="button"
            onClick={() => onNumberClick(number.val)}
            style={{
              left: `${(number.x / 8) * 100}%`,
              top: `${(number.y / 5) * 100}%`,
              width: `${100 / 8}%`,
              height: `${100 / 5}%`,
            }}
            className="absolute flex items-center justify-center p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-400"
            disabled={gameState === "failed"}
            aria-label={number.hidden ? "Hidden number tile" : `Number ${number.val}`}
          >
            <span
              className={`w-full h-full flex items-center justify-center rounded-lg shadow-md font-display font-medium text-xl md:text-2xl transition-all duration-150 border active:scale-95 ${number.hidden ? "bg-indigo-600/90 border-indigo-400/30 text-transparent" : "bg-white border-white text-indigo-900 hover:bg-slate-100"} ${gameState === "failed" ? "bg-red-500/20 border-red-500 text-white" : ""}`}
            >
              {!number.hidden && number.val}
            </span>
          </button>
        );
      })}
    </div>
  );
}
