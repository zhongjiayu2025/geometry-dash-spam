
"use client";

import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import { DifficultyConfig, GameStatus } from '../types';
import { WIN_TIME_MS, WAVE_SPEED_Y, GRAVITY } from '../constants';
import { Trophy, AlertTriangle, Crown, Volume2, VolumeX, Zap, Maximize, Minimize, Activity, ZapOff } from 'lucide-react';

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

// Improved Particle for Shatter Effect
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
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

// Level Generation Patterns
type PatternType = 'random' | 'corridor' | 'stairs_up' | 'stairs_down' | 'zigzag' | 'sawtooth';

const GameCanvas: React.FC<GameCanvasProps> = memo(({ difficulty, status, onStatusChange, isEndless = false, isMini = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  const [highScore, setHighScore] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  
  useEffect(() => {
    setIsMuted(localStorage.getItem('gd_spam_muted') === 'true');
    setReduceMotion(localStorage.getItem('gd_spam_reduce_motion') === 'true');
    loadHighScore();
  }, [difficulty.id, isEndless, isMini]);

  // Handle Fullscreen Change Events
  useEffect(() => {
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
  const delayNodeRef = useRef<DelayNode | null>(null); // For echo/space
  
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
    particles: [] as Particle[], // Shards
    shockwaves: [] as Shockwave[],
    stars: [] as Star[], 
    trail: [] as {x: number, y: number, w: number}[],
    startTime: 0,
    distanceTraveled: 0,
    lastObstacleX: 0,
    currentPattern: 'random' as PatternType,
    patternStep: 0,
    lastCenterY: 225, 
    bgOffset: 0,
    groundOffset: 0,
    shakeIntensity: 0,
    beatScale: 1.0, // For audio-visual sync
    lastBeatTime: 0, // Track when the kick hit
    frameCount: 0,
    clickIntervals: [] as number[],
    runTime: 0,
    finishLineX: 0,
    baseColor: difficulty.color,
    lastClickTime: 0,
  });

  const requestRef = useRef<number | undefined>(undefined);

  // --- AUDIO SYSTEM (ENHANCED) ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;
          
          // Master Gain
          masterGainRef.current = ctx.createGain();
          masterGainRef.current.gain.value = 0.8;

          // Delay/Echo Effect for "Space" feel
          const delay = ctx.createDelay(5.0);
          delay.delayTime.value = 0.3; // 300ms delay
          const feedback = ctx.createGain();
          feedback.gain.value = 0.4; // 40% feedback
          const delayFilter = ctx.createBiquadFilter();
          delayFilter.type = 'lowpass';
          delayFilter.frequency.value = 2000; // Dampen repeats

          // Connect Delay Graph
          masterGainRef.current.connect(ctx.destination); // Dry signal
          masterGainRef.current.connect(delay); // Send to delay
          delay.connect(delayFilter);
          delayFilter.connect(feedback);
          feedback.connect(delay); // Loop back
          delayFilter.connect(ctx.destination); // Wet signal output
          
          delayNodeRef.current = delay;
      }
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  // Trigger Beat Pulse Visuals
  const triggerBeat = useCallback(() => {
     // If Reduce Motion is on, do nothing
     if (localStorage.getItem('gd_spam_reduce_motion') === 'true') return;

     // Reduced default intensity from 1.05 to 1.015 to stop complaints about "always shaking"
     gameState.current.beatScale = 1.015; 
     gameState.current.lastBeatTime = Date.now();
  }, []);

  const playKick = useCallback((time: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.connect(gain);
    gain.connect(masterGainRef.current);
    
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    gain.gain.setValueAtTime(1.0, time); 
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    osc.start(time);
    osc.stop(time + 0.5);

    // Sync visual pulse
    // We use setTimeout to sync the visual JS state with the AudioContext time roughly
    const timeUntilKick = (time - audioCtxRef.current.currentTime) * 1000;
    setTimeout(() => {
        triggerBeat();
    }, Math.max(0, timeUntilKick));

  }, [triggerBeat]);

  const playBass = useCallback((time: number, note: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = 'sawtooth'; 
    osc.connect(gain);
    gain.connect(masterGainRef.current);
    
    // Frequencies matching the key
    const freq = 55 * Math.pow(2, note / 12); 
    osc.frequency.setValueAtTime(freq, time);
    osc.detune.setValueAtTime(Math.random() * 20 - 10, time); 
    
    // Moog-ish filter sweep
    const filter = audioCtxRef.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.exponentialRampToValueAtTime(2000, time + 0.1);
    filter.frequency.exponentialRampToValueAtTime(200, time + 0.3);
    
    osc.disconnect();
    osc.connect(filter);
    filter.connect(gain);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    
    osc.start(time);
    osc.stop(time + 0.4);
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
      filter.frequency.value = 8000; 

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current);

      gain.gain.setValueAtTime(0.05, time);
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
        
        // Kick on 1, 5, 9, 13 (Standard 4/4)
        if (sixteenth % 4 === 0) {
            playKick(nextNoteTimeRef.current);
        }
        
        // Off-beat Hats
        if (sixteenth % 2 === 0 && sixteenth % 4 !== 0) playHiHat(nextNoteTimeRef.current);
        
        // Bassline
        let note = 0; // Key E
        if (noteIndexRef.current % 64 >= 32) note = 3; // G
        if (noteIndexRef.current % 64 >= 48) note = 5; // A

        if (sixteenth % 4 !== 0) {
           playBass(nextNoteTimeRef.current, note);
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
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.connect(masterGainRef.current);
      osc.connect(gain);

      if (type === 'click') {
          osc.type = 'triangle'; 
          osc.frequency.setValueAtTime(isMini ? 800 : 600, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05); // Zip up sound
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
      } else if (type === 'crash') {
          // Noise burst
          const bufferSize = ctx.sampleRate * 0.5;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseGain = ctx.createGain();
          noise.connect(noiseGain);
          noiseGain.connect(masterGainRef.current);
          noiseGain.gain.setValueAtTime(0.5, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          noise.start(now);
      } else if (type === 'win') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.5);
          gain.gain.setValueAtTime(0.2, now);
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

  // --- GAMEPLAY & VISUALS ---

  const spawnObstacle = useCallback((canvasWidth: number, canvasHeight: number) => {
    const minGap = isMini ? difficulty.gap * 0.8 : difficulty.gap;
    
    // Pattern Selection Logic
    if (gameState.current.patternStep <= 0) {
        const patterns: PatternType[] = ['random', 'corridor', 'stairs_up', 'stairs_down', 'zigzag', 'sawtooth'];
        // Bias towards patterns in higher difficulty
        let nextPattern: PatternType = 'random';
        if (Math.random() > 0.4) {
             nextPattern = patterns[Math.floor(Math.random() * patterns.length)];
        }
        gameState.current.currentPattern = nextPattern;
        gameState.current.patternStep = Math.floor(Math.random() * 5) + 3; 
    }

    let center = gameState.current.lastCenterY;
    const padding = minGap + 50;

    switch (gameState.current.currentPattern) {
        case 'corridor':
            center += (Math.random() * 20 - 10); 
            break;
        case 'stairs_up':
            center -= (minGap * 0.6); 
            break;
        case 'stairs_down':
            center += (minGap * 0.6); 
            break;
        case 'zigzag':
            const direction = gameState.current.patternStep % 2 === 0 ? 1 : -1;
            center += (minGap * 1.5 * direction);
            break;
        case 'sawtooth':
            // The "Tight Spam" pattern
            center += (Math.random() * 40 - 20);
            break;
        case 'random':
        default:
            center = Math.random() * (canvasHeight - minGap - 100) + 50 + minGap / 2;
            break;
    }

    center = Math.max(padding, Math.min(canvasHeight - padding, center));
    gameState.current.lastCenterY = center;
    gameState.current.patternStep--;

    let topHeight = center - minGap / 2;
    let bottomY = center + minGap / 2;
    const width = 60; 
    
    if (gameState.current.currentPattern === 'sawtooth') {
        if (gameState.current.patternStep % 2 === 0) {
            topHeight += 20; 
            bottomY -= 20;
        }
    }

    gameState.current.obstacles.push({
      x: gameState.current.lastObstacleX + width,
      width: width,
      topHeight: topHeight,
      bottomY: bottomY,
      passed: false,
      type: 'normal'
    });

    gameState.current.lastObstacleX = gameState.current.obstacles[gameState.current.obstacles.length - 1].x;
  }, [difficulty, isMini]);

  const createExplosion = (x: number, y: number, color: string) => {
    // If Reduce Motion is enabled, reduce particle count
    if (reduceMotion) return;

    // Create Shards (Triangles)
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 5;
      gameState.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        color: color,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.5
      });
    }
    gameState.current.shockwaves.push({ x, y, radius: 10, opacity: 1.0 });
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

  const initStars = (width: number, height: number) => {
      gameState.current.stars = [];
      for(let i=0; i<40; i++) {
          gameState.current.stars.push({
              x: Math.random() * width,
              y: Math.random() * height,
              size: Math.random() * 2 + 0.5,
              speed: Math.random() * 2 + 0.2, 
              opacity: Math.random() * 0.5 + 0.1
          });
      }
  };

  const resetGame = useCallback(() => {
    if (!canvasRef.current) return;
    const width = canvasRef.current.width;
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
      beatScale: 1.0,
      lastBeatTime: 0,
      frameCount: 0,
      clickIntervals: [],
      runTime: 0,
      finishLineX: totalDistance + 600,
      baseColor: difficulty.color
    };
    initStars(width, height);
    setConsistency('100%');
    setIsNewBest(false);
  }, [difficulty.color, difficulty.speed]);

  // --- GAME LOOP ---
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Decay Beat Scale
    gameState.current.beatScale = 1.0 + (gameState.current.beatScale - 1.0) * 0.9;

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
        
        // Parallax Stars
        gameState.current.stars.forEach(star => {
            star.x -= star.speed * (moveSpeed / 3);
            if (star.x < 0) star.x = canvas.width;
        });

        // Generation
        const spawnThreshold = isEndless ? Infinity : gameState.current.finishLineX - 400;
        const lastOb = gameState.current.obstacles.length > 0 ? gameState.current.obstacles[gameState.current.obstacles.length - 1] : null;
        if (!lastOb || (lastOb.x < gameState.current.distanceTraveled + canvas.width + 100 && gameState.current.lastObstacleX < spawnThreshold)) {
            spawnObstacle(canvas.width, canvas.height);
        }

        // Collision
        const playerRadius = isMini ? 4 : 8;
        const hitboxSize = playerRadius * 0.5; // Very forgiving hitbox for "Pro" feel
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
             if (finishScreenX <= gameState.current.playerX) {
                 onStatusChange(GameStatus.Won);
                 playSound('win');
                 const didBreakRecord = saveHighScore(gameState.current.runTime / 1000);
                 if(didBreakRecord) setIsNewBest(true);
             }
        }

        // Ribbon Trail
        if (gameState.current.frameCount % 2 === 0) { // Optimize trail frequency
             const w = isMini ? 4 : 8;
            gameState.current.trail.push({ x: gameState.current.playerX, y: gameState.current.playerY, w });
            if (gameState.current.trail.length > 30) gameState.current.trail.shift();
        }
        for (let i = 0; i < gameState.current.trail.length; i++) {
             gameState.current.trail[i].x -= moveSpeed;
             gameState.current.trail[i].w *= 0.94; // Taper width faster
        }

        // Particle Physics (Gravity included)
        gameState.current.particles = gameState.current.particles.filter(p => p.life > 0);
        gameState.current.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.5; // Gravity for shards
            p.rotation += p.rotationSpeed;
            p.life -= 0.02;
            p.size *= 0.98;
        });

        gameState.current.shockwaves = gameState.current.shockwaves.filter(s => s.opacity > 0);
        gameState.current.shockwaves.forEach(s => {
            s.radius += 8;
            s.opacity -= 0.05;
        });

        gameState.current.frameCount++;
    }

    // 2. Rendering
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Shake + Beat Zoom (Only if motion is not reduced)
    ctx.save();
    
    if (!reduceMotion) {
        // Beat Zoom (Center of Screen)
        const scale = gameState.current.beatScale;
        if (scale > 1.001) {
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.scale(scale, scale);
            ctx.translate(-canvas.width/2, -canvas.height/2);
        }

        if (gameState.current.shakeIntensity > 0) {
            const dx = (Math.random() - 0.5) * gameState.current.shakeIntensity;
            const dy = (Math.random() - 0.5) * gameState.current.shakeIntensity;
            ctx.translate(dx, dy);
            gameState.current.shakeIntensity *= 0.9;
        }
    }

    // Background
    ctx.fillStyle = '#020617'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    gameState.current.stars.forEach(star => {
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Floor/Ceiling
    ctx.fillStyle = gameState.current.baseColor;
    ctx.fillRect(0, 0, canvas.width, 10);
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    ctx.shadowBlur = 15;
    ctx.shadowColor = gameState.current.baseColor;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(canvas.width, 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, canvas.height - 10); ctx.lineTo(canvas.width, canvas.height - 10); ctx.stroke();
    ctx.shadowBlur = 0;

    // Obstacles with Gradient
    gameState.current.obstacles.forEach(obs => {
        const x = obs.x - gameState.current.distanceTraveled;
        if (x > -obs.width && x < canvas.width) {
            
            // Gradient creation for "glass/neon" look
            const gradTop = ctx.createLinearGradient(x, 0, x, obs.topHeight);
            gradTop.addColorStop(0, gameState.current.baseColor);
            gradTop.addColorStop(1, `${gameState.current.baseColor}44`); // fade out

            const gradBottom = ctx.createLinearGradient(x, obs.bottomY, x, canvas.height);
            gradBottom.addColorStop(0, `${gameState.current.baseColor}44`);
            gradBottom.addColorStop(1, gameState.current.baseColor);

            ctx.fillStyle = gradTop;
            ctx.fillRect(x, 0, obs.width, obs.topHeight);
            
            ctx.fillStyle = gradBottom;
            ctx.fillRect(x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
            
            // Neon Outlines (Glowy)
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            
            // Top Block Border
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, obs.topHeight); ctx.lineTo(x + obs.width, obs.topHeight); ctx.lineTo(x + obs.width, 0);
            ctx.stroke();

            // Bottom Block Border
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

    // Ribbon Trail
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
        
        // Inner white line
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

    // Player
    if (status !== GameStatus.Lost) {
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

    // Render Shattered Particles
    gameState.current.particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        
        // Draw Triangle Shard
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

    // Shockwaves
    gameState.current.shockwaves.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.lineWidth = 4;
        ctx.stroke();
    });

    ctx.restore(); // Restore shake/zoom state

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [status, difficulty, isEndless, isMini, spawnObstacle, saveHighScore, playSound, reduceMotion]);

  const handleDeath = () => {
      onStatusChange(GameStatus.Lost);
      // Reduce default shake on death if reduceMotion is on
      gameState.current.shakeIntensity = reduceMotion ? 0 : 40; 
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
      className={`relative w-full transition-all duration-500 mx-auto select-none touch-none group bg-slate-950 rounded-lg overflow-hidden
        ${isFullscreen ? 'fixed inset-0 z-50 h-screen max-w-none rounded-none' : 'max-w-5xl aspect-video md:h-[500px]'}
      `}
      ref={containerRef}
      style={{
        boxShadow: isFullscreen ? 'none' : `0 0 30px ${difficulty.color}15, 0 0 0 1px ${difficulty.color}30`
      }}
    >
      <canvas 
          ref={canvasRef} 
          width={800} 
          height={450} 
          className="block w-full h-full cursor-pointer outline-none object-contain bg-[#020617]"
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
                  title={reduceMotion ? "Enable Motion/Pulse" : "Reduce Motion/Shake"}
                  onClick={toggleMotion} 
                  className={`p-2 rounded-full backdrop-blur-md transition-colors border border-transparent ${reduceMotion ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'}`}
              >
                  {reduceMotion ? <ZapOff className="w-5 h-5"/> : <Activity className="w-5 h-5"/>}
              </button>
              <button 
                  title="Toggle Fullscreen"
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} 
                  className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-colors"
              >
                  {isFullscreen ? <Minimize className="w-5 h-5"/> : <Maximize className="w-5 h-5"/>}
              </button>
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
