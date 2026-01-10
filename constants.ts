
import { Difficulty, DifficultyConfig } from './types';

export const WIN_TIME_MS = 15000; // 15 seconds to win
export const FPS = 60;
export const GRAVITY = 0.5; // Reduced from 0.6: Makes the wave floatier and easier to control
export const WAVE_SPEED_Y = 4.5; // Reduced from 5: Slightly slower vertical movement for precision

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: {
    id: Difficulty.Easy,
    label: 'Easy',
    speed: 4, // Slightly faster horizontally to feel smoother
    gap: 190, // Massive gap increase (was 150) - Very forgiving
    color: '#22c55e', // Green
    secondaryColor: '#14532d',
    description: 'Wide open spaces. Perfect for learning the physics.',
  },
  [Difficulty.Hard]: {
    id: Difficulty.Hard,
    label: 'Hard',
    speed: 6,
    gap: 150, // Increased from 100 - Good balance
    color: '#eab308', // Yellow
    secondaryColor: '#713f12',
    description: 'Standard Geometry Dash speed. Requires rhythm.',
  },
  [Difficulty.Insane]: {
    id: Difficulty.Insane,
    label: 'Insane',
    speed: 8,
    gap: 110, // Increased from 75
    color: '#f97316', // Orange
    secondaryColor: '#7c2d12',
    description: 'Fast paced corridors. Don\'t panic click.',
  },
  [Difficulty.EasyDemon]: {
    id: Difficulty.EasyDemon,
    label: 'Easy Demon',
    speed: 10,
    gap: 80, // Increased from 55
    color: '#ef4444', // Red
    secondaryColor: '#7f1d1d',
    description: 'High speed. Consistent spamming needed.',
  },
  [Difficulty.ExtremeDemon]: {
    id: Difficulty.ExtremeDemon,
    label: 'Extreme Demon',
    speed: 12,
    gap: 50, // Increased from 36 (Pixel perfect) to 50 (Very Hard but Fair)
    color: '#a855f7', // Purple/Pink
    secondaryColor: '#581c87',
    description: 'EXTREME SPEED. For the top 1% of players.',
  },
};
