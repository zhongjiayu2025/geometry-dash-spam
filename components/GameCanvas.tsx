
"use client";

import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import { DifficultyConfig, GameStatus } from '../types';
import { WIN_TIME_MS, WAVE_SPEED_Y } from '../constants';
import { Trophy, AlertTriangle, Crown, Volume2, VolumeX, Zap } from 'lucide-react';

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
  passed: boolean;
  type: 'normal' | 'spike'; 
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

// Level Generation Patterns
type PatternType = 'random' | 'corridor' | 'stairs_up' | 'stairs_down' | 'zigzag';

const GameCanvas: React.FC<GameCanvasProps> = memo(({ difficulty, status, onStatusChange, isEndless = false, isMini = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  
  useEffect(() => {
    setIsMuted(localStorage.getItem('gd_spam_muted') === 'true');
    loadHighScore();
  }, [difficulty.id, isEndless, isMini]);

  const loadHighScore = () => {
      const key = `gd_spam_best_${difficulty.id}_${isEndless ? 'endless' : 'timed'}_${isMini ? 'mini' : 'normal'}`;
      const saved = localStorage.getItem(key);
      setHighScore(saved ? parseFloat(saved) : 0);
      setIsNewBest(false);
  };

  const saveHighScore = (time: number) => {
      const key = `gd_spam_best_${difficulty.id}_${isEndless ? 'endless' : 'timed'}_${isMini ? 'mini' : 'normal'}`;
      const currentBest = parseFloat(localStorage.getItem(key) || '0');
      if (time > currentBest) {
          localStorage.setItem(key, time.toString());
          setHighScore(time);
          setIsNewBest(true);
          return true;
      }
      return false;
  };
  
  const [consistency, setConsistency] = useState<string>('100%');
  
  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  
  // Music Sequencer Refs
  const musicSchedulerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const noteIndexRef = useRef<number>(0);

  // Game State Ref
  const gameState = useRef({
    playerY: 250,
    playerX: 100,
    velocityY: 0,
    isHolding: false,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    shockwaves: [] as Shockwave[], // New visual effect
    trail: [] as {x: number, y: number}[],
    startTime: 0,
    distanceTraveled: 0,
    lastObstacleX: 0,
    // Generation Logic State
    currentPattern: 'random' as PatternType,
    patternStep: 0,
    lastCenterY: 225, // Track previous hole center for continuity
    bgOffset: 0,
    groundOffset: 0,
    shakeIntensity: 0,
    pulseIntensity: 0,
    frameCount: 0,
    clickIntervals: [] as number[],
    runTime: 0,
    finishLineX: 0,
    baseColor: difficulty.color,
    lastClickTime: 0,
  });

  const requestRef = useRef<number | undefined>(undefined);

  // --- AUDIO SYSTEM ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;
          masterGainRef.current = ctx.createGain();
          masterGainRef.current.connect(ctx.destination);
      }
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playKick = useCallback((time: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.connect(gain);
    gain.connect(masterGainRef.current);
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    gain.gain.setValueAtTime(0.6, time); // Slightly louder kick
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    osc.start(time);
    osc.stop(time + 0.5);
  }, []);

  const playBass = useCallback((time: number, note: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    // Mix Sawtooth and Square for "Tech" feel
    osc.type = 'sawtooth'; 
    osc.connect(gain);
    gain.connect(masterGainRef.current);
    
    const freq = 55 * Math.pow(2, note / 12); 
    osc.frequency.setValueAtTime(freq, time);
    osc.detune.setValueAtTime(Math.random() * 20 - 10, time); // Detune for width
    
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    
    osc.start(time);
    osc.stop(time + 0.3);
  }, []);

  const playHiHat = useCallback((time: number) => {
      if (!audioCtxRef.current || !masterGainRef.current) return;
      const bufferSize = audioCtxRef.current.sampleRate * 0.1;
      const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = audioCtxRef.current.createBufferSource();
      noise.buffer = buffer;
      const gain = audioCtxRef.current.createGain();
      const filter = audioCtxRef.current.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 6000; // Sharper hats

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current);

      gain.gain.setValueAtTime(0.04, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      noise.start(time);
  }, []);

  const scheduleMusic = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || isMuted) return;

    const tempo = 140; 
    const secondsPerBeat = 60.0 / tempo;
    const lookahead = 0.1;

    while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
        const sixteenth = noteIndexRef.current % 16;
        
        // Heavy Kick on 1
        if (sixteenth % 4 === 0) playKick(nextNoteTimeRef.current);
        
        // Hats on offbeats
        if (sixteenth % 2 === 0 && sixteenth % 4 !== 0) playHiHat(nextNoteTimeRef.current);
        if (Math.random() > 0.6) playHiHat(nextNoteTimeRef.current + (secondsPerBeat/8));

        // Driving Bass
        let note = 2; // F#
        if (noteIndexRef.current % 32 >= 16) note = 5; 
        if (noteIndexRef.current % 64 >= 48) note = 7; 

        if (sixteenth % 4 !== 0) {
           playBass(nextNoteTimeRef.current, note);
        } else {
           playBass(nextNoteTimeRef.current, note - 12); 
        }

        const secondsPer16th = secondsPerBeat / 4;
        nextNoteTimeRef.current += secondsPer16th;
        noteIndexRef.current++;
    }
  }, [isMuted, playKick, playBass, playHiHat]);

  const startMusic = useCallback(() => {
    if (musicSchedulerRef.current) return;
    if (audioCtxRef.current) {
        nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.1;
        noteIndexRef.current = 0;
        musicSchedulerRef.current = window.setInterval(scheduleMusic, 25);
    }
  }, [scheduleMusic]);

  const stopMusic = useCallback(() => {
    if (musicSchedulerRef.current) {
        clearInterval(musicSchedulerRef.current);
        musicSchedulerRef.current = null;
    }
  }, []);

  const playSound = useCallback((type: 'crash' | 'win' | 'click' | 'newBest') => {
      if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.connect(masterGainRef.current);
      osc.connect(gain);

      const now = ctx.currentTime;
      
      if (type === 'click') {
          osc.type = 'triangle'; // Crisper click
          osc.frequency.setValueAtTime(isMini ? 900 : 700, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
      } else if (type === 'crash') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.linearRampToValueAtTime(50, now + 0.4);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
      } else if (type === 'win') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.linearRampToValueAtTime(1000, now + 0.5);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0, now + 1.0);
          osc.start(now);
          osc.stop(now + 1.0);
      } else if (type === 'newBest') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now); 
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
      }
  }, [isMuted, isMini]);

  // --- LEVEL GENERATION SYSTEM ---

  const spawnObstacle = useCallback((canvasWidth: number, canvasHeight: number) => {
    const minGap = isMini ? difficulty.gap * 0.8 : difficulty.gap;
    
    // Pattern Selection Logic
    if (gameState.current.patternStep <= 0) {
        const patterns: PatternType[] = ['random', 'corridor', 'stairs_up', 'stairs_down', 'zigzag'];
        // Pick random pattern, but favor 'corridor' for spam practice
        const nextPattern = Math.random() > 0.6 ? 'corridor' : patterns[Math.floor(Math.random() * patterns.length)];
        gameState.current.currentPattern = nextPattern;
        // Determine length of pattern (number of obstacles)
        gameState.current.patternStep = Math.floor(Math.random() * 5) + 3; // 3 to 8 blocks long
    }

    let center = gameState.current.lastCenterY;
    const padding = minGap + 50;

    switch (gameState.current.currentPattern) {
        case 'corridor':
            // Straight line, slightly fluctuating
            center += (Math.random() * 20 - 10); 
            break;
        case 'stairs_up':
            center -= (minGap * 0.5); // Step up
            break;
        case 'stairs_down':
            center += (minGap * 0.5); // Step down
            break;
        case 'zigzag':
            // Alternating up/down drastically
            const direction = gameState.current.patternStep % 2 === 0 ? 1 : -1;
            center += (minGap * 1.5 * direction);
            break;
        case 'random':
        default:
            center = Math.random() * (canvasHeight - minGap - 100) + 50 + minGap / 2;
            break;
    }

    // Clamp center to screen
    center = Math.max(padding, Math.min(canvasHeight - padding, center));
    gameState.current.lastCenterY = center;
    gameState.current.patternStep--;

    const topHeight = center - minGap / 2;
    const bottomY = center + minGap / 2;
    
    // Consistent width for patterns helps reading
    const width = 60; 
    const spacing = 0; // Tighter spacing for continuous feel

    gameState.current.obstacles.push({
      x: gameState.current.lastObstacleX + width + spacing,
      width: width,
      topHeight: topHeight,
      bottomY: bottomY,
      passed: false,
      type: 'normal'
    });

    gameState.current.lastObstacleX = gameState.current.obstacles[gameState.current.obstacles.length - 1].x;
  }, [difficulty, isMini]);

  const createExplosion = (x: number, y: number, color: string) => {
    // 1. Particles
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      gameState.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
    // 2. Shockwave
    gameState.current.shockwaves.push({
        x, y,
        radius: 10,
        opacity: 1.0
    });
  };

  const calculateConsistency = () => {
    const intervals = gameState.current.clickIntervals;
    if (intervals.length < 2) return '100%';
    let mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    let variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
    let stdDev = Math.sqrt(variance);
    let score = Math.max(0, 100 - (stdDev * 2)); 
    return score.toFixed(1) + '%';
  };

  const resetGame = useCallback(() => {
    if (!canvasRef.current) return;
    const height = canvasRef.current.height;
    const totalDistance = difficulty.speed * 60 * (WIN_TIME_MS / 1000);

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
      distanceTraveled: 0,
      lastObstacleX: 600,
      lastCenterY: height / 2,
      patternStep: 0,
      currentPattern: 'random',
      bgOffset: 0,
      groundOffset: 0,
      shakeIntensity: 0,
      pulseIntensity: 0,
      frameCount: 0,
      clickIntervals: [],
      runTime: 0,
      finishLineX: totalDistance + 600,
      baseColor: difficulty.color
    };
    setConsistency('100%');
    setIsNewBest(false);
  }, [difficulty.color, difficulty.speed]);

  // --- MAIN GAME LOOP ---
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Update Physics
    if (status === GameStatus.Playing) {
        if (gameState.current.startTime === 0) gameState.current.startTime = Date.now();
        gameState.current.runTime = Date.now() - gameState.current.startTime;

        const speedY = isMini ? WAVE_SPEED_Y * 1.5 : WAVE_SPEED_Y;
        gameState.current.velocityY = gameState.current.isHolding ? -speedY : speedY;
        gameState.current.playerY += gameState.current.velocityY;

        const moveSpeed = difficulty.speed;
        gameState.current.distanceTraveled += moveSpeed;
        gameState.current.bgOffset = (gameState.current.bgOffset + moveSpeed * 0.2) % canvas.width;
        gameState.current.groundOffset = (gameState.current.groundOffset + moveSpeed) % 50;
        gameState.current.pulseIntensity *= 0.9;

        // Generation
        const spawnThreshold = isEndless ? Infinity : gameState.current.finishLineX - 400;
        const lastOb = gameState.current.obstacles.length > 0 ? gameState.current.obstacles[gameState.current.obstacles.length - 1] : null;
        
        if (!lastOb || (lastOb.x < gameState.current.distanceTraveled + canvas.width + 100 && gameState.current.lastObstacleX < spawnThreshold)) {
            spawnObstacle(canvas.width, canvas.height);
        }

        // Collision
        const playerRadius = isMini ? 4 : 8;
        // Hitbox slightly smaller than visual
        const playerHitbox = {
             x: gameState.current.playerX - playerRadius + 2,
             y: gameState.current.playerY - playerRadius + 2,
             w: (playerRadius * 2) - 4,
             h: (playerRadius * 2) - 4
        };

        if (gameState.current.playerY < 0 || gameState.current.playerY > canvas.height) {
            handleDeath();
            return;
        }

        gameState.current.obstacles.forEach(obs => {
             const obsScreenX = obs.x - gameState.current.distanceTraveled;
             if (obsScreenX < canvas.width && obsScreenX + obs.width > 0) {
                 // AABB Collision
                 if (playerHitbox.x < obsScreenX + obs.width &&
                     playerHitbox.x + playerHitbox.w > obsScreenX) {
                     
                     if (playerHitbox.y < obs.topHeight) handleDeath();
                     if (playerHitbox.y + playerHitbox.h > obs.bottomY) handleDeath();
                 }
             }
        });

        if (!isEndless) {
             const finishScreenX = gameState.current.finishLineX - gameState.current.distanceTraveled;
             if (finishScreenX <= gameState.current.playerX) {
                 onStatusChange(GameStatus.Won);
                 playSound('win');
                 const didBreakRecord = saveHighScore(gameState.current.runTime / 1000);
                 if(didBreakRecord) setIsNewBest(true);
             }
        }

        // Trail Logic
        if (gameState.current.frameCount % 2 === 0) {
            gameState.current.trail.push({ x: gameState.current.playerX, y: gameState.current.playerY });
            if (gameState.current.trail.length > 20) gameState.current.trail.shift();
        }
        for (let i = 0; i < gameState.current.trail.length; i++) {
             gameState.current.trail[i].x -= moveSpeed;
        }

        // Update Effects
        gameState.current.particles = gameState.current.particles.filter(p => p.life > 0);
        gameState.current.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            p.size *= 0.95;
        });

        gameState.current.shockwaves = gameState.current.shockwaves.filter(s => s.opacity > 0);
        gameState.current.shockwaves.forEach(s => {
            s.radius += 5;
            s.opacity -= 0.05;
        });

        gameState.current.frameCount++;
    }

    // 2. Rendering
    ctx.fillStyle = '#020617'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState.current.pulseIntensity > 0.1) {
        ctx.fillStyle = `rgba(37, 99, 235, ${gameState.current.pulseIntensity * 0.1})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Grid
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + gameState.current.pulseIntensity * 0.1})`;
    ctx.lineWidth = 1;
    const gridSize = 50;
    const offsetX = Math.floor(gameState.current.distanceTraveled) % gridSize;
    
    for (let x = -offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Floor/Ceiling
    ctx.fillStyle = gameState.current.baseColor;
    ctx.fillRect(0, 0, canvas.width, 10);
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    // Neon glow line
    ctx.shadowBlur = 10;
    ctx.shadowColor = gameState.current.baseColor;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(canvas.width, 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, canvas.height - 10); ctx.lineTo(canvas.width, canvas.height - 10); ctx.stroke();
    ctx.shadowBlur = 0;

    // Obstacles
    ctx.fillStyle = gameState.current.baseColor; // Main fill
    gameState.current.obstacles.forEach(obs => {
        const x = obs.x - gameState.current.distanceTraveled;
        // Optimization: Only render visible
        if (x > -obs.width && x < canvas.width) {
            
            // Draw blocks
            ctx.fillStyle = gameState.current.baseColor;
            ctx.fillRect(x, 0, obs.width, obs.topHeight);
            ctx.fillRect(x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
            
            // Draw Spikes (Triangles)
            const spikeSize = 10;
            ctx.fillStyle = '#000000'; // Spike inner color
            
            // Top Spikes (Pointing Down)
            const numSpikes = Math.floor(obs.width / spikeSize);
            ctx.beginPath();
            for(let i=0; i<numSpikes; i++) {
                const sx = x + (i * spikeSize);
                const sy = obs.topHeight;
                ctx.moveTo(sx, sy - spikeSize); // base left
                ctx.lineTo(sx + spikeSize/2, sy); // tip
                ctx.lineTo(sx + spikeSize, sy - spikeSize); // base right
            }
            ctx.fill();

            // Bottom Spikes (Pointing Up)
            ctx.beginPath();
            for(let i=0; i<numSpikes; i++) {
                const sx = x + (i * spikeSize);
                const sy = obs.bottomY;
                ctx.moveTo(sx, sy + spikeSize); 
                ctx.lineTo(sx + spikeSize/2, sy); 
                ctx.lineTo(sx + spikeSize, sy + spikeSize);
            }
            ctx.fill();

            // Neon Borders (Outlines)
            ctx.shadowBlur = 15;
            ctx.shadowColor = gameState.current.baseColor;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            
            // Top Block Border
            ctx.beginPath();
            ctx.moveTo(x, 0); 
            ctx.lineTo(x, obs.topHeight); 
            ctx.lineTo(x + obs.width, obs.topHeight); 
            ctx.lineTo(x + obs.width, 0);
            ctx.stroke();

            // Bottom Block Border
            ctx.beginPath();
            ctx.moveTo(x, canvas.height); 
            ctx.lineTo(x, obs.bottomY); 
            ctx.lineTo(x + obs.width, obs.bottomY); 
            ctx.lineTo(x + obs.width, canvas.height);
            ctx.stroke();
            
            ctx.shadowBlur = 0;
        }
    });

    if (!isEndless) {
        const finishX = gameState.current.finishLineX - gameState.current.distanceTraveled;
        if (finishX < canvas.width) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(finishX, 0, 10, canvas.height);
            // Glow Wall
            ctx.shadowBlur = 50;
            ctx.shadowColor = '#fff';
            ctx.fillRect(finishX, 0, 10, canvas.height);
            ctx.shadowBlur = 0;
        }
    }

    // Trail
    if (gameState.current.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(gameState.current.trail[0].x, gameState.current.trail[0].y);
        for (let i = 1; i < gameState.current.trail.length; i++) {
            ctx.lineTo(gameState.current.trail[i].x, gameState.current.trail[i].y);
        }
        ctx.lineTo(gameState.current.playerX, gameState.current.playerY);
        ctx.strokeStyle = gameState.current.baseColor;
        ctx.lineWidth = isMini ? 2 : 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = gameState.current.baseColor;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // Player
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#fff';
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
    
    ctx.fillStyle = isMini ? '#d8b4fe' : '#93c5fd'; 
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/2);
    ctx.lineTo(size/2, 0);
    ctx.lineTo(-size/2, size/2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;

    // Render Shockwaves
    gameState.current.shockwaves.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.lineWidth = 5;
        ctx.stroke();
    });

    // Render Particles
    gameState.current.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    if (gameState.current.shakeIntensity > 0) {
        const dx = (Math.random() - 0.5) * gameState.current.shakeIntensity;
        const dy = (Math.random() - 0.5) * gameState.current.shakeIntensity;
        canvas.style.transform = `translate(${dx}px, ${dy}px)`;
        gameState.current.shakeIntensity *= 0.9;
        if (gameState.current.shakeIntensity < 0.5) {
            gameState.current.shakeIntensity = 0;
            canvas.style.transform = 'none';
        }
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [status, difficulty, isEndless, isMini, spawnObstacle, saveHighScore, playSound]);

  const handleDeath = () => {
      onStatusChange(GameStatus.Lost);
      gameState.current.shakeIntensity = 25;
      createExplosion(gameState.current.playerX, gameState.current.playerY, '#fff');
      playSound('crash');
      setConsistency(calculateConsistency());
      
      const currentTime = gameState.current.runTime / 1000;
      const didBreakRecord = saveHighScore(currentTime);
      if (didBreakRecord) {
          setIsNewBest(true);
          playSound('newBest');
      }
  };

  // --- INPUT HANDLING ---
  const handleStart = useCallback(() => {
     if (status === GameStatus.Lost || status === GameStatus.Won) {
         resetGame();
         onStatusChange(GameStatus.Playing);
         gameState.current.pulseIntensity = 2.0; 
         initAudio();
         gameState.current.isHolding = true; 
         playSound('click');
         return;
     }
     
     if (status === GameStatus.Idle) {
         onStatusChange(GameStatus.Playing);
         initAudio();
     }
     
     gameState.current.isHolding = true;
     gameState.current.pulseIntensity = 1.0; 
     
     const now = Date.now();
     if (gameState.current.lastClickTime > 0) {
         gameState.current.clickIntervals.push(now - gameState.current.lastClickTime);
         if (gameState.current.clickIntervals.length > 50) gameState.current.clickIntervals.shift();
     }
     gameState.current.lastClickTime = now;

     playSound('click');
  }, [status, resetGame, onStatusChange, initAudio, playSound]);

  const handleEnd = useCallback(() => {
     gameState.current.isHolding = false;
  }, []);

  // Sync Music with Game Status
  useEffect(() => {
      if (status === GameStatus.Playing) {
          startMusic();
      } else {
          stopMusic();
      }
      return () => stopMusic();
  }, [status, startMusic, stopMusic]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
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
      if (container) {
          container.addEventListener('mousedown', handleStart as any);
          container.addEventListener('mouseup', handleEnd);
          container.addEventListener('touchstart', (e) => { e.preventDefault(); handleStart(); }, { passive: false });
          container.addEventListener('touchend', (e) => { e.preventDefault(); handleEnd(); });
      }

      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
          if (container) {
              container.removeEventListener('mousedown', handleStart as any);
              container.removeEventListener('mouseup', handleEnd);
          }
      };
  }, [handleStart, handleEnd]);

  useEffect(() => {
      if (status === GameStatus.Playing) {
          if (!requestRef.current) requestRef.current = requestAnimationFrame(gameLoop);
      } else {
          requestRef.current = requestAnimationFrame(gameLoop);
      }
      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
  }, [gameLoop, status]);

  // Initial draw
  useEffect(() => {
      resetGame();
      requestAnimationFrame(gameLoop);
  }, [resetGame, gameLoop]);

  return (
    <div 
      className="relative w-full max-w-5xl aspect-video md:h-[500px] bg-slate-950 rounded-lg overflow-hidden transition-all duration-500 mx-auto select-none touch-none group" 
      ref={containerRef}
      style={{
        boxShadow: `0 0 30px ${difficulty.color}15, 0 0 0 1px ${difficulty.color}30`
      }}
    >
      <canvas 
          ref={canvasRef} 
          width={800} 
          height={450} 
          className="block w-full h-full cursor-pointer outline-none"
      />

      {/* --- HUD --- */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1">
              <div className="text-4xl font-display font-black text-white italic drop-shadow-lg tabular-nums">
                  {status === GameStatus.Playing 
                    ? ((Date.now() - gameState.current.startTime) / 1000).toFixed(2)
                    : (gameState.current.runTime / 1000).toFixed(2)
                  }s
              </div>
              {!isEndless ? (
                <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
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
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); localStorage.setItem('gd_spam_muted', String(!isMuted)); }} 
                  className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-colors"
              >
                  {isMuted ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
              </button>
          </div>
      </div>

      {/* --- START SCREEN --- */}
      {status === GameStatus.Idle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[2px] z-10 animate-in fade-in duration-300 pointer-events-none">
          <div className="text-center space-y-6 p-8 border border-white/10 bg-black/50 rounded-2xl shadow-2xl backdrop-blur-md max-w-md mx-4 pointer-events-auto">
              <h2 className="text-5xl font-display font-black text-white mb-2 tracking-tight" style={{ textShadow: `0 0 20px ${difficulty.color}` }}>
                {difficulty.label.toUpperCase()}
              </h2>
              <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: difficulty.color }}></div>
              <div className="flex justify-center gap-8 text-sm font-mono text-slate-400">
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
                onClick={() => { initAudio(); onStatusChange(GameStatus.Playing); }}
                className="group relative w-full py-4 bg-white text-black font-display font-black text-xl rounded hover:scale-[1.02] transition-transform overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                   START RUN
                </span>
              </button>
              
              <div className="text-xs text-slate-400 animate-pulse flex flex-col gap-1">
                 <span>Click or Press Space to Play</span>
                 {highScore > 0 && <span className="text-yellow-500 font-bold">Personal Best: {highScore.toFixed(2)}s</span>}
              </div>
          </div>
        </div>
      )}

      {/* --- GAME OVER SCREEN --- */}
      {status === GameStatus.Lost && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-sm z-20 animate-in zoom-in duration-100 pointer-events-none">
             <div className="pointer-events-auto flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                {isNewBest && (
                    <div className="mb-4 flex items-center gap-2 px-4 py-1 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-full animate-bounce shadow-lg shadow-yellow-500/50">
                        <Crown className="w-4 h-4" /> New Best Score!
                    </div>
                )}
                
                <AlertTriangle className="w-20 h-20 text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                <h2 className="text-6xl font-display font-black text-white mb-2 tracking-tighter">CRASHED</h2>
                <p className="text-red-200 font-mono text-lg mb-8">
                    Time: <span className="text-white font-bold">{(gameState.current.runTime / 1000).toFixed(2)}s</span>
                    <span className="mx-2">•</span>
                    Consistency: <span className="text-white font-bold">{consistency}</span>
                </p>
                
                <div className="text-white/80 animate-pulse font-display font-bold text-xl tracking-widest border border-white/20 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md">
                    PRESS SPACE TO RETRY
                </div>
                
                <div className="flex gap-4 mt-8 opacity-50 hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => { resetGame(); onStatusChange(GameStatus.Idle); }}
                        className="px-6 py-2 bg-black/50 text-white font-bold rounded border border-white/10 hover:bg-black/70 transition-colors text-sm"
                    >
                        RETURN TO MENU
                    </button>
                </div>
             </div>
         </div>
      )}

      {/* --- WIN SCREEN --- */}
      {status === GameStatus.Won && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/40 backdrop-blur-sm z-20 animate-in zoom-in duration-500 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
             {isNewBest && (
                <div className="mb-4 flex items-center gap-2 px-4 py-1 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-full animate-bounce shadow-lg shadow-yellow-500/50">
                    <Crown className="w-4 h-4" /> New Best Score!
                </div>
             )}
             
             <Trophy className="w-24 h-24 text-yellow-400 mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce" />
             <h2 className="text-6xl font-display font-black text-white mb-2 tracking-tighter">COMPLETE!</h2>
             <div className="flex items-center gap-2 mb-8">
                 <Zap className="w-5 h-5 text-yellow-400" />
                 <p className="text-green-100 font-mono text-lg">
                    Consistency Score: <span className="text-white font-bold text-xl">{consistency}</span>
                 </p>
             </div>
             
             <div className="text-white/80 animate-pulse font-display font-bold text-xl tracking-widest border border-white/20 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md mb-6">
                 CLICK TO PLAY AGAIN
             </div>

             <button 
                onClick={() => { resetGame(); onStatusChange(GameStatus.Idle); }}
                className="px-8 py-3 bg-white/10 text-white font-bold rounded hover:bg-white/20 transition-colors"
             >
                MENU
             </button>
         </div>
      )}
    </div>
  );
});

export default GameCanvas;
