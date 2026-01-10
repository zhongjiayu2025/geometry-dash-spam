import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import { DifficultyConfig, GameStatus } from '../types';
import { WIN_TIME_MS, WAVE_SPEED_Y } from '../constants';
import { Trophy, AlertTriangle, Crown, Volume2, VolumeX, Settings, X, Music2 } from 'lucide-react';

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

interface ClickEffect {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

// Helper to convert HSL to Hex
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const GameCanvas: React.FC<GameCanvasProps> = memo(({ difficulty, status, onStatusChange, isEndless = false, isMini = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings State
  const [isMuted, setIsMuted] = useState<boolean>(() => localStorage.getItem('gd_spam_muted') === 'true');
  const [showSettings, setShowSettings] = useState(false);
  const [consistency, setConsistency] = useState<string>('100%');
  
  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Game State Ref (Mutable to avoid re-renders during loop)
  const gameState = useRef({
    playerY: 250,
    playerX: 100, // Fixed horizontal position
    velocityY: 0,
    isHolding: false,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    clickEffects: [] as ClickEffect[],
    trail: [] as {x: number, y: number}[],
    startTime: 0,
    distanceTraveled: 0, // In pixels
    lastObstacleX: 0,
    bgOffset: 0,
    groundOffset: 0,
    shakeIntensity: 0,
    deathCoords: { x: 0, y: 0 },
    frameCount: 0,
    baseColor: difficulty.color,
    currentHue: 0,
    lastClickTime: 0,
    clickIntervals: [] as number[],
    runTime: 0,
  });

  const requestRef = useRef<number>();

  // --- AUDIO SYSTEM ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
          const ctx = new AudioContext({ latencyHint: 'interactive' });
          audioCtxRef.current = ctx;
          masterGainRef.current = ctx.createGain();
          masterGainRef.current.connect(ctx.destination);
      }
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playSound = useCallback((type: 'crash' | 'win' | 'click') => {
      if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.connect(masterGainRef.current);
      osc.connect(gain);

      const now = ctx.currentTime;
      
      if (type === 'click') {
          // Soft click sound
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isMini ? 800 : 600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
      } else if (type === 'crash') {
          // Noise-like crash
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100, now);
          osc.frequency.linearRampToValueAtTime(50, now + 0.3);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
      } else if (type === 'win') {
          // Victory chime
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554, now + 0.1); // C#
          osc.frequency.setValueAtTime(659, now + 0.2); // E
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
      }
  }, [isMuted, isMini]);

  // --- GAME LOGIC HELPERS ---

  const spawnObstacle = useCallback((canvasWidth: number, canvasHeight: number) => {
    const minGap = isMini ? difficulty.gap * 0.8 : difficulty.gap;
    // Ensure obstacles are reachable
    const center = Math.random() * (canvasHeight - minGap - 100) + 50 + minGap / 2;
    const topHeight = center - minGap / 2;
    const bottomY = center + minGap / 2;
    
    // Width varies slightly
    const width = Math.random() * 50 + 80;

    gameState.current.obstacles.push({
      x: gameState.current.lastObstacleX + 300 + Math.random() * 100, // Distance between obstacles
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
    
    // Calculate variance of time between clicks
    let mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    let variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
    let stdDev = Math.sqrt(variance);
    
    // Normalize to a 0-100% score (lower stdDev is better)
    // Arbitrary scaling: 0ms dev = 100%, 100ms dev = 0%
    let score = Math.max(0, 100 - (stdDev * 2)); 
    return score.toFixed(1) + '%';
  };

  const resetGame = useCallback(() => {
    if (!canvasRef.current) return;
    const height = canvasRef.current.height;
    
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
      lastObstacleX: 400, // Start spawning a bit away
      bgOffset: 0,
      groundOffset: 0,
      shakeIntensity: 0,
      frameCount: 0,
      clickIntervals: [],
      runTime: 0,
      baseColor: difficulty.color
    };
    setConsistency('100%');
  }, [difficulty.color]);

  // --- MAIN GAME LOOP ---
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Update Physics (if playing)
    if (status === GameStatus.Playing) {
        if (gameState.current.startTime === 0) gameState.current.startTime = Date.now();
        gameState.current.runTime = Date.now() - gameState.current.startTime;

        // Wave Physics
        // Wave moves diagonally. Constant X speed (world moves left), Constant Y speed (player moves up/down)
        const speedY = isMini ? WAVE_SPEED_Y * 1.5 : WAVE_SPEED_Y;
        gameState.current.velocityY = gameState.current.isHolding ? -speedY : speedY;
        gameState.current.playerY += gameState.current.velocityY;

        // Move World (Obstacles & BG)
        const moveSpeed = difficulty.speed;
        gameState.current.distanceTraveled += moveSpeed;
        gameState.current.bgOffset = (gameState.current.bgOffset + moveSpeed * 0.2) % canvas.width;
        gameState.current.groundOffset = (gameState.current.groundOffset + moveSpeed) % 50; // Grid size

        // Spawn Obstacles
        if (gameState.current.obstacles.length === 0 || 
            gameState.current.obstacles[gameState.current.obstacles.length - 1].x < gameState.current.distanceTraveled + canvas.width + 200) {
            spawnObstacle(canvas.width, canvas.height);
        }

        // Update Obstacles & Collision
        const playerRadius = isMini ? 4 : 8; // Hitbox size
        // Simple AABB collision for wave tip (triangle approximation)
        const playerHitbox = {
             x: gameState.current.playerX - playerRadius,
             y: gameState.current.playerY - playerRadius,
             w: playerRadius * 2,
             h: playerRadius * 2
        };

        // Floor/Ceiling Collision
        if (gameState.current.playerY < 0 || gameState.current.playerY > canvas.height) {
            handleDeath();
            return; // Stop frame
        }

        gameState.current.obstacles.forEach(obs => {
             const obsScreenX = obs.x - gameState.current.distanceTraveled;
             
             // Check if active
             if (obsScreenX < canvas.width && obsScreenX + obs.width > 0) {
                 // Top Rect Collision
                 if (playerHitbox.x < obsScreenX + obs.width &&
                     playerHitbox.x + playerHitbox.w > obsScreenX &&
                     playerHitbox.y < obs.topHeight) {
                      handleDeath();
                 }
                 // Bottom Rect Collision
                 if (playerHitbox.x < obsScreenX + obs.width &&
                     playerHitbox.x + playerHitbox.w > obsScreenX &&
                     playerHitbox.y + playerHitbox.h > obs.bottomY) {
                      handleDeath();
                 }
             }
        });

        // Win Condition
        if (!isEndless && gameState.current.runTime >= WIN_TIME_MS) {
             onStatusChange(GameStatus.Won);
             playSound('win');
        }

        // Trail Logic
        if (gameState.current.frameCount % 2 === 0) {
            gameState.current.trail.push({ x: gameState.current.playerX, y: gameState.current.playerY });
            if (gameState.current.trail.length > 20) gameState.current.trail.shift();
        }
        // Move trail points left relative to player
        // Actually, easiest is to store trail absolute and subtract distance when drawing
        // But for infinite runner, better to store relative or manage array carefully.
        // Let's store absolute world coordinates for trail:
        // Wait, playerX is fixed on screen. 
        // To make trail look like it's behind, we just store previous PlayerY and shift X by speed.
        for (let i = 0; i < gameState.current.trail.length; i++) {
             gameState.current.trail[i].x -= moveSpeed;
        }

        // Update Particles
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
    // Clear
    ctx.fillStyle = '#020617'; // Slate 950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    const offsetX = Math.floor(gameState.current.distanceTraveled) % gridSize;
    
    // Vertical lines
    for (let x = -offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    // Horizontal lines
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw Floor and Ceiling Lines
    ctx.fillStyle = gameState.current.baseColor;
    ctx.fillRect(0, 0, canvas.width, 10); // Ceiling
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10); // Floor
    
    // Glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = gameState.current.baseColor;

    // Draw Obstacles
    ctx.fillStyle = gameState.current.baseColor; // Obstacle color same as theme
    gameState.current.obstacles.forEach(obs => {
        const x = obs.x - gameState.current.distanceTraveled;
        if (x > -obs.width && x < canvas.width) {
            // Top
            ctx.fillRect(x, 0, obs.width, obs.topHeight);
            // Bottom
            ctx.fillRect(x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
            
            // Neon Outline for obstacles
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            
            // Top outline
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, obs.topHeight); ctx.lineTo(x + obs.width, obs.topHeight); ctx.lineTo(x + obs.width, 0);
            ctx.stroke();

            // Bottom outline
            ctx.beginPath();
            ctx.moveTo(x, canvas.height); ctx.lineTo(x, obs.bottomY); ctx.lineTo(x + obs.width, obs.bottomY); ctx.lineTo(x + obs.width, canvas.height);
            ctx.stroke();
        }
    });

    // Draw Trail
    if (gameState.current.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(gameState.current.trail[0].x, gameState.current.trail[0].y);
        for (let i = 1; i < gameState.current.trail.length; i++) {
            ctx.lineTo(gameState.current.trail[i].x, gameState.current.trail[i].y);
        }
        ctx.lineTo(gameState.current.playerX, gameState.current.playerY);
        ctx.strokeStyle = gameState.current.baseColor;
        ctx.lineWidth = isMini ? 2 : 4;
        ctx.stroke();
    }

    // Draw Player (Wave Arrow)
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#fff'; // Player is always white
    
    ctx.save();
    ctx.translate(gameState.current.playerX, gameState.current.playerY);
    // Rotate slightly based on velocity
    const rotation = gameState.current.velocityY > 0 ? 45 : -45; // Fixed 45deg for wave
    ctx.rotate(rotation * Math.PI / 180);
    
    const size = isMini ? 6 : 12;
    ctx.beginPath();
    ctx.moveTo(-size, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(-size, size);
    ctx.closePath();
    ctx.fill();
    
    // Inner color
    ctx.fillStyle = isMini ? '#d8b4fe' : '#93c5fd'; // Small tint
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/2);
    ctx.lineTo(size/2, 0);
    ctx.lineTo(-size/2, size/2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Draw Particles (Death or Trail)
    gameState.current.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    // Shake Effect (on death)
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
  }, [status, difficulty, isEndless, isMini, spawnObstacle]);

  const handleDeath = () => {
      onStatusChange(GameStatus.Lost);
      gameState.current.shakeIntensity = 20;
      createExplosion(gameState.current.playerX, gameState.current.playerY, '#fff');
      playSound('crash');
      setConsistency(calculateConsistency());
  };

  // --- INPUT HANDLING ---
  const handleStart = useCallback(() => {
     if (status === GameStatus.Lost || status === GameStatus.Won) {
         resetGame();
         onStatusChange(GameStatus.Playing);
         initAudio();
         return;
     }
     if (status === GameStatus.Idle) {
         onStatusChange(GameStatus.Playing);
         initAudio();
     }
     gameState.current.isHolding = true;
     
     // Record click interval for consistency calculation
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
      // Mouse/Touch listeners attached to canvas div
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
              // Clean up touch
          }
      };
  }, [handleStart, handleEnd]);

  // Start/Stop Loop
  useEffect(() => {
      if (status === GameStatus.Playing) {
          if (!requestRef.current) requestRef.current = requestAnimationFrame(gameLoop);
      } else {
          // If we want the particles/shake to animate even after death, we could keep loop running
          // But for now let's keep it running to render death screen background
          requestRef.current = requestAnimationFrame(gameLoop);
      }
      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
  }, [gameLoop, status]);

  // Initial draw to prevent blank screen
  useEffect(() => {
      resetGame();
      // Force one frame
      requestAnimationFrame(gameLoop);
  }, [resetGame, gameLoop]);

  // --- RENDER UI OVERLAY ---
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
          {/* Progress / Time */}
          <div className="flex flex-col gap-1">
              <div className="text-4xl font-display font-black text-white italic drop-shadow-lg tabular-nums">
                  {status === GameStatus.Playing 
                    ? ((Date.now() - gameState.current.startTime) / 1000).toFixed(2)
                    : (gameState.current.runTime / 1000).toFixed(2)
                  }s
              </div>
              {!isEndless && (
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                   <div 
                      className="h-full bg-white shadow-[0_0_10px_white]"
                      style={{ width: `${Math.min(100, (gameState.current.runTime / WIN_TIME_MS) * 100)}%` }}
                   ></div>
                </div>
              )}
          </div>
          
          {/* Controls / Info */}
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
              
              <p className="text-xs text-slate-400 animate-pulse">Click or Press Space to Play</p>
          </div>
        </div>
      )}

      {/* --- GAME OVER SCREEN --- */}
      {status === GameStatus.Lost && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-sm z-20 animate-in zoom-in duration-200 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
             <AlertTriangle className="w-20 h-20 text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
             <h2 className="text-6xl font-display font-black text-white mb-2 tracking-tighter">CRASHED</h2>
             <p className="text-red-200 font-mono text-lg mb-8">
                 Time: <span className="text-white font-bold">{(gameState.current.runTime / 1000).toFixed(2)}s</span>
                 <span className="mx-2">•</span>
                 Consistency: <span className="text-white font-bold">{consistency}</span>
             </p>
             <div className="flex gap-4">
                 <button 
                    onClick={() => { resetGame(); onStatusChange(GameStatus.Playing); }}
                    className="px-8 py-3 bg-white text-red-900 font-black font-display text-lg rounded hover:bg-slate-200 transition-colors shadow-xl"
                 >
                    RETRY
                 </button>
                 <button 
                    onClick={() => { resetGame(); onStatusChange(GameStatus.Idle); }}
                    className="px-8 py-3 bg-black/50 text-white font-bold rounded border border-white/10 hover:bg-black/70 transition-colors"
                 >
                    MENU
                 </button>
             </div>
         </div>
      )}

      {/* --- WIN SCREEN --- */}
      {status === GameStatus.Won && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/40 backdrop-blur-sm z-20 animate-in zoom-in duration-500 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
             <Trophy className="w-24 h-24 text-yellow-400 mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce" />
             <h2 className="text-6xl font-display font-black text-white mb-2 tracking-tighter">LEVEL COMPLETE!</h2>
             <div className="flex items-center gap-2 mb-8">
                 <Crown className="w-5 h-5 text-yellow-400" />
                 <p className="text-green-100 font-mono text-lg">
                    Consistency Score: <span className="text-white font-bold text-xl">{consistency}</span>
                 </p>
             </div>
             
             <button 
                onClick={() => { resetGame(); onStatusChange(GameStatus.Idle); }}
                className="px-10 py-4 bg-yellow-500 text-black font-black font-display text-xl rounded shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform"
             >
                CONTINUE
             </button>
         </div>
      )}
    </div>
  );
});

export default GameCanvas;