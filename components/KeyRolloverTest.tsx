"use client";

import React, { useEffect, useState } from "react";
import { isInteractiveKeyboardTarget } from "../lib/inputTarget";
import { Keyboard as KeyboardIcon } from "lucide-react";


type RolloverState = {
  activeKeys: Set<string>;
  maxKeys: number;
};

const EMPTY_ROLLOVER: RolloverState = {
  activeKeys: new Set(),
  maxKeys: 0,
};

export default function KeyRolloverTest() {
  const [measurement, setMeasurement] = useState<RolloverState>(EMPTY_ROLLOVER);
  const { activeKeys, maxKeys } = measurement;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
    if (isInteractiveKeyboardTarget(event.target)) return;
      if (
        [" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key) &&
        !(event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
      }
      if (event.repeat) return;

      setMeasurement((previous) => {
        const activeKeys = new Set(previous.activeKeys);
        activeKeys.add(event.code);
        return {
          activeKeys,
          maxKeys: Math.max(previous.maxKeys, activeKeys.size),
        };
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
    if (isInteractiveKeyboardTarget(event.target)) return;
      setMeasurement((previous) => {
        const activeKeys = new Set(previous.activeKeys);
        activeKeys.delete(event.code);
        return { ...previous, activeKeys };
      });
    };

    const clearPressed = () => {
      setMeasurement((previous) => ({ ...previous, activeKeys: new Set() }));
    };
    const handleVisibilityChange = () => {
      if (document.hidden) clearPressed();
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearPressed);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearPressed);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full mb-8 grid grid-cols-2 bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
            <div>
              <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">
                Registered now
              </div>
              <div className="text-5xl md:text-6xl font-display font-bold text-amber-400">
                {activeKeys.size}
              </div>
            </div>
            <div className="border-l border-white/10">
              <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">
                Max observed
              </div>
              <div className="text-5xl md:text-6xl font-display font-bold text-white">
                {maxKeys}
              </div>
            </div>
          </div>

          <div className="w-full min-h-64 rounded-3xl border-2 bg-amber-900/10 border-amber-500/20 p-8 flex flex-col items-center justify-center">
            {activeKeys.size === 0 ? (
              <div className="text-center text-slate-500 flex flex-col items-center">
                <KeyboardIcon className="w-16 h-16 mb-4 opacity-50 text-amber-500" />
                <h2 className="text-2xl font-display font-bold text-slate-300 mb-2">
                  Press & Hold Multiple Keys
                </h2>
                <p className="max-w-md leading-6">
                  Hold the combinations you actually use and see which key events reach this browser at the same time.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {Array.from(activeKeys).map((code) => (
                  <div
                    key={code}
                    className="px-5 py-3 bg-white text-slate-900 font-bold font-mono rounded-xl shadow-[0_4px_0_#94a3b8]"
                  >
                    {code.replace(/^(Key|Digit)/, "")}
                  </div>
                ))}
              </div>
            )}
          </div>

          {maxKeys > 0 && (
            <button
              onClick={() => setMeasurement((previous) => ({ ...previous, maxKeys: 0 }))}
              className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors text-sm"
            >
              Reset Max Record
            </button>
          )}
        </div>
      </div>
</div>
  );
}
