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
  MousePointer2,
  Target,
  Timer,
  Trophy,
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
    desc: "Compare a vibration clicking technique",
    icon: Activity,
  },
  butterfly: {
    id: "butterfly",
    label: "Butterfly Click",
    path: "/butterfly-click",
    desc: "Compare two-finger clicking rhythm",
    icon: Fingerprint,
  },
  spacebar: {
    id: "spacebar",
    label: "Spacebar Counter",
    path: "/spacebar-counter",
    desc: "Keyboard input counting",
    icon: Keyboard,
  },
  pollingRate: {
    id: "pollingRate",
    label: "Mouse Polling Rate",
    path: "/polling-rate",
    desc: "Browser-observed report frequency",
    icon: Gauge,
  },
  reaction: {
    id: "reaction",
    label: "Reaction Test",
    path: "/reaction-test",
    desc: "Visual response-time practice",
    icon: Timer,
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
} as const;

type ToolKey = keyof typeof TOOLS;

const RECOMMENDATIONS: Record<string, ToolKey[]> = {
  game: ["wave", "cps", "demonList"],
  wave: ["game", "cps", "demonList"],
  cps: ["game", "jitter", "butterfly"],
  jitter: ["cps", "butterfly", "game"],
  butterfly: ["cps", "jitter", "game"],
  dragClick: ["cps", "jitter", "butterfly"],
  rightClick: ["cps", "pollingRate", "game"],
  spacebar: ["cps", "game", "wave"],
  pollingRate: ["cps", "reaction", "game"],
  keyboardLatency: ["spacebar", "reaction", "cps"],
  mouseAcceleration: ["aim", "pollingRate", "reaction"],
  reaction: ["cps", "aim", "game"],
  aim: ["reaction", "pollingRate", "cps"],
  visualMemory: ["reaction", "aim", "game"],
  chimpTest: ["visualMemory", "reaction", "game"],
  clicker: ["cps", "game", "wave"],
  demonList: ["hardest", "wave", "game"],
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
