import { Difficulty, DifficultyConfig } from "./types";

export const WIN_TIME_MS = 15000;
export const FPS = 60;

// Practice-oriented movement model. These values are tuned for the browser trainer
// and are not presented as an exact copy of the official Geometry Dash engine.
export const GRAVITY = 0.35;
export const WAVE_SPEED_Y = 3.8;

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: {
    id: Difficulty.Easy,
    label: "Easy",
    speed: 3.5,
    gap: 260,
    color: "#22c55e",
    secondaryColor: "#14532d",
    description: "Wide corridor for learning the input pattern.",
  },
  [Difficulty.Hard]: {
    id: Difficulty.Hard,
    label: "Hard",
    speed: 5,
    gap: 220,
    color: "#eab308",
    secondaryColor: "#713f12",
    description: "Moderate speed with generous correction space.",
  },
  [Difficulty.Insane]: {
    id: Difficulty.Insane,
    label: "Insane",
    speed: 6.5,
    gap: 180,
    color: "#f97316",
    secondaryColor: "#7c2d12",
    description: "Faster movement with a smaller correction window.",
  },
  [Difficulty.EasyDemon]: {
    id: Difficulty.EasyDemon,
    label: "Easy Demon",
    speed: 8,
    gap: 140,
    color: "#ef4444",
    secondaryColor: "#7f1d1d",
    description: "High-speed practice with a tighter corridor.",
  },
  [Difficulty.ExtremeDemon]: {
    id: Difficulty.ExtremeDemon,
    label: "Extreme Demon",
    speed: 9.5,
    gap: 110,
    color: "#a855f7",
    secondaryColor: "#581c87",
    description: "Fastest preset with the narrowest practice corridor.",
  },
};
