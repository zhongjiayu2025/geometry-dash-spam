
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

const GameCanvas: React.FC<GameCanvasProps> = memo(({ difficulty, status, onStatusChange, isEndless = false, isMini = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  
  // Ensure we only access localStorage on the client
  useEffect(() => {
    setIsMuted(localStorage.getItem('gd_spam_muted') === 'true');
    loadHighScore();
  }, [difficulty.id, isEndless, isMini]); // Reload high score when mode changes

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

  // Game State Ref
  const gameState = useRef({
    playerY: 250,
    playerX: 100,
    velocityY: 0,
    isHolding: false,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    trail: [] as {x: number, y: number}[],
    startTime: 0,
    distanceTraveled: 0,
    lastObstacleX: 0,
    bgOffset: 0,
    groundOffset: 0,
    shakeIntensity: 0,
    pulseIntensity: 0, // NEW: For background pulse effect
    frameCount: 0,
    baseColor: difficulty.color,
    lastClickTime: 0,
    clickIntervals: [] as number[],
    runTime: 0,
    finishLineX: 0, // Calculated based on speed and time
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

  const playSound = useCallback((type: 'crash' | 'win' | 'click' | 'newBest') => {
      if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.connect(masterGainRef.current);
      osc.connect(gain);

      const now = ctx.currentTime;
      
      if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isMini ? 800 : 600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
      } else if (type === 'crash') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100, now);
          osc.frequency.linearRampToValueAtTime(50, now + 0.3);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
      } else if (type === 'win') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now); // A4
          osc.frequency.setValueAtTime(554, now + 0.1); // C#5
          osc.frequency.setValueAtTime(659, now + 0.2); // E5
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
      } else if (type === 'newBest') {
          // High pitch happy sound
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now); 
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
      }
  }, [isMuted, isMini]);

  // --- GAME LOGIC HELPERS ---

  const spawnObstacle = useCallback((canvasWidth: number, canvasHeight: number) => {
    const minGap = isMini ? difficulty.gap * 0.8 : difficulty.gap;
    const center = Math.random() * (canvasHeight - minGap - 100) + 50 + minGap / 2;
    const topHeight = center - minGap / 2;
    const bottomY = center + minGap / 2;
    
    const width = Math.random() * 50 + 80;

    gameState.current.obstacles.push({
      x: gameState.current.lastObstacleX + 300 + Math.random() * 100,
      width: width,
      topHeight: topHeight,
      bottomY: bottomY,
      passed: false
    });

    gameState.current.lastObstacleX = gameState.current.obstacles[gameState.current.obstacles.length - 1].x + width;
  }, [difficulty, isMini]);

  const createExplosion = (x: number, y: number, color: string) => {
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
    
    // Calculate total distance needed for timed mode
    // distance = speed (px/frame) * FPS * seconds
    const totalDistance = difficulty.speed * 60 * (WIN_TIME_MS / 1000);

    gameState.current = {
      ...gameState.current,
      playerY: height / 2,
      velocityY: 0,
      isHolding: false,
      obstacles: [],
      particles: [],
      trail: [],
      startTime: 0,
      distanceTraveled: 0,
      lastObstacleX: 600, // Give more breathing room at start
      bgOffset: 0,
      groundOffset: 0,
      shakeIntensity: 0,
      pulseIntensity: 0,
      frameCount: 0,
      clickIntervals: [],
      runTime: 0,
      finishLineX: totalDistance + 600, // + offset
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

        // Reduce pulse intensity
        gameState.current.pulseIntensity *= 0.9;

        // Spawn logic...
        if (isEndless) {
             // Infinite generation
             if (gameState.current.obstacles.length === 0 || 
                gameState.current.obstacles[gameState.current.obstacles.length - 1].x < gameState.current.distanceTraveled + canvas.width + 200) {
                spawnObstacle(canvas.width, canvas.height);
            }
        } else {
             // Timed mode: Stop spawning obstacles before the finish line
             if (gameState.current.lastObstacleX < gameState.current.finishLineX - 400) {
                 if (gameState.current.obstacles.length === 0 || 
                    gameState.current.obstacles[gameState.current.obstacles.length - 1].x < gameState.current.distanceTraveled + canvas.width + 200) {
                    spawnObstacle(canvas.width, canvas.height);
                }
             }
        }

        const playerRadius = isMini ? 4 : 8;
        const playerHitbox = {
             x: gameState.current.playerX - playerRadius,
             y: gameState.current.playerY - playerRadius,
             w: playerRadius * 2,
             h: playerRadius * 2
        };

        if (gameState.current.playerY < 0 || gameState.current.playerY > canvas.height) {
            handleDeath();
            return;
        }

        gameState.current.obstacles.forEach(obs => {
             const obsScreenX = obs.x - gameState.current.distanceTraveled;
             if (obsScreenX < canvas.width && obsScreenX + obs.width > 0) {
                 if (playerHitbox.x < obsScreenX + obs.width &&
                     playerHitbox.x + playerHitbox.w > obsScreenX &&
                     playerHitbox.y < obs.topHeight) {
                      handleDeath();
                 }
                 if (playerHitbox.x < obsScreenX + obs.width &&
                     playerHitbox.x + playerHitbox.w > obsScreenX &&
                     playerHitbox.y + playerHitbox.h > obs.bottomY) {
                      handleDeath();
                 }
             }
        });

        // Win Condition: Cross finish line or Time (fallback)
        if (!isEndless) {
             const finishScreenX = gameState.current.finishLineX - gameState.current.distanceTraveled;
             if (finishScreenX <= gameState.current.playerX) {
                 onStatusChange(GameStatus.Won);
                 playSound('win');
                 const didBreakRecord = saveHighScore(gameState.current.runTime / 1000);
                 if(didBreakRecord) setIsNewBest(true);
             }
        }

        // Trail
        if (gameState.current.frameCount % 2 === 0) {
            gameState.current.trail.push({ x: gameState.current.playerX, y: gameState.current.playerY });
            if (gameState.current.trail.length > 20) gameState.current.trail.shift();
        }
        for (let i = 0; i < gameState.current.trail.length; i++) {
             gameState.current.trail[i].x -= moveSpeed;
        }

        // Particles
        gameState.current.particles = gameState.current.particles.filter(p => p.life > 0);
        gameState.current.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            p.size *= 0.95;
        });

        gameState.current.frameCount++;
    }

    // 2. Rendering
    ctx.fillStyle = '#020617'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic Background Pulse (Changes background lightness slightly)
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

    // Borders
    ctx.fillStyle = gameState.current.baseColor;
    ctx.fillRect(0, 0, canvas.width, 10);
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    ctx.shadowBlur = 20 + (gameState.current.pulseIntensity * 20);
    ctx.shadowColor = gameState.current.baseColor;

    // Obstacles
    ctx.fillStyle = gameState.current.baseColor;
    gameState.current.obstacles.forEach(obs => {
        const x = obs.x - gameState.current.distanceTraveled;
        if (x > -obs.width && x < canvas.width) {
            ctx.fillRect(x, 0, obs.width, obs.topHeight);
            ctx.fillRect(x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
            // Outline
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

    // Finish Line (Visual Wall)
    if (!isEndless) {
        const finishX = gameState.current.finishLineX - gameState.current.distanceTraveled;
        if (finishX < canvas.width) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(finishX, 0, 20, canvas.height);
            // Checkered pattern or glow
            ctx.shadowBlur = 50;
            ctx.shadowColor = '#fff';
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
        ctx.stroke();
    }

    // Player
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#fff';
    
    ctx.save();
    ctx.translate(gameState.current.playerX, gameState.current.playerY);
    const rotation = gameState.current.velocityY > 0 ? 45 : -45;
    ctx.rotate(rotation * Math.PI / 180);
    
    const size = isMini ? 6 : 12;
    ctx.beginPath();
    ctx.moveTo(-size, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(-size, size);
    ctx.closePath();
    ctx.fill();
    
    // Inner color
    ctx.fillStyle = isMini ? '#d8b4fe' : '#93c5fd'; 
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/2);
    ctx.lineTo(size/2, 0);
    ctx.lineTo(-size/2, size/2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Particles
    gameState.current.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    // Shake
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
  }, [status, difficulty, isEndless, isMini, spawnObstacle, saveHighScore]);

  const handleDeath = () => {
      onStatusChange(GameStatus.Lost);
      gameState.current.shakeIntensity = 20;
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
     // INSTANT RESTART LOGIC
     if (status === GameStatus.Lost || status === GameStatus.Won) {
         resetGame();
         onStatusChange(GameStatus.Playing);
         // Pulse on restart
         gameState.current.pulseIntensity = 2.0; 
         initAudio();
         // Pre-load a click so they move up immediately
         gameState.current.isHolding = true; 
         playSound('click');
         return;
     }
     
     if (status === GameStatus.Idle) {
         onStatusChange(GameStatus.Playing);
         initAudio();
     }
     
     gameState.current.isHolding = true;
     // Add visual pulse on click
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
