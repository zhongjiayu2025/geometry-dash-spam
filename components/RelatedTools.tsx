import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Fingerprint,
  Gauge,
  Keyboard,
  ListOrdered,
  Monitor,
  MousePointer2,
  Target,
  Timer,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";

interface RelatedToolsProps {
  currentTool: string;
}

const TOOLS = {
  game: {
    id: "game",
    label: "Spam Test",
    path: "/",
    desc: "Wave-spam control practice",
    icon: Target,
  },
  wave: {
    id: "wave",
    label: "Wave Trainer",
    path: "/geometry-dash-wave",
    desc: "Normal, mini and precision wave presets",
    icon: Activity,
  },
  cps: {
    id: "cps",
    label: "CPS Test",
    path: "/cps-test",
    desc: "Speed and timing metrics",
    icon: MousePointer2,
  },
  demonList: {
    id: "demonList",
    label: "Demon List",
    path: "/demon-list",
    desc: "Sourced top-50 ranking snapshot",
    icon: ListOrdered,
  },
  hardest: {
    id: "hardest",
    label: "Hardest Level",
    path: "/hardest-level",
    desc: "Current #1 with source and date",
    icon: Trophy,
  },
  clicker: {
    id: "clicker",
    label: "Geometry Dash Clicker",
    path: "/geometry-dash-clicker",
    desc: "Local-save orb clicker",
    icon: MousePointer2,
  },
  jitter: {
    id: "jitter",
    label: "Jitter Click",
    path: "/jitter-click",
    desc: "Compare vibration-style clicking",
    icon: Activity,
  },
  butterfly: {
    id: "butterfly",
    label: "Butterfly Click",
    path: "/butterfly-click",
    desc: "Compare two-finger clicking rhythm",
    icon: Fingerprint,
  },
  dragClick: {
    id: "dragClick",
    label: "Drag Click",
    path: "/drag-click",
    desc: "Average and rolling 1-second click metrics",
    icon: MousePointer2,
  },
  rightClick: {
    id: "rightClick",
    label: "Right Click CPS",
    path: "/right-click",
    desc: "Ten-second RMB click-speed test",
    icon: MousePointer2,
  },
  doubleClick: {
    id: "doubleClick",
    label: "Double Click Test",
    path: "/double-click",
    desc: "Configurable rapid click-interval check",
    icon: MousePointer2,
  },
  spacebar: {
    id: "spacebar",
    label: "Spacebar Counter",
    path: "/spacebar-counter",
    desc: "Keyboard input speed",
    icon: Keyboard,
  },
  pollingRate: {
    id: "pollingRate",
    label: "Mouse Polling Rate",
    path: "/polling-rate",
    desc: "Browser-observed pointer event rate",
    icon: Gauge,
  },
  keyboardLatency: {
    id: "keyboardLatency",
    label: "Key Timing Test",
    path: "/keyboard-latency",
    desc: "Browser keydown-to-keyup timing",
    icon: Keyboard,
  },
  keyboardGhosting: {
    id: "keyboardGhosting",
    label: "Keyboard Rollover",
    path: "/keyboard-ghosting",
    desc: "Visualize simultaneous registered keys",
    icon: Keyboard,
  },
  reaction: {
    id: "reaction",
    label: "Reaction Test",
    path: "/reaction-test",
    desc: "Visual cue-to-input timing",
    icon: Timer,
  },
  soundReaction: {
    id: "soundReaction",
    label: "Sound Reaction",
    path: "/sound-reaction",
    desc: "Audio cue-to-input timing",
    icon: Volume2,
  },
  aim: {
    id: "aim",
    label: "Aim Trainer",
    path: "/aim-trainer",
    desc: "Mouse precision practice",
    icon: Target,
  },
  visualMemory: {
    id: "visualMemory",
    label: "Visual Memory",
    path: "/visual-memory",
    desc: "Pattern memory practice",
    icon: BrainCircuit,
  },
  chimp: {
    id: "chimp",
    label: "Chimp Test",
    path: "/chimp-test",
    desc: "Number sequence memory practice",
    icon: BrainCircuit,
  },
  refreshRate: {
    id: "refreshRate",
    label: "Refresh Rate",
    path: "/refresh-rate",
    desc: "Browser-observed display cadence",
    icon: Monitor,
  },
  scroll: {
    id: "scroll",
    label: "Scroll Speed",
    path: "/scroll-test",
    desc: "Wheel-event and normalized distance test",
    icon: Activity,
  },
  typing: {
    id: "typing",
    label: "Typing Test",
    path: "/typing-test",
    desc: "60-second WPM practice",
    icon: Keyboard,
  },
  systemInfo: {
    id: "systemInfo",
    label: "System Info",
    path: "/system-info",
    desc: "Browser-exposed device information",
    icon: Monitor,
  },
} as const;

type ToolKey = keyof typeof TOOLS;

const RECOMMENDATIONS: Record<string, ToolKey[]> = {
  game: ["wave", "cps", "demonList"],
  wave: ["game", "cps", "demonList"],
  cps: ["game", "wave", "demonList"],
  jitter: ["cps", "butterfly", "game"],
  butterfly: ["cps", "jitter", "game"],
  dragClick: ["cps", "doubleClick", "game"],
  rightClick: ["cps", "doubleClick", "pollingRate"],
  doubleClick: ["cps", "rightClick", "pollingRate"],
  spacebar: ["cps", "keyboardLatency", "game"],
  pollingRate: ["cps", "keyboardLatency", "game"],
  keyboardLatency: ["spacebar", "keyboardGhosting", "game"],
  keyboardGhosting: ["keyboardLatency", "spacebar", "cps"],
  mouseAcceleration: ["game", "cps", "wave"],
  reaction: ["aim", "cps", "wave"],
  soundReaction: ["game", "cps", "wave"],
  aim: ["reaction", "cps", "wave"],
  visualMemory: ["game", "cps", "wave"],
  chimpTest: ["game", "cps", "wave"],
  chimp: ["game", "cps", "wave"],
  clicker: ["cps", "game", "wave"],
  demonList: ["hardest", "wave", "game"],
  refreshRate: ["pollingRate", "cps", "game"],
  scroll: ["game", "cps", "wave"],
  typing: ["spacebar", "keyboardGhosting", "cps"],
  systemInfo: ["pollingRate", "keyboardLatency", "cps"],
  dashboard: ["cps", "game", "wave"],
  rollover: ["keyboardGhosting", "keyboardLatency", "spacebar"],
  bpm: ["game", "spacebar", "cps"],
};

export default function RelatedTools({ currentTool }: RelatedToolsProps) {
  const recommendedKeys = RECOMMENDATIONS[currentTool] ?? ["game", "wave", "cps"];
  const recommended = recommendedKeys
    .map((key) => TOOLS[key])
    .filter((tool) => tool.id !== currentTool)
    .slice(0, 3);

  return (
    <nav className="border-t border-white/10 pt-12 mt-12 w-full max-w-4xl mx-auto" aria-label="Related tools">
      <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-blue-500" /> Related practice tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommended.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.path}
              className="group block rounded-xl border border-white/10 bg-slate-900/35 p-5 transition-colors hover:border-blue-500/50 hover:bg-slate-900/60"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-1 group-hover:text-blue-300">{tool.label}</h3>
              <p className="text-xs leading-5 text-slate-400">{tool.desc}</p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
