"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Keyboard, RotateCcw, Share2, Trophy } from "lucide-react";

const WORDS = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I", "with", "as", "not", "on", "she", "at",
  "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when",
  "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only",
  "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may",
  "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great",
  "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel",
  "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become",
  "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general",
  "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form",
  "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public",
  "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program",
  "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase",
  "early", "course", "change", "help", "line",
];

const TEST_MS = 60000;

function generateText(wordCount: number) {
  return Array.from({ length: wordCount }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(" ");
}

function scoreTyping(input: string, target: string, elapsedMs: number) {
  const typedChars = input.length;
  let correctChars = 0;

  for (let index = 0; index < typedChars; index++) {
    if (input[index] === target[index]) correctChars += 1;
  }

  const minutes = Math.max(1 / 60, elapsedMs / 60000);
  const wpm = Math.round(correctChars / 5 / minutes);
  const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;

  return { wpm, accuracy, correctChars, typedChars };
}

export default function TypingTest() {
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "finished">("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const userInputRef = useRef("");
  const targetTextRef = useRef("");

  useEffect(() => {
    const initialText = generateText(200);
    targetTextRef.current = initialText;
    setTargetText(initialText);

    const saved = localStorage.getItem("typingTestBestWpm");
    if (saved) {
      const parsed = Number(saved);
      if (Number.isFinite(parsed)) setBestWpm(parsed);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const finishTest = (elapsedMs = TEST_MS) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const result = scoreTyping(
      userInputRef.current,
      targetTextRef.current,
      Math.min(TEST_MS, Math.max(1000, elapsedMs))
    );

    setWpm(result.wpm);
    setAccuracy(result.accuracy);
    setTimeLeft(0);
    setStatus("finished");

    setBestWpm((previous) => {
      if (previous === null || result.wpm > previous) {
        localStorage.setItem("typingTestBestWpm", String(result.wpm));
        return result.wpm;
      }
      return previous;
    });
  };

  const startGame = () => {
    startTimeRef.current = performance.now();
    setStatus("running");

    timerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, (TEST_MS - elapsed) / 1000);
      setTimeLeft(remaining);

      if (elapsed >= TEST_MS) {
        finishTest(elapsed);
      }
    }, 50);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (status === "finished") return;

    const value = event.target.value;

    if (status === "idle") {
      startGame();
    }

    userInputRef.current = value;
    setUserInput(value);

    if (value.length > targetTextRef.current.length - 100) {
      const extended = targetTextRef.current + " " + generateText(50);
      targetTextRef.current = extended;
      setTargetText(extended);
    }
  };

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startTimeRef.current = 0;
    userInputRef.current = "";

    const nextText = generateText(200);
    targetTextRef.current = nextText;

    setStatus("idle");
    setTimeLeft(60);
    setUserInput("");
    setTargetText(nextText);
    setWpm(0);
    setAccuracy(100);

    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const shareScore = async () => {
    const text = `I typed ${wpm} WPM with ${accuracy}% character accuracy on the 60-second typing test.`;
    const url = "https://geometrydashspam.cc/typing-test";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Typing Speed Test", text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderText = () =>
    targetText.split("").map((char, index) => {
      let color = "text-slate-500";

      if (index < userInput.length) {
        color = userInput[index] === char ? "text-white" : "text-red-500 bg-red-500/20";
      } else if (index === userInput.length) {
        color = "text-slate-300 border-l border-white animate-pulse";
      }

      return (
        <span key={index} className={color}>
          {char}
        </span>
      );
    });

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
            <div className="w-full bg-slate-900/40 border border-sky-500/30 rounded-3xl p-8 text-center">
              <h2 className="text-3xl text-sky-200 font-bold mb-6">Test Complete</h2>

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                <div className="bg-slate-800/50 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Speed</div>
                  <div className="text-4xl font-bold text-sky-400">{wpm} WPM</div>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Character accuracy</div>
                  <div className="text-4xl font-bold text-white">{accuracy}%</div>
                </div>
              </div>

              {bestWpm !== null && (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-black/40 px-4 py-2 rounded-full border border-white/10 mb-8 mx-auto w-max">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Personal Best: <strong className="text-white">{bestWpm} WPM</strong>
                </div>
              )}

              <p className="text-sm leading-6 text-slate-500 max-w-xl mx-auto mb-7">
                WPM is calculated from correctly matched characters using the common five-characters-per-word convention over the 60-second test.
              </p>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={resetTest}
                  className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> Try Again
                </button>
                <button
                  onClick={shareScore}
                  className="p-4 bg-slate-800 text-white rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors border border-white/10"
                  title={copied ? "Copied" : "Share your score"}
                  aria-label={copied ? "Typing result copied" : "Share typing result"}
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
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

              <div className="text-xl md:text-2xl font-mono leading-relaxed max-h-64 overflow-hidden mask-image:linear-gradient(to_bottom,black_60%,transparent)">
                {renderText()}
              </div>

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
              />
            </div>
          )}
        </div>
      </div>
</div>
  );
}
