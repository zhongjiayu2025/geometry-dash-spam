"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Trophy } from "lucide-react";

export default function Leaderboard() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-yellow-500/10 mb-5">
          <Trophy className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-4">Leaderboard Status</h1>
        <p className="text-slate-400 leading-7">
          This site does not currently collect verified global player scores. The previous sample leaderboard has been removed so demo names and scores are not presented as real users.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-7 h-7 text-green-400 shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-white mb-2">What still works</h2>
            <p className="text-slate-400 leading-7 mb-5">
              Personal-best data for supported tools is stored locally in your own browser. No account or public ranking is required.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">My Local Stats</Link>
              <Link href="/cps-test" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white">CPS Test</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
