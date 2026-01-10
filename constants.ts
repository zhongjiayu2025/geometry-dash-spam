
import { Difficulty, DifficultyConfig } from './types';

export const WIN_TIME_MS = 15000; // 15 seconds to win
export const FPS = 60;
export const GRAVITY = 0.45; // Reduced from 0.5: Even floatier, gives much more reaction time
export const WAVE_SPEED_Y = 4.2; // Reduced from 4.5: Smoother control, less jerky movements

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: {
    id: Difficulty.Easy,
    label: 'Easy',
    speed: 4, 
    gap: 210, // Increased from 190. Massive space, very hard to die.
    color: '#22c55e', // Green
    secondaryColor: '#14532d',
    description: 'Tutorial Mode. Very slow and very wide.',
  },
  [Difficulty.Hard]: {
    id: Difficulty.Hard,
    label: 'Hard',
    speed: 5.5, // Reduced from 6
    gap: 170, // Increased from 150. A relaxing challenge.
    color: '#eab308', // Yellow
    secondaryColor: '#713f12',
    description: 'Casual pace. Good for warming up.',
  },
  [Difficulty.Insane]: {
    id: Difficulty.Insane,
    label: 'Insane',
    speed: 7, // Reduced from 8
    gap: 130, // Increased from 110. Consistent and fair.
    color: '#f97316', // Orange
    secondaryColor: '#7c2d12',
    description: 'Faster, but with plenty of room to maneuver.',
  },
  [Difficulty.EasyDemon]: {
    id: Difficulty.EasyDemon,
    label: 'Easy Demon',
    speed: 9, // Reduced from 10
    gap: 100, // Increased from 80. The sweet spot for fun.
    color: '#ef4444', // Red
    secondaryColor: '#7f1d1d',
    description: 'High speed action. Requires focus, not luck.',
  },
  [Difficulty.ExtremeDemon]: {
    id: Difficulty.ExtremeDemon,
    label: 'Extreme Demon',
    speed: 11, // Reduced from 12
    gap: 70, // Increased from 50. Challenging but definitely humanly possible.
    color: '#a855f7', // Purple/Pink
    secondaryColor: '#581c87',
    description: 'Top speed test. For players seeking a rush.',
  },
};
