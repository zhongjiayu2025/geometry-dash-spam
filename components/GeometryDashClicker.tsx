"use client";

import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, Sparkles, Zap } from "lucide-react";

type SaveState = {
  orbs: number;
  clickPower: number;
  autoPower: number;
  prestige: number;
  totalClicks: number;
};

const STORAGE_KEY = "gd_clicker_v1";
const INITIAL: SaveState = { orbs: 0, clickPower: 1, autoPower: 0, prestige: 0, totalClicks: 0 };

export default function GeometryDashClicker() {
  const [state, setState] = useState<SaveState>(INITIAL);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef(state);
  const autoTickRef = useRef(0);
  const pendingTouchRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const next = { ...INITIAL, ...JSON.parse(saved) };
        stateRef.current = next;
        setState(next);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!loaded) return;

    const flushSave = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
    };
    const saveInterval = window.setInterval(flushSave, 5000);

    window.addEventListener("pagehide", flushSave);
    const flushWhenHidden = () => {
      if (document.hidden) flushSave();
    };

    document.addEventListener("visibilitychange", flushWhenHidden);

    return () => {
      window.clearInterval(saveInterval);
      window.removeEventListener("pagehide", flushSave);
      document.removeEventListener("visibilitychange", flushWhenHidden);
      flushSave();
    };
  }, [loaded]);

  const updateState = (updater: (prev: SaveState) => SaveState) => {
    setState((prev) => {
      const next = updater(prev);
      stateRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    if (!loaded || state.autoPower <= 0) {
      autoTickRef.current = 0;
      return;
    }

    autoTickRef.current = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsedSeconds = Math.max(0, (now - autoTickRef.current) / 1000);
      autoTickRef.current = now;

      updateState((prev) => {
        if (prev.autoPower <= 0 || elapsedSeconds <= 0) return prev;
        return { ...prev, orbs: prev.orbs + prev.autoPower * elapsedSeconds };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [loaded, state.autoPower]);

  const clickCost = Math.floor(25 * Math.pow(1.65, state.clickPower - 1));
  const autoCost = Math.floor(80 * Math.pow(1.75, state.autoPower));
  const prestigeCost = 10000 * (state.prestige + 1);

  const achievements = [
    { label: "100 Clicks", detail: "Register 100 manual clicks.", unlocked: state.totalClicks >= 100 },
    { label: "Power 10", detail: "Reach Click Power level 10.", unlocked: state.clickPower >= 10 },
    { label: "Auto 5/s", detail: "Generate at least 5 automatic orbs per second.", unlocked: state.autoPower >= 5 },
    { label: "First Prestige", detail: "Complete one prestige reset.", unlocked: state.prestige >= 1 },
  ];

  const clickCube = () => {
    updateState((prev) => {
      const gain = prev.clickPower * (prev.prestige + 1);
      return {
        ...prev,
        orbs: prev.orbs + gain,
        totalClicks: prev.totalClicks + 1,
      };
    });
  };

  const handleCubePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") {
      pendingTouchRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }

    event.preventDefault();
    clickCube();
  };

  const handleCubePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const pending = pendingTouchRef.current;
    if (!pending || pending.pointerId !== event.pointerId) return;

    pendingTouchRef.current = null;
    const moved = Math.hypot(event.clientX - pending.x, event.clientY - pending.y);
    if (moved <= 12) clickCube();
  };

  const handleCubePointerCancel = () => {
    pendingTouchRef.current = null;
  };

  const buyClick = () => {
    if (state.orbs < clickCost) return;
    updateState((prev) => ({ ...prev, orbs: prev.orbs - clickCost, clickPower: prev.clickPower + 1 }));
  };

  const buyAuto = () => {
    if (state.orbs < autoCost) return;
    updateState((prev) => ({ ...prev, orbs: prev.orbs - autoCost, autoPower: prev.autoPower + 1 }));
  };

  const prestige = () => {
    if (state.orbs < prestigeCost) return;
    updateState((prev) => ({
      orbs: 0,
      clickPower: 1,
      autoPower: 0,
      prestige: prev.prestige + 1,
      totalClicks: prev.totalClicks,
    }));
  };

  const reset = () => {
    stateRef.current = INITIAL;
    setState(INITIAL);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <section className="rounded-2xl border border-white/10 bg-slate-900/35 p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-blue-400">Orbs</div>
            <div className="text-4xl font-display font-black text-white">{Math.floor(state.orbs).toLocaleString()}</div>
          </div>
          <div className="text-right text-sm text-slate-500">
            <div>Total clicks: {state.totalClicks.toLocaleString()}</div>
            <div>Prestige: {state.prestige}</div>
          </div>
        </div>

        <button
          type="button"
          onPointerDown={handleCubePointerDown}
          onPointerUp={handleCubePointerUp}
          onPointerCancel={handleCubePointerCancel}
          className="touch-pan-y mx-auto flex aspect-square w-full max-w-sm select-none items-center justify-center rounded-3xl border-2 border-blue-400/50 bg-gradient-to-br from-blue-600 to-indigo-900 shadow-[0_0_45px_rgba(37,99,235,0.25)] transition-transform active:scale-[0.97]"
          aria-label="Click the Geometry Dash cube"
        >
          <div className="grid h-32 w-32 place-items-center rounded-2xl border-8 border-white bg-blue-500 shadow-2xl md:h-40 md:w-40">
            <div className="grid h-20 w-20 grid-cols-2 gap-3 md:h-24 md:w-24">
              <span className="rounded bg-slate-950"></span>
              <span className="rounded bg-slate-950"></span>
              <span className="col-span-2 mx-auto mt-2 h-4 w-14 rounded bg-slate-950"></span>
            </div>
          </div>
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Each click earns <strong className="text-white">{state.clickPower * (state.prestige + 1)}</strong> orbs.
          Progress is saved locally in this browser.
        </p>
      </section>

      <section className="space-y-4">
        <button onClick={buyClick} disabled={state.orbs < clickCost} className="w-full rounded-xl border border-white/10 bg-slate-900/40 p-5 text-left disabled:opacity-40">
          <div className="mb-2 flex items-center gap-2 font-bold text-white"><Zap className="h-5 w-5 text-yellow-400" /> Click Power {state.clickPower}</div>
          <p className="text-sm text-slate-400">Increase the number of orbs earned from each manual click.</p>
          <div className="mt-3 font-mono text-sm text-blue-400">Cost: {clickCost.toLocaleString()} orbs</div>
        </button>

        <button onClick={buyAuto} disabled={state.orbs < autoCost} className="w-full rounded-xl border border-white/10 bg-slate-900/40 p-5 text-left disabled:opacity-40">
          <div className="mb-2 flex items-center gap-2 font-bold text-white"><Sparkles className="h-5 w-5 text-purple-400" /> Auto Orbs {state.autoPower}/s</div>
          <p className="text-sm text-slate-400">Generate orbs automatically once per second.</p>
          <div className="mt-3 font-mono text-sm text-blue-400">Cost: {autoCost.toLocaleString()} orbs</div>
        </button>

        <button onClick={prestige} disabled={state.orbs < prestigeCost} className="w-full rounded-xl border border-purple-500/20 bg-purple-950/20 p-5 text-left disabled:opacity-40">
          <div className="mb-2 font-bold text-white">Prestige multiplier ×{state.prestige + 1}</div>
          <p className="text-sm text-slate-400">Reset upgrades to permanently increase manual click value.</p>
          <div className="mt-3 font-mono text-sm text-purple-300">Requires: {prestigeCost.toLocaleString()} orbs</div>
        </button>

        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Achievements</h2>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.label}
                className={
                  "rounded-lg border p-3 " +
                  (achievement.unlocked
                    ? "border-green-500/25 bg-green-500/10"
                    : "border-white/5 bg-black/20")
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={achievement.unlocked ? "font-semibold text-green-300" : "font-semibold text-slate-400"}>
                    {achievement.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-600">
                    {achievement.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{achievement.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Wave badge unlock: {state.totalClicks >= 500 ? "Unlocked at 500 clicks" : `${500 - state.totalClicks} clicks remaining`}.
          </p>
        </div>

        <button onClick={reset} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-300">
          <RotateCcw className="h-3.5 w-3.5" /> Reset local progress
        </button>
      </section>
    </div>
  );
}
