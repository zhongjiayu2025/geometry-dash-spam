
import { Difficulty, DifficultyConfig } from './types';

export const WIN_TIME_MS = 15000; // 15 seconds to win
export const FPS = 60;
export const GRAVITY = 0.35; // Reduced from 0.45: Very floaty, extremely forgiving
export const WAVE_SPEED_Y = 3.8; // Reduced from 4.2: Slower ascent for better precision

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: {
    id: Difficulty.Easy,
    label: 'Easy',
    speed: 3.5, // Extremely slow
    gap: 260, // Massive gap, almost impossible to hit walls
    color: '#22c55e', // Green
    secondaryColor: '#14532d',
    description: 'Tutorial Mode. Very flat and wide.',
  },
  [Difficulty.Hard]: {
    id: Difficulty.Hard,
    label: 'Hard',
    speed: 5, 
    gap: 220, // Huge breathing room
    color: '#eab308', // Yellow
    secondaryColor: '#713f12',
    description: 'Relaxed pace. Great for casual play.',
  },
  [Difficulty.Insane]: {
    id: Difficulty.Insane,
    label: 'Insane',
    speed: 6.5, 
    gap: 180, // Still very wide compared to original
    color: '#f97316', // Orange
    secondaryColor: '#7c2d12',
    description: 'Standard challenge level.',
  },
  [Difficulty.EasyDemon]: {
    id: Difficulty.EasyDemon,
    label: 'Easy Demon',
    speed: 8, 
    gap: 140, // Formerly 'Insane' difficulty
    color: '#ef4444', // Red
    secondaryColor: '#7f1d1d',
    description: 'Fast paced, requires focus.',
  },
  [Difficulty.ExtremeDemon]: {
    id: Difficulty.ExtremeDemon,
    label: 'Extreme Demon',
    speed: 9.5, 
    gap: 110, // Significantly wider than before (was 70)
    color: '#a855f7', // Purple/Pink
    secondaryColor: '#581c87',
    description: 'The ultimate test, but fair.',
  },
};
