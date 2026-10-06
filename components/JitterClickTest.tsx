"use client";

import { Zap } from "lucide-react";
import SecondaryClickTest, { type SecondaryClickConfig } from "./SecondaryClickTest";

const CONFIG: SecondaryClickConfig = {
  bestKey: "jitterClickBest",
  soundKey: "jitterClickSoundEnabled",
  tone: "jitter",
  activeLabel: "Clicks",
  speedLabel: "Your Jitter Speed",
  shareTitle: "Jitter Click Test",
  shareUrl: "https://geometrydashspam.cc/jitter-click",
  shareName: "Geometry Dash Jitter Click Test",
  accentText: "text-orange-400",
  timerText: "text-orange-400",
  soundOn: "bg-orange-600/20 border-orange-500/50 text-orange-400 hover:bg-orange-600/30",
  clickArea: "bg-gradient-to-br from-orange-600 to-red-800 border-orange-500 shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:shadow-[0_0_60px_rgba(234,88,12,0.5)] cursor-pointer",
  activeCount: "shake-constant shake-little",
  withTopMargin: false,
};

export default function JitterClickTest() {
  return (
    <SecondaryClickTest
      variant="jitter"
      config={CONFIG}
      idleVisual={
        <>
          <Zap className="w-16 h-16 text-white mb-4 animate-pulse" />
          <span className="text-3xl font-display font-bold text-white tracking-widest">START JITTERING</span>
          <span className="text-orange-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
        </>
      }
    />
  );
}
