import { WAVE_SPEED_Y, WIN_TIME_MS } from "../constants";

export type PatternType = "random" | "corridor" | "stairs_up" | "stairs_down" | "zigzag" | "sawtooth";

export interface WaveRuntimeState {
  playerY: number;
  playerX: number;
  velocityY: number;
  isHolding: boolean;
  obstacles: Array<{ x: number; width: number; topHeight: number; bottomY: number }>;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
  }>;
  shockwaves: Array<{ x: number; y: number; radius: number; opacity: number }>;
  stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }>;
  trail: Array<{ x: number; y: number; w: number }>;
  startTime: number;
  lastFrameTime: number;
  distanceTraveled: number;
  lastObstacleX: number;
  currentPattern: PatternType;
  patternStep: number;
  lastCenterY: number;
  shakeIntensity: number;
  beatScale: number;
  trailAccumulator: number;
  clickIntervals: number[];
  clickTimes: number[];
  clickCount: number;
  runTime: number;
  finishLineX: number;
  baseColor: string;
  lastClickTime: number;
  rng: () => number;
}

function mulberry32(seed: number) {
  return function random() {
    let value = seed += 0x6D2B79F5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function stringToSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash + 2147483648;
}

export function prepareWaveSeedAndStars(
  state: WaveRuntimeState,
  options: {
    width: number;
    height: number;
    deterministic: boolean;
    seedKey: string;
    lowVisuals: boolean;
  }
) {
  const { width, height, deterministic, seedKey, lowVisuals } = options;
  state.rng = deterministic ? mulberry32(stringToSeed(seedKey)) : Math.random;
  state.stars = [];

  // Decorative star counts must not consume the obstacle sequence.
  const random = deterministic ? mulberry32(stringToSeed(`${seedKey}-stars`)) : Math.random;
  const starCount = lowVisuals ? 20 : 40;
  for (let index = 0; index < starCount; index += 1) {
    state.stars.push({
      x: random() * width,
      y: random() * height,
      size: random() * 2 + 0.5,
      speed: random() * 2 + 0.2,
      opacity: random() * 0.5 + 0.1,
    });
  }
}

interface AdvanceWaveOptions {
  now: number;
  canvasWidth: number;
  canvasHeight: number;
  difficultySpeed: number;
  difficultyGap: number;
  isMini: boolean;
  isEndless: boolean;
  lowVisuals: boolean;
}

function spawnWaveObstacle(
  state: WaveRuntimeState,
  canvasHeight: number,
  difficultyGap: number,
  isMini: boolean
) {
  const minGap = isMini ? difficultyGap * 0.8 : difficultyGap;
  const obstacleWidth = 60;
  const random = state.rng;

  if (state.patternStep <= 0) {
    const patterns: PatternType[] = ["random", "corridor", "stairs_up", "stairs_down", "zigzag", "sawtooth"];
    state.currentPattern = random() > 0.3
      ? patterns[Math.floor(random() * patterns.length)]
      : "random";
    state.patternStep = Math.floor(random() * 5) + 5;
  }

  const safeDelta = Math.min(60, Math.max(10, minGap - 30));
  let center = state.lastCenterY;
  let delta = 0;

  switch (state.currentPattern) {
    case "corridor": delta = random() * 10 - 5; break;
    case "stairs_up": delta = -safeDelta * 0.6; break;
    case "stairs_down": delta = safeDelta * 0.6; break;
    case "zigzag": delta = safeDelta * (state.patternStep % 2 === 0 ? 1 : -1); break;
    case "sawtooth": delta = random() * 20 - 10; break;
    default: delta = (random() - 0.5) * safeDelta * 1.5;
  }

  center += delta;
  const margin = minGap / 2 + 20;
  center = Math.max(margin, Math.min(canvasHeight - margin, center));

  const actualDiff = center - state.lastCenterY;
  if (Math.abs(actualDiff) > safeDelta) {
    center = state.lastCenterY + Math.sign(actualDiff) * safeDelta;
  }

  state.lastCenterY = center;
  state.patternStep -= 1;

  let topHeight = center - minGap / 2;
  let bottomY = center + minGap / 2;
  if (state.currentPattern === "sawtooth" && state.patternStep % 2 === 0) {
    const shrink = Math.min(10, minGap * 0.2);
    topHeight += shrink;
    bottomY -= shrink;
  }

  state.obstacles.push({
    x: state.lastObstacleX + obstacleWidth,
    width: obstacleWidth,
    topHeight,
    bottomY,
  });
  state.lastObstacleX += obstacleWidth;
}

export function advanceWaveFrame(state: WaveRuntimeState, options: AdvanceWaveOptions) {
  const {
    now,
    canvasWidth,
    canvasHeight,
    difficultySpeed,
    difficultyGap,
    isMini,
    isEndless,
    lowVisuals,
  } = options;

  state.beatScale = 1 + (state.beatScale - 1) * 0.9;

  if (state.startTime === 0) {
    state.startTime = now;
    state.lastFrameTime = now;
  }

  const rawDeltaMs = now - state.lastFrameTime;
  const frameDeltaMs = Math.min(
    1000 / 30,
    Math.max(0, rawDeltaMs),
    isEndless ? Infinity : Math.max(0, WIN_TIME_MS - state.runTime)
  );
  const frameFactor = frameDeltaMs / (1000 / 60);
  state.lastFrameTime = now;
  state.runTime += frameDeltaMs;

  const speedY = isMini ? WAVE_SPEED_Y * 1.5 : WAVE_SPEED_Y;
  state.velocityY = state.isHolding ? -speedY : speedY;
  state.playerY += state.velocityY * frameFactor;

  const moveSpeed = difficultySpeed * frameFactor;
  state.distanceTraveled += moveSpeed;

  for (const star of state.stars) {
    star.x -= star.speed * (moveSpeed / 3);
    if (star.x < 0) star.x = canvasWidth;
  }

  const spawnThreshold = isEndless ? Infinity : state.finishLineX - 400;
  const lastObstacle = state.obstacles.at(-1);
  if (
    !lastObstacle ||
    (lastObstacle.x < state.distanceTraveled + canvasWidth + 100 &&
      state.lastObstacleX < spawnThreshold)
  ) {
    spawnWaveObstacle(state, canvasHeight, difficultyGap, isMini);
  }

  const playerRadius = isMini ? 4 : 8;
  const hitboxSize = playerRadius * 0.5;
  const playerLeft = state.playerX - hitboxSize;
  const playerRight = state.playerX + hitboxSize;
  const playerTop = state.playerY - hitboxSize;
  const playerBottom = state.playerY + hitboxSize;

  let died = state.playerY < 0 || state.playerY > canvasHeight;
  if (!died) {
    for (const obstacle of state.obstacles) {
      const x = obstacle.x - state.distanceTraveled;
      if (x >= canvasWidth || x + obstacle.width <= 0) continue;
      if (playerLeft < x + obstacle.width && playerRight > x) {
        if (playerTop < obstacle.topHeight || playerBottom > obstacle.bottomY) {
          died = true;
          break;
        }
      }
    }
  }

  const won =
    !isEndless &&
    state.runTime >= WIN_TIME_MS;

  state.trailAccumulator += frameFactor;
  const trailStep = lowVisuals ? 3 : 2;
  const maxTrailPoints = lowVisuals ? 18 : 30;
  if (state.trailAccumulator >= trailStep) {
    state.trail.push({
      x: state.playerX,
      y: state.playerY,
      w: isMini ? 4 : 8,
    });
    if (state.trail.length > maxTrailPoints) state.trail.shift();
    state.trailAccumulator %= trailStep;
  }

  for (const point of state.trail) {
    point.x -= moveSpeed;
    point.w *= Math.pow(0.94, frameFactor);
  }

  state.particles = state.particles.filter((particle) => particle.life > 0);
  for (const particle of state.particles) {
    particle.x += particle.vx * frameFactor;
    particle.y += particle.vy * frameFactor;
    particle.vy += 0.5 * frameFactor;
    particle.rotation += particle.rotationSpeed * frameFactor;
    particle.life -= 0.02 * frameFactor;
    particle.size *= Math.pow(0.98, frameFactor);
  }

  state.shockwaves = state.shockwaves.filter((shockwave) => shockwave.opacity > 0);
  for (const shockwave of state.shockwaves) {
    shockwave.radius += 8 * frameFactor;
    shockwave.opacity -= 0.05 * frameFactor;
  }

  return { now, died, won };
}

export function createWaveExplosion(
  state: WaveRuntimeState,
  x: number,
  y: number,
  color: string,
  lowVisuals: boolean,
  reduceMotion: boolean
) {
  if (reduceMotion) return;

  const random = state.rng;
  const particleCount = lowVisuals ? 10 : 20;
  for (let index = 0; index < particleCount; index += 1) {
    const angle = random() * Math.PI * 2;
    const speed = random() * 10 + 5;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color,
      size: random() * 8 + 4,
      rotation: random() * Math.PI * 2,
      rotationSpeed: (random() - 0.5) * 0.5,
    });
  }
  state.shockwaves.push({ x, y, radius: 10, opacity: 1 });
}

export function calculateWaveConsistency(state: WaveRuntimeState) {
  const intervals = state.clickIntervals;
  if (intervals.length < 2) return "N/A";
  const mean = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    intervals.length;
  const coefficient = mean > 0 ? Math.sqrt(variance) / mean : 0;
  return `${Math.max(0, Math.min(100, 100 - coefficient * 100)).toFixed(1)}%`;
}

export function getWaveRunStats(state: WaveRuntimeState) {
  const seconds = Math.max(0.001, state.runTime / 1000);
  const intervals = state.clickIntervals;
  const clickCount = state.clickCount;
  const averageCps = clickCount / seconds;
  const clickTimes = state.clickTimes;

  let peakCps = 0;
  let left = 0;
  for (let right = 0; right < clickTimes.length; right += 1) {
    while (clickTimes[right] - clickTimes[left] > 1000) left += 1;
    peakCps = Math.max(peakCps, right - left + 1);
  }
  if (clickTimes.length < 2) peakCps = averageCps;

  const averageInterval = intervals.length
    ? intervals.reduce((sum, value) => sum + value, 0) / intervals.length
    : 0;
  const variance = intervals.length
    ? intervals.reduce((sum, value) => sum + Math.pow(value - averageInterval, 2), 0) /
      intervals.length
    : 0;

  return {
    clickCount,
    averageCps,
    peakCps,
    averageInterval,
    intervalStdDev: Math.sqrt(variance),
  };
}
