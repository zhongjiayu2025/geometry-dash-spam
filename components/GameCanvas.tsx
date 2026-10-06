
"use client";

import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import dynamic from 'next/dynamic';
import { DifficultyConfig, GameStatus } from '../types';
import { WIN_TIME_MS, WAVE_SPEED_Y } from '../constants';
import { Crown, Volume2, VolumeX, Maximize, Minimize, Activity, ZapOff } from 'lucide-react';
import type { WaveAudioEngine, WaveSound } from '../lib/waveAudio';

const WaveRunOverlays = dynamic(() => import('./WaveRunOverlays'), { ssr: false });

interface GameCanvasProps {
  difficulty: DifficultyConfig;
  status: GameStatus;
  onStatusChange: (status: GameStatus) => void;
  isEndless?: boolean;
  isMini?: boolean;
}

interface Obstacle {
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
}

// Improved Particle for Shatter Effect
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

interface WaveRun {
  time: number;
  averageCps: number;
  peakCps: number;
  timingSd: number;
  clicks: number;
  result: "won" | "lost";
  timestamp: number;
  mode: string;
}

// Level Generation Patterns
type PatternType = 'random' | 'corridor' | 'stairs_up' | 'stairs_down' | 'zigzag' | 'sawtooth';

// --- SEEDED RNG UTILS ---
const mulberry32 = (a: number) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const stringToSeed = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash + 2147483647 + 1; // Ensure positive
}

const GameCanvas: React.FC<GameCanvasProps> = memo(({ difficulty, status, onStatusChange, isEndless = false, isMini = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings State
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [canFullscreen, setCanFullscreen] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  const [highScore, setHighScore] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<number>(0);
  const [recentRuns, setRecentRuns] = useState<WaveRun[]>([]);
  const lastHudUpdateRef = useRef<number>(0);
  const runRecordedRef = useRef(false);
  
  // Share Modal State
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareText, setShareText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  
  useEffect(() => {
    lowVisualsRef.current =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 640px)').matches;

    const savedMuted = localStorage.getItem('gd_spam_muted');
    const muted = savedMuted === null ? true : savedMuted === 'true';
    mutedRef.current = muted;
    setIsMuted(muted);
    const savedMotion = localStorage.getItem('gd_spam_reduce_motion');
    setReduceMotion(
      savedMotion === 'true' ||
      (savedMotion === null && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    );
    loadHighScore();
    loadRunHistory();
  }, [difficulty.id, isEndless, isMini]);

  // Handle Fullscreen Change Events
  useEffect(() => {
    setCanFullscreen(Boolean(document.fullscreenEnabled && containerRef.current?.requestFullscreen));

    const handleFsChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
  }, []);

  const toggleMotion = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = !reduceMotion;
      setReduceMotion(newValue);
      localStorage.setItem('gd_spam_reduce_motion', String(newValue));
  }, [reduceMotion]);

  const loadHighScore = () => {
      const key = `gd_spam_best_${difficulty.id}_${isEndless ? 'endless' : 'timed'}_${isMini ? 'mini' : 'normal'}`;
      const saved = localStorage.getItem(key);
      setHighScore(saved ? parseFloat(saved) : 0);
      setIsNewBest(false);
  };

  const getRunHistoryKey = () =>
      `gd_spam_runs_${difficulty.id}_${isEndless ? 'endless' : 'timed'}_${isMini ? 'mini' : 'normal'}`;

  const loadRunHistory = () => {
      const saved = localStorage.getItem(getRunHistoryKey());
      if (!saved) {
          setRecentRuns([]);
          return;
      }

      try {
          const parsed = JSON.parse(saved);
          setRecentRuns(Array.isArray(parsed) ? parsed.slice(0, 10) : []);
      } catch {
          setRecentRuns([]);
      }
  };

  const saveHighScore = useCallback((time: number) => {
      const key = `gd_spam_best_${difficulty.id}_${isEndless ? 'endless' : 'timed'}_${isMini ? 'mini' : 'normal'}`;
      const currentBest = parseFloat(localStorage.getItem(key) || '0');
      if (time > currentBest) {
          localStorage.setItem(key, time.toString());
          setHighScore(time);
          setIsNewBest(true);
          return true;
      }
      return false;
  }, [difficulty.id, isEndless, isMini]);
  
  const [consistency, setConsistency] = useState<string>('100%');
  
  // Audio is dynamically imported only after the user opts in.
  const audioEngineRef = useRef<WaveAudioEngine | null>(null);
  const audioLoadRef = useRef<Promise<WaveAudioEngine | null> | null>(null);
  const audioDisposedRef = useRef(false);
  const mutedRef = useRef(true);
  const statusRef = useRef(status);

  // Game State Ref
  const gameState = useRef({
    playerY: 250,
    playerX: 100,
    velocityY: 0,
    isHolding: false,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[], // Shards
    shockwaves: [] as Shockwave[],
    stars: [] as Star[], 
    trail: [] as {x: number, y: number, w: number}[],
    startTime: 0,
    lastFrameTime: 0,
    distanceTraveled: 0,
    lastObstacleX: 0,
    currentPattern: 'random' as PatternType,
    patternStep: 0,
    lastCenterY: 225, 
    shakeIntensity: 0,
    beatScale: 1.0, // For audio-visual sync
    trailAccumulator: 0,
    clickIntervals: [] as number[],
    clickTimes: [] as number[],
    clickCount: 0,
    runTime: 0,
    finishLineX: 0,
    baseColor: difficulty.color,
    lastClickTime: 0,
    rng: Math.random
  });

  const requestRef = useRef<number | undefined>(undefined);
  const lowVisualsRef = useRef(false);

  // --- LAZY AUDIO BRIDGE ---
  const triggerBeat = useCallback(() => {
      if (reduceMotion) return;
      gameState.current.beatScale = 1.015;
  }, [reduceMotion]);

  const ensureAudio = useCallback(async () => {
      if (audioDisposedRef.current) return null;

      if (audioEngineRef.current) {
          await audioEngineRef.current.resume();
          return audioEngineRef.current;
      }

      if (!audioLoadRef.current) {
          audioLoadRef.current = import('../lib/waveAudio')
              .then(({ createWaveAudioEngine }) => createWaveAudioEngine())
              .catch(() => null);
      }

      const engine = await audioLoadRef.current;
      if (!engine) return null;

      if (audioDisposedRef.current) {
          await engine.destroy();
          return null;
      }

      audioEngineRef.current = engine;
      await engine.resume();
      return engine;
  }, []);

  const playSound = useCallback((type: WaveSound) => {
      if (mutedRef.current) return;

      const existing = audioEngineRef.current;
      if (existing) {
          existing.playSound(type, isMini);
          return;
      }

      void ensureAudio().then((engine) => {
          if (!mutedRef.current) engine?.playSound(type, isMini);
      });
  }, [ensureAudio, isMini]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();

      const nextMuted = !mutedRef.current;
      mutedRef.current = nextMuted;
      setIsMuted(nextMuted);
      localStorage.setItem('gd_spam_muted', String(nextMuted));

      if (nextMuted) {
          audioEngineRef.current?.stopMusic();
          if (audioEngineRef.current) void audioEngineRef.current.suspend();
          return;
      }

      void ensureAudio().then((engine) => {
          if (
              engine &&
              !mutedRef.current &&
              statusRef.current === GameStatus.Playing &&
              !document.hidden
          ) {
              engine.startMusic(triggerBeat);
          }
      });
  }, [ensureAudio, triggerBeat]);

  // --- GAMEPLAY & VISUALS ---

  const spawnObstacle = useCallback((canvasWidth: number, canvasHeight: number) => {
    const minGap = isMini ? difficulty.gap * 0.8 : difficulty.gap;
    const obstacleWidth = 60;
    
    const random = gameState.current.rng;

    if (gameState.current.patternStep <= 0) {
        const patterns: PatternType[] = ['random', 'corridor', 'stairs_up', 'stairs_down', 'zigzag', 'sawtooth'];
        let nextPattern: PatternType = 'random';
        if (random() > 0.3) {
             nextPattern = patterns[Math.floor(random() * patterns.length)];
        }
        gameState.current.currentPattern = nextPattern;
        gameState.current.patternStep = Math.floor(random() * 5) + 5; 
    }

    const safeDelta = Math.min(60, Math.max(10, minGap - 30)); 

    let center = gameState.current.lastCenterY;
    let delta = 0;

    switch (gameState.current.currentPattern) {
        case 'corridor': delta = (random() * 10 - 5); break;
        case 'stairs_up': delta = -safeDelta * 0.6; break;
        case 'stairs_down': delta = safeDelta * 0.6; break;
        case 'zigzag': delta = safeDelta * (gameState.current.patternStep % 2 === 0 ? 1 : -1); break;
        case 'sawtooth': delta = (random() * 20 - 10); break;
        case 'random': default: delta = (random() - 0.5) * (safeDelta * 1.5); break;
    }

    center += delta;
    const margin = minGap / 2 + 20; 
    center = Math.max(margin, Math.min(canvasHeight - margin, center));
    
    const actualDiff = center - gameState.current.lastCenterY;
    if (Math.abs(actualDiff) > safeDelta) {
        center = gameState.current.lastCenterY + Math.sign(actualDiff) * safeDelta;
    }

    gameState.current.lastCenterY = center;
    gameState.current.patternStep--;

    let topHeight = center - minGap / 2;
    let bottomY = center + minGap / 2;
    
    if (gameState.current.currentPattern === 'sawtooth') {
        if (gameState.current.patternStep % 2 === 0) {
            const shrink = Math.min(10, minGap * 0.2); 
            topHeight += shrink; 
            bottomY -= shrink;
        }
    }

    gameState.current.obstacles.push({
      x: gameState.current.lastObstacleX + obstacleWidth,
      width: obstacleWidth,
      topHeight: topHeight,
      bottomY: bottomY,
    });

    gameState.current.lastObstacleX += obstacleWidth;
  }, [difficulty, isMini]);

  const createExplosion = (x: number, y: number, color: string) => {
    if (reduceMotion) return;
    const random = gameState.current.rng;
    const particleCount = lowVisualsRef.current ? 10 : 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = random() * Math.PI * 2;
      const speed = random() * 10 + 5;
      gameState.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: color,
        size: random() * 8 + 4,
        rotation: random() * Math.PI * 2,
        rotationSpeed: (random() - 0.5) * 0.5
      });
    }
    gameState.current.shockwaves.push({ x, y, radius: 10, opacity: 1.0 });
  };

  const calculateConsistency = () => {
    const intervals = gameState.current.clickIntervals;
    if (intervals.length < 2) return 'N/A';
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = mean > 0 ? stdDev / mean : 0;
    const score = Math.max(0, Math.min(100, 100 - coefficient * 100));
    return score.toFixed(1) + '%';
  };

  const getRunStats = () => {
    const seconds = Math.max(0.001, gameState.current.runTime / 1000);
    const intervals = gameState.current.clickIntervals;
    const clickCount = gameState.current.clickCount;
    const averageCps = clickCount / seconds;
    const clickTimes = gameState.current.clickTimes;
    let peakCps = 0;
    let left = 0;
    for (let right = 0; right < clickTimes.length; right++) {
      while (clickTimes[right] - clickTimes[left] > 1000) left++;
      peakCps = Math.max(peakCps, right - left + 1);
    }
    if (clickTimes.length < 2) peakCps = averageCps;
    const meanInterval = intervals.length
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length
      : 0;
    const variance = intervals.length
      ? intervals.reduce((a, b) => a + Math.pow(b - meanInterval, 2), 0) / intervals.length
      : 0;

    return {
      clickCount,
      averageCps,
      peakCps,
      averageInterval: meanInterval,
      intervalStdDev: Math.sqrt(variance),
    };
  };

  const recordRun = (result: "won" | "lost") => {
    if (runRecordedRef.current) return;

    const stats = getRunStats();
    const run: WaveRun = {
      time: Number((gameState.current.runTime / 1000).toFixed(2)),
      averageCps: Number(stats.averageCps.toFixed(2)),
      peakCps: Number(stats.peakCps.toFixed(2)),
      timingSd: Number(stats.intervalStdDev.toFixed(0)),
      clicks: stats.clickCount,
      result,
      timestamp: Date.now(),
      mode: `${difficulty.label}${isMini ? " · Mini" : " · Normal"}${isEndless ? " · Endless" : " · 15s"}`,
    };

    setRecentRuns((previousRuns) => {
      const next = [run, ...previousRuns].slice(0, 10);
      localStorage.setItem(getRunHistoryKey(), JSON.stringify(next));
      return next;
    });
    runRecordedRef.current = true;
  };

  const initStars = (width: number, height: number) => {
      gameState.current.stars = [];
      const random = gameState.current.rng;
      const starCount = lowVisualsRef.current ? 20 : 40;
      for(let i=0; i<starCount; i++) {
          gameState.current.stars.push({
              x: random() * width,
              y: random() * height,
              size: random() * 2 + 0.5,
              speed: random() * 2 + 0.2, 
              opacity: random() * 0.5 + 0.1
          });
      }
  };

  const resetGame = useCallback(() => {
    if (!canvasRef.current) return;
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const totalDistance = difficulty.speed * 60 * (WIN_TIME_MS / 1000);
    
    let rngFunc = Math.random;
    if (!isEndless) {
        const seedString = `${difficulty.id}-${isMini ? 'mini' : 'normal'}`;
        const seedValue = stringToSeed(seedString);
        rngFunc = mulberry32(seedValue);
    }

    gameState.current = {
      ...gameState.current,
      playerY: height / 2,
      velocityY: 0,
      isHolding: false,
      obstacles: [],
      particles: [],
      shockwaves: [],
      trail: [],
      startTime: 0,
      lastFrameTime: 0,
      distanceTraveled: 0,
      lastObstacleX: 600,
      lastCenterY: height / 2,
      patternStep: 0,
      currentPattern: 'random',
      shakeIntensity: 0,
      beatScale: 1.0,
      trailAccumulator: 0,
      clickIntervals: [],
      clickTimes: [],
      clickCount: 0,
      runTime: 0,
      lastClickTime: 0,
      finishLineX: totalDistance + 600,
      baseColor: difficulty.color,
      rng: rngFunc 
    };
    initStars(width, height);
    setConsistency('100%');
    setIsNewBest(false);
    setDisplayTime(0);
    runRecordedRef.current = false;
    lastHudUpdateRef.current = 0;
  }, [difficulty.color, difficulty.speed, difficulty.id, isEndless, isMini]);

  // --- GAME LOOP ---
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    gameState.current.beatScale = 1.0 + (gameState.current.beatScale - 1.0) * 0.9;

    if (status === GameStatus.Playing) {
        const now = performance.now();
        if (gameState.current.startTime === 0) {
            gameState.current.startTime = now;
            gameState.current.lastFrameTime = now;
        }

        const rawDeltaMs = now - gameState.current.lastFrameTime;
        const frameDeltaMs = Math.min(1000 / 30, Math.max(0, rawDeltaMs));
        const frameFactor = frameDeltaMs / (1000 / 60);
        gameState.current.lastFrameTime = now;
        gameState.current.runTime += frameDeltaMs;

        const hudInterval = lowVisualsRef.current ? 100 : 50;
        if (now - lastHudUpdateRef.current >= hudInterval) {
            setDisplayTime(gameState.current.runTime / 1000);
            lastHudUpdateRef.current = now;
        }

        const speedY = isMini ? WAVE_SPEED_Y * 1.5 : WAVE_SPEED_Y;
        gameState.current.velocityY = gameState.current.isHolding ? -speedY : speedY;
        gameState.current.playerY += gameState.current.velocityY * frameFactor;

        const moveSpeed = difficulty.speed * frameFactor;
        gameState.current.distanceTraveled += moveSpeed;
        
        gameState.current.stars.forEach(star => {
            star.x -= star.speed * (moveSpeed / 3);
            if (star.x < 0) star.x = canvas.width;
        });

        const spawnThreshold = isEndless ? Infinity : gameState.current.finishLineX - 400;
        const lastOb = gameState.current.obstacles.length > 0 ? gameState.current.obstacles[gameState.current.obstacles.length - 1] : null;
        if (!lastOb || (lastOb.x < gameState.current.distanceTraveled + canvas.width + 100 && gameState.current.lastObstacleX < spawnThreshold)) {
            spawnObstacle(canvas.width, canvas.height);
        }

        const playerRadius = isMini ? 4 : 8;
        const hitboxSize = playerRadius * 0.5; 
        const playerHitbox = {
             x: gameState.current.playerX - hitboxSize,
             y: gameState.current.playerY - hitboxSize,
             w: hitboxSize * 2,
             h: hitboxSize * 2
        };

        if (gameState.current.playerY < 0 || gameState.current.playerY > canvas.height) {
            handleDeath();
            return;
        }

        gameState.current.obstacles.forEach(obs => {
             const obsScreenX = obs.x - gameState.current.distanceTraveled;
             if (obsScreenX < canvas.width && obsScreenX + obs.width > 0) {
                 if (playerHitbox.x < obsScreenX + obs.width &&
                     playerHitbox.x + playerHitbox.w > obsScreenX) {
                     if (playerHitbox.y < obs.topHeight) handleDeath();
                     if (playerHitbox.y + playerHitbox.h > obs.bottomY) handleDeath();
                 }
             }
        });

        if (!isEndless) {
             const finishScreenX = gameState.current.finishLineX - gameState.current.distanceTraveled;
             if (finishScreenX <= gameState.current.playerX && !runRecordedRef.current) {
                 setConsistency(calculateConsistency());
                 recordRun("won");
                 onStatusChange(GameStatus.Won);
                 playSound('win');
                 const didBreakRecord = saveHighScore(gameState.current.runTime / 1000);
                 if(didBreakRecord) setIsNewBest(true);
             }
        }

        gameState.current.trailAccumulator += frameFactor;
        const trailStep = lowVisualsRef.current ? 3 : 2;
        const maxTrailPoints = lowVisualsRef.current ? 18 : 30;
        if (gameState.current.trailAccumulator >= trailStep) {
            const w = isMini ? 4 : 8;
            gameState.current.trail.push({ x: gameState.current.playerX, y: gameState.current.playerY, w });
            if (gameState.current.trail.length > maxTrailPoints) gameState.current.trail.shift();
            gameState.current.trailAccumulator %= trailStep;
        }

        for (let i = 0; i < gameState.current.trail.length; i++) {
             gameState.current.trail[i].x -= moveSpeed;
             gameState.current.trail[i].w *= Math.pow(0.94, frameFactor);
        }

        gameState.current.particles = gameState.current.particles.filter(p => p.life > 0);
        gameState.current.particles.forEach(p => {
            p.x += p.vx * frameFactor;
            p.y += p.vy * frameFactor;
            p.vy += 0.5 * frameFactor;
            p.rotation += p.rotationSpeed * frameFactor;
            p.life -= 0.02 * frameFactor;
            p.size *= Math.pow(0.98, frameFactor);
        });

        gameState.current.shockwaves = gameState.current.shockwaves.filter(s => s.opacity > 0);
        gameState.current.shockwaves.forEach(s => {
            s.radius += 8 * frameFactor;
            s.opacity -= 0.05 * frameFactor;
        });

    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    
    if (!reduceMotion) {
        const scale = gameState.current.beatScale;
        if (scale > 1.001) {
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.scale(scale, scale);
            ctx.translate(-canvas.width/2, -canvas.height/2);
        }

        if (gameState.current.shakeIntensity > 0) {
            const random = gameState.current.rng; 
            const dx = (random() - 0.5) * gameState.current.shakeIntensity;
            const dy = (random() - 0.5) * gameState.current.shakeIntensity;
            ctx.translate(dx, dy);
            gameState.current.shakeIntensity *= 0.9;
        }
    }

    ctx.fillStyle = '#020617'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gameState.current.stars.forEach(star => {
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = gameState.current.baseColor;
    ctx.fillRect(0, 0, canvas.width, 10);
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    if (!lowVisualsRef.current && !reduceMotion) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = gameState.current.baseColor;
    }
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(canvas.width, 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, canvas.height - 10); ctx.lineTo(canvas.width, canvas.height - 10); ctx.stroke();
    ctx.shadowBlur = 0;

    gameState.current.obstacles.forEach(obs => {
        const x = obs.x - gameState.current.distanceTraveled;
        if (x > -obs.width && x < canvas.width) {
            
            if (lowVisualsRef.current || reduceMotion) {
                ctx.fillStyle = `${gameState.current.baseColor}88`;
                ctx.fillRect(x, 0, obs.width, obs.topHeight);
                ctx.fillRect(x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
            } else {
                const gradTop = ctx.createLinearGradient(0, 0, 0, obs.topHeight);
                gradTop.addColorStop(0, gameState.current.baseColor);
                gradTop.addColorStop(1, `${gameState.current.baseColor}44`);

                const gradBottom = ctx.createLinearGradient(0, obs.bottomY, 0, canvas.height);
                gradBottom.addColorStop(0, `${gameState.current.baseColor}44`);
                gradBottom.addColorStop(1, gameState.current.baseColor);

                ctx.fillStyle = gradTop;
                ctx.fillRect(x, 0, obs.width, obs.topHeight);

                ctx.fillStyle = gradBottom;
                ctx.fillRect(x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
            }
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, obs.topHeight); ctx.lineTo(x + obs.width, obs.topHeight); ctx.lineTo(x + obs.width, 0);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, canvas.height); ctx.lineTo(x, obs.bottomY); ctx.lineTo(x + obs.width, obs.bottomY); ctx.lineTo(x + obs.width, canvas.height);
            ctx.stroke();
        }
    });

    if (!isEndless) {
        const finishX = gameState.current.finishLineX - gameState.current.distanceTraveled;
        if (finishX < canvas.width) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(finishX, 0, 10, canvas.height);
            ctx.shadowBlur = 50;
            ctx.shadowColor = '#fff';
            ctx.fillRect(finishX, 0, 10, canvas.height);
            ctx.shadowBlur = 0;
        }
    }

    if (gameState.current.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(gameState.current.trail[0].x, gameState.current.trail[0].y - gameState.current.trail[0].w/2);
        for (let i = 1; i < gameState.current.trail.length; i++) {
            ctx.lineTo(gameState.current.trail[i].x, gameState.current.trail[i].y - gameState.current.trail[i].w/2);
        }
        ctx.lineTo(gameState.current.playerX, gameState.current.playerY);
        for (let i = gameState.current.trail.length - 1; i >= 0; i--) {
            ctx.lineTo(gameState.current.trail[i].x, gameState.current.trail[i].y + gameState.current.trail[i].w/2);
        }
        ctx.closePath();
        ctx.fillStyle = difficulty.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        ctx.beginPath();
        ctx.moveTo(gameState.current.trail[0].x, gameState.current.trail[0].y);
        for (let i = 1; i < gameState.current.trail.length; i++) {
            ctx.lineTo(gameState.current.trail[i].x, gameState.current.trail[i].y);
        }
        ctx.lineTo(gameState.current.playerX, gameState.current.playerY);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    if (status !== GameStatus.Lost) {
        if (!lowVisualsRef.current && !reduceMotion) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#fff';
        }
        ctx.save();
        ctx.translate(gameState.current.playerX, gameState.current.playerY);
        const rotation = gameState.current.velocityY > 0 ? 45 : -45;
        ctx.rotate(rotation * Math.PI / 180);
        
        const size = isMini ? 6 : 12;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(-size, -size);
        ctx.lineTo(size, 0);
        ctx.lineTo(-size, size);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = difficulty.color; 
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/2);
        ctx.lineTo(size/2, 0);
        ctx.lineTo(-size/2, size/2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.shadowBlur = 0;
    }

    gameState.current.particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(-s/2, s/2);
        ctx.lineTo(s/2, s/2);
        ctx.lineTo(0, -s/2);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1.0;
        ctx.restore();
    });

    gameState.current.shockwaves.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.lineWidth = 4;
        ctx.stroke();
    });

    ctx.restore(); 

    if (status === GameStatus.Playing) {
        requestRef.current = requestAnimationFrame(gameLoop);
    } else {
        requestRef.current = undefined;
    }
  }, [status, difficulty, isEndless, isMini, spawnObstacle, saveHighScore, playSound, reduceMotion]);

  const handleDeath = () => {
      if (runRecordedRef.current) return;
      onStatusChange(GameStatus.Lost);
      gameState.current.shakeIntensity = reduceMotion ? 0 : 40; 
      createExplosion(gameState.current.playerX, gameState.current.playerY, '#fff');
      playSound('crash');
      setConsistency(calculateConsistency());
      recordRun("lost");
      
      const currentTime = gameState.current.runTime / 1000;
      const didBreakRecord = saveHighScore(currentTime);
      if (didBreakRecord) {
          setIsNewBest(true);
          playSound('newBest');
      }
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const time = (gameState.current.runTime / 1000).toFixed(2);
    const pct = !isEndless ? Math.min(100, (gameState.current.distanceTraveled / gameState.current.finishLineX) * 100).toFixed(0) + '%' : '∞';
    
    let text = `I just scored ${time}s on ${difficulty.label} mode!`;
    if (status === GameStatus.Won) text = `I completed the ${difficulty.label} level in ${time}s on Geometry Dash Spam Test! 🏆`;
    else if (isEndless) text = `I survived ${time}s on Endless ${difficulty.label} mode in Geometry Dash Spam Test! 🌊`;
    else text = `I reached ${pct} on ${difficulty.label} mode in Geometry Dash Spam Test! 💀 ${time}s`;
    
    text += `\n\nTry to beat me here: https://geometrydashspam.cc`;
    
    setShareText(text);
    setCopied(false);
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
      try {
          await navigator.clipboard.writeText(shareText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      } catch (err) {
          console.error("Failed to copy", err);
      }
  };

  const handleStart = useCallback((e?: any) => {
     // Check if the target is a button, interactive element, or inside the modal
     if (e && e.target instanceof Element) {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.share-modal-content')) {
            return;
        }
     }
     
     // Prevent starting if share modal is open
     if (showShareModal) return;
  
     if (status === GameStatus.Lost || status === GameStatus.Won) {
         resetGame();
         onStatusChange(GameStatus.Playing);
         gameState.current.isHolding = true; 
         playSound('click');
         return;
     }
     
     if (status === GameStatus.Idle) {
         onStatusChange(GameStatus.Playing);
     }
     
     gameState.current.isHolding = true;
     
     const now = performance.now();
     if (gameState.current.lastClickTime > 0) {
         gameState.current.clickIntervals.push(now - gameState.current.lastClickTime);
         if (gameState.current.clickIntervals.length > 200) gameState.current.clickIntervals.shift();
     }
     gameState.current.lastClickTime = now;
     gameState.current.clickTimes.push(now);
     if (gameState.current.clickTimes.length > 500) gameState.current.clickTimes.shift();
     gameState.current.clickCount += 1;

     playSound('click');
  }, [status, resetGame, onStatusChange, playSound, showShareModal]);

  const handleEnd = useCallback(() => {
     gameState.current.isHolding = false;
  }, []);

  const focusGame = useCallback(() => {
      requestAnimationFrame(() => {
          containerRef.current?.focus({ preventScroll: true });
      });
  }, []);

  useEffect(() => {
      statusRef.current = status;
      mutedRef.current = isMuted;

      const syncMusic = () => {
          if (isMuted || status !== GameStatus.Playing || document.hidden) {
              audioEngineRef.current?.stopMusic();
              return;
          }

          void ensureAudio().then((engine) => {
              if (
                  engine &&
                  !mutedRef.current &&
                  statusRef.current === GameStatus.Playing &&
                  !document.hidden
              ) {
                  engine.startMusic(triggerBeat);
              }
          });
      };

      syncMusic();
      document.addEventListener('visibilitychange', syncMusic);

      return () => {
          document.removeEventListener('visibilitychange', syncMusic);
          audioEngineRef.current?.stopMusic();
      };
  }, [ensureAudio, isMuted, status, triggerBeat]);

  useEffect(() => {
      return () => {
          audioDisposedRef.current = true;
          const engine = audioEngineRef.current;
          audioEngineRef.current = null;
          if (engine) void engine.destroy();
      };
  }, []);

  useEffect(() => {
      const releaseInput = () => {
          gameState.current.isHolding = false;
      };

      const handleVisibilityChange = () => {
          if (document.hidden) {
              releaseInput();
          }
          gameState.current.lastFrameTime = performance.now();
      };

      window.addEventListener('blur', releaseInput);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
          window.removeEventListener('blur', releaseInput);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
  }, []);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (showShareModal) {
              if (e.key === 'Escape') {
                  e.preventDefault();
                  setShowShareModal(false);
              }
              return;
          }

          const target = e.target as HTMLElement | null;
          if (
              target?.closest('button, a, input, textarea, select') ||
              target?.isContentEditable
          ) {
              return;
          }

          const gameFocused = document.activeElement === containerRef.current;
          if (status !== GameStatus.Playing && !gameFocused) return;

          if (e.code === 'Space' || e.code === 'ArrowUp') {
              e.preventDefault();
              if (!e.repeat) handleStart();
          }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
          if (e.code === 'Space' || e.code === 'ArrowUp') {
              handleEnd();
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      const container = containerRef.current;
      const handlePointerDown = (e: PointerEvent) => {
          if (status !== GameStatus.Playing) return;

          const target = e.target as HTMLElement;
          if (target.closest('button') || target.closest('a') || target.closest('.share-modal-content')) {
              return;
          }

          e.preventDefault();
          if (container?.setPointerCapture) {
              try {
                  container.setPointerCapture(e.pointerId);
              } catch {}
          }
          handleStart(e);
      };
      const handlePointerUp = (e: PointerEvent) => {
          if (status !== GameStatus.Playing) return;

          e.preventDefault();
          handleEnd();
          if (container?.hasPointerCapture?.(e.pointerId)) {
              try {
                  container.releasePointerCapture(e.pointerId);
              } catch {}
          }
      };

      if (container) {
          container.addEventListener('pointerdown', handlePointerDown, { passive: false });
          container.addEventListener('pointerup', handlePointerUp, { passive: false });
          container.addEventListener('pointercancel', handlePointerUp, { passive: false });
      }

      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
          if (container) {
              container.removeEventListener('pointerdown', handlePointerDown);
              container.removeEventListener('pointerup', handlePointerUp);
              container.removeEventListener('pointercancel', handlePointerUp);
          }
      };
  }, [handleStart, handleEnd, showShareModal, status]);

  useEffect(() => {
      if (status === GameStatus.Playing) {
          if (!requestRef.current) {
              requestRef.current = requestAnimationFrame(gameLoop);
          }
      } else {
          const frame = requestAnimationFrame(gameLoop);
          return () => cancelAnimationFrame(frame);
      }

      return () => {
          if (requestRef.current) {
              cancelAnimationFrame(requestRef.current);
              requestRef.current = undefined;
          }
      };
  }, [gameLoop, status]);

  useEffect(() => {
      resetGame();
      const frame = requestAnimationFrame(gameLoop);
      return () => cancelAnimationFrame(frame);
  }, [resetGame, gameLoop]);

  const runStats =
    status === GameStatus.Lost || status === GameStatus.Won
      ? getRunStats()
      : {
          clickCount: 0,
          averageCps: 0,
          peakCps: 0,
          averageInterval: 0,
          intervalStdDev: 0,
        };

  return (
    <div 
      className={`relative w-full transition-all duration-500 mx-auto select-none ${status === GameStatus.Playing ? 'touch-none' : 'touch-pan-y'} group bg-slate-950 rounded-lg overflow-hidden
        ${isFullscreen ? 'fixed inset-0 z-50 h-screen max-w-none rounded-none' : 'max-w-5xl h-[330px] sm:h-auto sm:aspect-video md:h-[500px]'}
      `}
      ref={containerRef}
      tabIndex={0}
      aria-label="Geometry Dash wave practice area"
      style={{
        boxShadow: isFullscreen ? 'none' : `0 0 30px ${difficulty.color}15, 0 0 0 1px ${difficulty.color}30`
      }}
    >
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status === GameStatus.Lost
          ? `Run crashed after ${(gameState.current.runTime / 1000).toFixed(2)} seconds.`
          : status === GameStatus.Won
            ? `Run complete in ${(gameState.current.runTime / 1000).toFixed(2)} seconds.`
            : ""}
      </p>
      <canvas
          ref={canvasRef}
          width={800}
          height={450}
          aria-hidden="true"
          className="block w-full h-full cursor-pointer outline-none object-contain bg-[#020617]"
      />

      {/* --- HUD --- */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1">
              <div className="text-3xl sm:text-4xl font-display font-black text-white italic drop-shadow-lg tabular-nums">
                  {status === GameStatus.Playing
                    ? displayTime.toFixed(2)
                    : (gameState.current.runTime / 1000).toFixed(2)
                  }s
              </div>
              {!isEndless ? (
                <div className="w-32 sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                   <div 
                      className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-75"
                      style={{ width: `${Math.min(100, (gameState.current.distanceTraveled / gameState.current.finishLineX) * 100)}%` }}
                   ></div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest">
                        Best: {highScore.toFixed(2)}s
                    </span>
                </div>
              )}
          </div>
          
          <div className="flex gap-2 pointer-events-auto">
              <button 
                  aria-label={reduceMotion ? "Enable motion effects" : "Reduce motion effects"}
                  aria-pressed={reduceMotion}
                  title={reduceMotion ? "Enable Motion/Pulse" : "Reduce Motion/Shake"}
                  onClick={toggleMotion} 
                  className={`p-2 rounded-full backdrop-blur-md transition-colors border border-transparent ${reduceMotion ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'}`}
              >
                  {reduceMotion ? <ZapOff className="w-5 h-5"/> : <Activity className="w-5 h-5"/>}
              </button>
              {canFullscreen && (
                <button 
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    aria-pressed={isFullscreen}
                    title="Toggle Fullscreen"
                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} 
                    className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-colors"
                >
                    {isFullscreen ? <Minimize className="w-5 h-5"/> : <Maximize className="w-5 h-5"/>}
                </button>
              )}
              <button 
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  aria-pressed={isMuted}
                  onClick={toggleMute} 
                  className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-colors"
              >
                  {isMuted ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
              </button>
          </div>
      </div>

      {status === GameStatus.Playing && (
        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300 backdrop-blur sm:hidden pointer-events-none">
          Hold = rise · release = fall
        </div>
      )}

      {/* --- START SCREEN --- */}
      {status === GameStatus.Idle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[2px] z-10 animate-in fade-in duration-300 pointer-events-none">
          <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-8 border border-white/10 bg-black/55 rounded-2xl shadow-2xl backdrop-blur-md w-[calc(100%_-_1.5rem)] max-w-md mx-3 sm:mx-4 pointer-events-auto">
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white mb-1 sm:mb-2 tracking-tight" style={{ textShadow: `0 0 20px ${difficulty.color}` }}>
                {difficulty.label.toUpperCase()}
              </h2>
              <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: difficulty.color }}></div>
              <div className="flex justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-mono text-slate-400">
                  <div className="flex flex-col items-center">
                      <span className="text-white font-bold">{isEndless ? '∞' : '15s'}</span>
                      <span className="text-xs uppercase">Goal</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <span className="text-white font-bold">{difficulty.speed}</span>
                      <span className="text-xs uppercase">Speed</span>
                  </div>
              </div>
              
              <button
                onClick={() => {
                               onStatusChange(GameStatus.Playing);
                    focusGame();
                }}
                className="group relative w-full py-3 sm:py-4 bg-white text-black font-display font-black text-lg sm:text-xl rounded hover:scale-[1.02] transition-transform overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                   START RUN
                </span>
              </button>
              
              <div className="text-[11px] sm:text-xs text-slate-400 flex flex-col gap-1">
                 <span>Hold/touch to rise · release to fall · Space/↑ on keyboard</span>
                 {highScore > 0 && <span className="text-yellow-500 font-bold">Personal Best: {highScore.toFixed(2)}s</span>}
                 {recentRuns.length > 0 && (
                   <span className="text-slate-500">
                     Recent {Math.min(3, recentRuns.length)} avg:{" "}
                     {(recentRuns.slice(0, 3).reduce((sum, run) => sum + run.time, 0) / Math.min(3, recentRuns.length)).toFixed(2)}s ·{" "}
                     {(recentRuns.slice(0, 3).reduce((sum, run) => sum + run.averageCps, 0) / Math.min(3, recentRuns.length)).toFixed(2)} CPS
                   </span>
                 )}
              </div>
          </div>
        </div>
      )}

      {(status === GameStatus.Lost || status === GameStatus.Won || showShareModal) && (
        <WaveRunOverlays
          status={status}
          isNewBest={isNewBest}
          runTimeSeconds={gameState.current.runTime / 1000}
          highScore={highScore}
          runStats={runStats}
          consistency={consistency}
          showShareModal={showShareModal}
          shareText={shareText}
          copied={copied}
          onRetry={() => {
            resetGame();
            onStatusChange(GameStatus.Playing);
            focusGame();
          }}
          onMenu={() => {
            resetGame();
            onStatusChange(GameStatus.Idle);
          }}
          onShare={handleShareClick}
          onCloseShare={() => setShowShareModal(false)}
          onCopyShare={copyToClipboard}
        />
      )}

    </div>
  );
});

export default GameCanvas;
