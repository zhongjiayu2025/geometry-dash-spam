export enum Difficulty {
  Easy = 'Easy',
  Hard = 'Hard',
  Insane = 'Insane',
  EasyDemon = 'Easy Demon',
  ExtremeDemon = 'Extreme Demon'
}

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  speed: number;
  gap: number; // in pixels
  color: string; // Hex code for the neon line
  secondaryColor: string; // For background/particles
  description: string;
}

export enum GameStatus {
  Idle = 'Idle',
  Playing = 'Playing',
  Won = 'Won',
  Lost = 'Lost'
}

export interface GameState {
  status: GameStatus;
  elapsedTime: number;
  bestTime: number;
}