import { Difficulty, DifficultyConfig } from './types';

export const WIN_TIME_MS = 15000; // 15 seconds to win
export const FPS = 60;
export const GRAVITY = 0.6; // For wave movement physics (constant speed up/down)
export const WAVE_SPEED_Y = 5; // Vertical speed of the wave in pixels per frame

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: {
    id: Difficulty.Easy,
    label: 'Easy',
    speed: 3,
    gap: 150,
    color: '#22c55e', // Green
    secondaryColor: '#14532d',
    description: 'Wide gap with gentle speed. Great for learning.',
  },
  [Difficulty.Hard]: {
    id: Difficulty.Hard,
    label: 'Hard',
    speed: 5,
    gap: 100,
    color: '#eab308', // Yellow
    secondaryColor: '#713f12',
    description: 'Faster speed and tighter gaps. Stay focused.',
  },
  [Difficulty.Insane]: {
    id: Difficulty.Insane,
    label: 'Insane',
    speed: 7,
    gap: 75,
    color: '#f97316', // Orange
    secondaryColor: '#7c2d12',
    description: 'Fast paced. Quick reaction time required.',
  },
  [Difficulty.EasyDemon]: {
    id: Difficulty.EasyDemon,
    label: 'Easy Demon',
    speed: 9,
    gap: 55,
    color: '#ef4444', // Red
    secondaryColor: '#7f1d1d',
    description: 'High speed. Consistent spamming needed.',
  },
  [Difficulty.ExtremeDemon]: {
    id: Difficulty.ExtremeDemon,
    label: 'Extreme Demon',
    speed: 12,
    gap: 36,
    color: '#a855f7', // Purple/Pink
    secondaryColor: '#581c87',
    description: 'EXTREME SPEED. Pixel-perfect spam consistency.',
  },
};