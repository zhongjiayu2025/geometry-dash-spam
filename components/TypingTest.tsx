"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Keyboard } from "lucide-react";
import TypingTextWindow from "./TypingTextWindow";
import { usePersistentBestNumber } from "../lib/usePersistentBestNumber";
import { useExactCountdown } from "../lib/useExactCountdown";

const TypingResult = dynamic(() => import("./TypingResult"), { ssr: false });

type TypingRuntime = typeof import("../lib/typingRuntime");

const TEST_MS = 60000;

export default function TypingTest() {
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "finished">("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, commitBestWpm] = usePersistentBestNumber("typingTestBestWpm");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef(0);
  const userInputRef = useRef("");
  const targetTextRef = useRef("");
  const runtimeRef = useRef<TypingRuntime | null>(null);
  const runtimeLoadRef = useRef<Promise<TypingRuntime | null> | null>(null);

  const ensureRuntime = useCallback(async () => {
    if (runtimeRef.current) return runtimeRef.current;
    if (!runtimeLoadRef.current) {
      runtimeLoadRef.current = import("../lib/typingRuntime").catch(() => null);
    }
    const runtime = await runtimeLoadRef.current;
    if (runtime) runtimeRef.current = runtime;
    return runtime;
  }, []);

  useEffect(() => {
    let cancelled = false;
    void ensureRuntime().then((runtime) => {
      if (!runtime || cancelled) return;
      const initialText = runtime.generateTypingText(200);
      targetTextRef.current = initialText;
      setTargetText(initialText);
    });

    return () => {
      cancelled = true;
    };
  }, [ensureRuntime]);

  const finishTest = (elapsedMs = TEST_MS) => {
    const runtime = runtimeRef.current;
    if (!runtime) return;

    const result = runtime.scoreTyping(
      userInputRef.current,
      targetTextRef.current,
      Math.min(TEST_MS, Math.max(1000, elapsedMs))
    );

    setWpm(result.wpm);
    setAccuracy(result.accuracy);
    setTimeLeft(0);
    setStatus("finished");

    commitBestWpm(result.wpm);
  };

  const cancelCountdown = useExactCountdown({
    running: status === "running",
    durationMs: TEST_MS,
    startTimeRef,
    onTick: (remainingMs) => setTimeLeft(remainingMs / 1000),
    onFinish: () => finishTest(TEST_MS),
  });

  const startGame = () => {
    cancelCountdown();
    startTimeRef.current = performance.now();
    setStatus("running");
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (status === "finished") return;
    if (
      status === "running" &&
      performance.now() - startTimeRef.current >= TEST_MS
    ) {
      finishTest(TEST_MS);
      return;
    }

    const value = event.target.value;

    if (status === "idle") {
      startGame();
    }

    userInputRef.current = value;
    setUserInput(value);

    if (value.length > targetTextRef.current.length - 100) {
      const runtime = runtimeRef.current;
      if (!runtime) return;
      const extended = targetTextRef.current + " " + runtime.generateTypingText(50);
      targetTextRef.current = extended;
      setTargetText(extended);
    }
  };

  const resetTest = () => {
    cancelCountdown();
    startTimeRef.current = 0;
    userInputRef.current = "";

    const runtime = runtimeRef.current;
    if (!runtime) return;
    const nextText = runtime.generateTypingText(200);
    targetTextRef.current = nextText;

    setStatus("idle");
    setTimeLeft(60);
    setUserInput("");
    setTargetText(nextText);
    setWpm(0);
    setAccuracy(100);

    window.setTimeout(() => inputRef.current?.focus(), 0);
  };




  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full mb-8 grid grid-cols-2 bg-slate-900/50 p-5 rounded-2xl border border-white/5 text-center">
            <div>
              <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Time Left</div>
              <div className={`text-4xl md:text-5xl font-display font-bold ${timeLeft < 10 && status === "running" ? "text-red-400" : "text-sky-400"}`}>
                {Math.ceil(timeLeft)}s
              </div>
            </div>
            <div className="border-l border-white/10">
              <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Result</div>
              <div className="text-4xl md:text-5xl font-display font-bold text-white">
                {status === "finished" ? `${wpm} WPM` : "--"}
              </div>
            </div>
          </div>

          {status === "finished" ? (
            <TypingResult
              wpm={wpm}
              accuracy={accuracy}
              bestWpm={bestWpm}
              onReset={resetTest}
            />
          ) : (
            <div
              className="w-full min-h-64 rounded-3xl border-2 bg-slate-900/40 border-white/10 p-6 md:p-8 relative cursor-text group"
              onClick={() => inputRef.current?.focus()}
            >
              {!userInput && status === "idle" && (
                <div className="absolute top-0 right-0 p-4">
                  <span className="animate-pulse text-xs uppercase tracking-widest text-sky-500 font-bold flex items-center gap-2">
                    <Keyboard className="w-4 h-4" /> Start typing
                  </span>
                </div>
              )}

              <TypingTextWindow targetText={targetText} userInput={userInput} />

              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleChange}
                className="absolute opacity-0 w-px h-px left-0 bottom-0"
                aria-label="Typing test input"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
                disabled={!targetText}
              />
            </div>
          )}
        </div>
      </div>
</div>
  );
}
