"use client";

import { Mouse } from "lucide-react";
import SecondaryClickTest, { type SecondaryClickConfig } from "./SecondaryClickTest";

const CONFIG: SecondaryClickConfig = {
  bestKey: "rightClickBest",
  soundKey: "rightClickSoundEnabled",
  tone: "rightClick",
  activeLabel: "RMB Clicks",
  speedLabel: "Right Click Speed",
  shareTitle: "Right Click Test",
  shareUrl: "https://geometrydashspam.cc/right-click",
  shareName: "Geometry Dash Right Click Test",
  accentText: "text-emerald-400",
  timerText: "text-emerald-400",
  soundOn: "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/30",
  clickArea: "bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] cursor-context-menu",
  activeCount: "",
  withTopMargin: false,
};

export default function RightClickTest() {
  return (
    <SecondaryClickTest
      variant="rightClick"
      config={CONFIG}
      idleVisual={
        <>
          <div className="relative mb-4">
            <Mouse className="w-16 h-16 text-white" />
            <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-3xl font-display font-bold text-white tracking-widest">RIGHT CLICK HERE</span>
          <span className="text-emerald-200 mt-2 font-mono text-sm">10 SECOND TEST</span>
        </>
      }
    />
  );
}
