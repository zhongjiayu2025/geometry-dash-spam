"use client";

import { memo } from "react";

const ACHIEVEMENTS = [
  { label: "100 Clicks", detail: "Register 100 manual clicks." },
  { label: "Power 10", detail: "Reach Click Power level 10." },
  { label: "Auto 5/s", detail: "Generate at least 5 automatic orbs per second." },
  { label: "First Prestige", detail: "Complete one prestige reset." },
] as const;

function ClickerAchievements({
  totalClicks,
  clickPower,
  autoPower,
  prestige,
}: {
  totalClicks: number;
  clickPower: number;
  autoPower: number;
  prestige: number;
}) {
  const unlocked = [
    totalClicks >= 100,
    clickPower >= 10,
    autoPower >= 5,
    prestige >= 1,
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Achievements</h2>
      <div className="space-y-2">
        {ACHIEVEMENTS.map((achievement, index) => (
          <div
            key={achievement.label}
            className={
              "rounded-lg border p-3 " +
              (unlocked[index]
                ? "border-green-500/25 bg-green-500/10"
                : "border-white/5 bg-black/20")
            }
          >
            <div className="flex items-center justify-between gap-3">
              <span className={unlocked[index] ? "font-semibold text-green-300" : "font-semibold text-slate-400"}>
                {achievement.label}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-600">
                {unlocked[index] ? "Unlocked" : "Locked"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{achievement.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-600">
        Wave badge unlock: {totalClicks >= 500 ? "Unlocked at 500 clicks" : `${500 - totalClicks} clicks remaining`}.
      </p>
    </div>
  );
}

export default memo(ClickerAchievements);
