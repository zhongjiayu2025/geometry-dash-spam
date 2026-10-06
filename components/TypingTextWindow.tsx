"use client";

import { memo } from "react";

function TypingTextWindow({
  targetText,
  userInput,
}: {
  targetText: string;
  userInput: string;
}) {
  const inputLength = userInput.length;
  const rawStart = Math.max(0, Math.floor(inputLength / 160) * 160 - 40);
  const previousSpace = rawStart > 0 ? targetText.lastIndexOf(" ", rawStart) : 0;
  const visibleStart = previousSpace > 0 ? previousSpace + 1 : 0;
  const visibleEnd = Math.min(targetText.length, visibleStart + 650);

  return (
    <div className="text-xl md:text-2xl font-mono leading-relaxed min-h-40 max-h-64 overflow-hidden mask-image:linear-gradient(to_bottom,black_70%,transparent)">
      {targetText.slice(visibleStart, visibleEnd).split("").map((char, offset) => {
        const index = visibleStart + offset;
        let color = "text-slate-500";

        if (index < inputLength) {
          color = userInput[index] === char ? "text-white" : "text-red-500 bg-red-500/20";
        } else if (index === inputLength) {
          color = "text-slate-300 border-l border-white animate-pulse";
        }

        return (
          <span key={index} className={color}>
            {char}
          </span>
        );
      })}
    </div>
  );
}

export default memo(TypingTextWindow);
