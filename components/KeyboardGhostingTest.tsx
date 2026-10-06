"use client";

import React, { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";


const virtualKeyboardLayout = [
  ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
  ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
  ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"],
  ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
  ["ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "MetaRight", "ContextMenu", "ControlRight"],
];

const keyLabels: Record<string, string> = {
  Escape: "Esc", Backquote: "`", Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4", Digit5: "5", Digit6: "6", Digit7: "7", Digit8: "8", Digit9: "9", Digit0: "0",
  Minus: "-", Equal: "=", Backspace: "Backspace", Tab: "Tab", KeyQ: "Q", KeyW: "W", KeyE: "E", KeyR: "R", KeyT: "T", KeyY: "Y", KeyU: "U", KeyI: "I", KeyO: "O", KeyP: "P",
  BracketLeft: "[", BracketRight: "]", Backslash: "\\", CapsLock: "Caps", KeyA: "A", KeyS: "S", KeyD: "D", KeyF: "F", KeyG: "G", KeyH: "H", KeyJ: "J", KeyK: "K", KeyL: "L",
  Semicolon: ";", Quote: "'", Enter: "Enter", ShiftLeft: "Shift L", KeyZ: "Z", KeyX: "X", KeyC: "C", KeyV: "V", KeyB: "B", KeyN: "N", KeyM: "M", Comma: ",", Period: ".", Slash: "/",
  ShiftRight: "Shift R", ControlLeft: "Ctrl L", MetaLeft: "Win", AltLeft: "Alt", Space: "Space", AltRight: "Alt", MetaRight: "Win", ContextMenu: "Menu", ControlRight: "Ctrl R",
};

const getKeyWidthClass = (code: string) => {
  switch (code) {
    case "Backspace": return "w-24";
    case "Tab": return "w-20";
    case "Backslash": return "w-16";
    case "CapsLock": return "w-24";
    case "Enter": return "w-28";
    case "ShiftLeft": return "w-28";
    case "ShiftRight": return "w-32";
    case "ControlLeft":
    case "ControlRight":
    case "AltLeft":
    case "AltRight":
    case "MetaLeft":
    case "MetaRight":
    case "ContextMenu": return "w-16";
    case "Space": return "flex-1 min-w-[200px]";
    default: return "w-12";
  }
};

type GhostingState = {
  pressedKeys: Set<string>;
  maxKeys: number;
};

const EMPTY_GHOSTING: GhostingState = {
  pressedKeys: new Set(),
  maxKeys: 0,
};

export default function KeyboardGhostingTest() {
  const [measurement, setMeasurement] = useState<GhostingState>(EMPTY_GHOSTING);
  const { pressedKeys, maxKeys } = measurement;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!["F5", "F11", "F12"].includes(event.code) && !(event.ctrlKey || event.metaKey)) {
        event.preventDefault();
      }

      setMeasurement((previous) => {
        const pressedKeys = new Set(previous.pressedKeys);
        pressedKeys.add(event.code);
        return {
          pressedKeys,
          maxKeys: Math.max(previous.maxKeys, pressedKeys.size),
        };
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setMeasurement((previous) => {
        const pressedKeys = new Set(previous.pressedKeys);
        pressedKeys.delete(event.code);
        return { ...previous, pressedKeys };
      });
    };

    const handleBlur = () => {
      setMeasurement((previous) => ({ ...previous, pressedKeys: new Set() }));
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const reset = () => {
    setMeasurement({ pressedKeys: new Set(), maxKeys: 0 });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Maximum registered together</div>
            <div className="text-4xl font-display font-black text-amber-400">
              {maxKeys} <span className="text-xl text-slate-500">keys</span>
            </div>
          </div>
          <button
            onClick={reset}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
            aria-label="Reset key rollover test"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Currently registered</div>
          <div className="text-4xl font-display font-black text-white">{pressedKeys.size}</div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            If an expected key does not light while you hold a combination, the browser did not receive that key event.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl overflow-x-auto min-w-full">
        <div className="min-w-[800px] flex flex-col gap-2 mx-auto">
          {virtualKeyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((code) => {
                const isPressed = pressedKeys.has(code);
                return (
                  <div
                    key={code}
                    className={
                      `${getKeyWidthClass(code)} h-14 rounded-xl border-b-4 flex items-center justify-center font-bold text-sm transition-all duration-75 ` +
                      (isPressed
                        ? "bg-amber-500 text-white border-amber-700 translate-y-1 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                        : "bg-slate-800 text-slate-300 border-black shadow-lg")
                    }
                  >
                    {keyLabels[code] || code.replace("Key", "")}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

</div>
  );
}
