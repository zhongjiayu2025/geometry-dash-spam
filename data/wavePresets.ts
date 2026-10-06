import { Difficulty } from "../types";

export type WavePreset = "normal" | "mini" | "spam" | "precision" | "endless";
export type WavePresetState = WavePreset | "custom";

export const WAVE_PRESETS: Array<{
  id: WavePreset;
  label: string;
  description: string;
  difficulty: Difficulty;
  mini: boolean;
  endless: boolean;
}> = [
  {
    id: "normal",
    label: "Normal Wave",
    description: "Balanced wave control practice.",
    difficulty: Difficulty.Hard,
    mini: false,
    endless: false,
  },
  {
    id: "mini",
    label: "Mini Wave",
    description: "Faster vertical movement with tighter corrections.",
    difficulty: Difficulty.Insane,
    mini: true,
    endless: false,
  },
  {
    id: "spam",
    label: "Wave Spam",
    description: "Rapid repeated inputs with a demanding pace.",
    difficulty: Difficulty.EasyDemon,
    mini: true,
    endless: false,
  },
  {
    id: "precision",
    label: "Precision",
    description: "Narrower high-difficulty control practice.",
    difficulty: Difficulty.ExtremeDemon,
    mini: false,
    endless: false,
  },
  {
    id: "endless",
    label: "Endless",
    description: "Survive as long as possible and chase a local best.",
    difficulty: Difficulty.Hard,
    mini: false,
    endless: true,
  },
];
