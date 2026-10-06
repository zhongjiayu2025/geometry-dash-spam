"use client";

import { MousePointer2 } from "lucide-react";
import SecondaryClickTest, { type SecondaryClickConfig } from "./SecondaryClickTest";

const CONFIG: SecondaryClickConfig = {
  bestKey: "butterflyClickBest",
  soundKey: "butterflyClickSoundEnabled",
  tone: "butterfly",
  activeLabel: "Clicks",
  speedLabel: "Your Butterfly Speed",
  shareTitle: "Butterfly Click Test",
  shareUrl: "https://geometrydashspam.cc/butterfly-click",
  shareName: "Geometry Dash Butterfly Click Test",
  accentText: "text-pink-400",
  timerText: "text-pink-400",
  soundOn: "bg-pink-600/20 border-pink-500/50 text-pink-400 hover:bg-pink-600/30",
  clickArea: "bg-gradient-to-br from-pink-600 to-purple-800 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:shadow-[0_0_60px_rgba(236,72,153,0.5)] cursor-pointer",
  activeCount: "",
  withTopMargin: true,
};

export default function ButterflyClickTest() {
  return (
    <SecondaryClickTest
      variant="butterfly"
      config={CONFIG}
      idleVisual={
        <>
          <div className="flex gap-2 mb-4">
            <MousePointer2 className="w-12 h-12 text-white animate-bounce" />
            <MousePointer2 className="w-12 h-12 text-pink-200 animate-bounce [animation-delay:100ms]" />
          </div>
          <span className="text-3xl font-display font-bold text-white tracking-widest">BUTTERFLY CLICK</span>
          <span className="text-pink-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
        </>
      }
    />
  );
}
