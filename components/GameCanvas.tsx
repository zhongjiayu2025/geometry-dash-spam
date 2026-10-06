
"use client";

import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import dynamic from 'next/dynamic';
import { DifficultyConfig, GameStatus } from '../types';
import { WIN_TIME_MS } from '../constants';
import { Crown, Volume2, VolumeX, Maximize, Minimize, Activity, ZapOff } from 'lucide-react';
import type { WaveAudioEngine, WaveSound } from '../lib/waveAudio';
import type { WaveRuntimeState } from '../lib/waveRuntime';
import type { WaveRun } from '../lib/waveStorage';

type WaveRenderer = typeof import('../lib/waveRenderer').renderWaveFrame;
type WaveRuntime = typeof import('../lib/waveRuntime');

const WaveRunOverlays = dynamic(() => import('./WaveRunOverlays'), { ssr: false });

interface GameCanvasProps {
  difficulty: DifficultyConfig;
  status: GameStatus;
  onStatusChange: (status: GameStatus) => void;
  isEndless?: boolean;
  isMini?: boolean;
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
  const [recentRuns, setRecentRuns] = useState<WaveRun[]>([]);
  const lastHudUpdateRef = useRef<number>(0);
  const timeDisplayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const runRecordedRef = useRef(false);
  const shareOpenRef = useRef(false);
  const highScoreRef = useRef(0);
  
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
  }, []);

  useEffect(() => {
    highScoreRef.current = 0;
    setHighScore(0);
    setRecentRuns([]);
    setIsNewBest(false);

    let cancelled = false;
    void import('../lib/waveStorage').then(({ loadWaveRecords }) => {
      if (cancelled) return;
      const records = loadWaveRecords({
        difficultyId: difficulty.id,
        isEndless,
        isMini,
      });
      highScoreRef.current = records.highScore;
      setHighScore(records.highScore);
      setRecentRuns(records.recentRuns);
      setIsNewBest(false);
    });

    return () => {
      cancelled = true;
    };
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

  const saveHighScore = useCallback((time: number) => {
      if (time <= highScoreRef.current) return false;

      highScoreRef.current = time;
      setHighScore(time);
      setIsNewBest(true);
      void import('../lib/waveStorage').then(({ persistWaveHighScore }) => {
        persistWaveHighScore({ difficultyId: difficulty.id, isEndless, isMini }, time);
      });
      return true;
  }, [difficulty.id, isEndless, isMini]);
  
  const [consistency, setConsistency] = useState<string>('100%');
  
  // Audio is dynamically imported only after the user opts in.
  const audioEngineRef = useRef<WaveAudioEngine | null>(null);
  const audioLoadRef = useRef<Promise<WaveAudioEngine | null> | null>(null);
  const audioDisposedRef = useRef(false);
  const mutedRef = useRef(true);
  const statusRef = useRef(status);
  const rendererRef = useRef<WaveRenderer | null>(null);
  const rendererLoadRef = useRef<Promise<WaveRenderer | null> | null>(null);
  const runtimeRef = useRef<WaveRuntime | null>(null);
  const runtimeLoadRef = useRef<Promise<WaveRuntime | null> | null>(null);

  const ensureRenderer = useCallback(async () => {
      if (rendererRef.current) return rendererRef.current;
      if (!rendererLoadRef.current) {
          rendererLoadRef.current = import('../lib/waveRenderer')
              .then(({ renderWaveFrame }) => renderWaveFrame)
              .catch(() => null);
      }
      const renderer = await rendererLoadRef.current;
      if (renderer) rendererRef.current = renderer;
      return renderer;
  }, []);

  const ensureRuntime = useCallback(async () => {
      if (runtimeRef.current) return runtimeRef.current;
      if (!runtimeLoadRef.current) {
          runtimeLoadRef.current = import('../lib/waveRuntime').catch(() => null);
      }
      const runtime = await runtimeLoadRef.current;
      if (runtime) runtimeRef.current = runtime;
      return runtime;
  }, []);

  const preloadGameplay = useCallback(() => {
      void Promise.all([ensureRuntime(), ensureRenderer()]);
  }, [ensureRenderer, ensureRuntime]);

  // Game State Ref
  const gameState = useRef<WaveRuntimeState>({
    playerY: 250,
    playerX: 100,
    velocityY: 0,
    isHolding: false,
    obstacles: [],
    particles: [],
    shockwaves: [],
    stars: [], 
    trail: [] as {x: number, y: number, w: number}[],
    startTime: 0,
    lastFrameTime: 0,
    distanceTraveled: 0,
    lastObstacleX: 0,
    currentPattern: 'random',
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
  const seedPreparedRef = useRef(false);

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

  const recordRun = (result: "won" | "lost") => {
    if (runRecordedRef.current) return;

    const stats = runtimeRef.current?.getWaveRunStats(gameState.current) ?? {
      clickCount: gameState.current.clickCount,
      averageCps: 0,
      peakCps: 0,
      averageInterval: 0,
      intervalStdDev: 0,
    };

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
      void import('../lib/waveStorage').then(({ persistWaveRuns }) => {
        persistWaveRuns({ difficultyId: difficulty.id, isEndless, isMini }, next);
      });
      return next;
    });
    runRecordedRef.current = true;
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
      rng: Math.random
    };

    seedPreparedRef.current = false;
    const runtime = runtimeRef.current;
    if (runtime) {
      runtime.prepareWaveSeedAndStars(gameState.current, {
        width,
        height,
        deterministic: !isEndless,
        seedKey: `${difficulty.id}-${isMini ? "mini" : "normal"}`,
        lowVisuals: lowVisualsRef.current,
      });
      seedPreparedRef.current = true;
    }

    setConsistency('100%');
    setIsNewBest(false);
    runRecordedRef.current = false;
    lastHudUpdateRef.current = 0;
  }, [difficulty.color, difficulty.speed, difficulty.id, isEndless, isMini]);

  // --- GAME LOOP ---
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (status === GameStatus.Playing) {
        const runtime = runtimeRef.current;
        if (!runtime) {
            requestRef.current = undefined;
            void Promise.all([ensureRuntime(), ensureRenderer()]).then(([loadedRuntime, loadedRenderer]) => {
                if (loadedRuntime && loadedRenderer && statusRef.current === GameStatus.Playing) {
                    gameLoop();
                }
            });
            return;
        }

        if (!seedPreparedRef.current) {
            runtime.prepareWaveSeedAndStars(gameState.current, {
                width: canvas.width,
                height: canvas.height,
                deterministic: !isEndless,
                seedKey: `${difficulty.id}-${isMini ? "mini" : "normal"}`,
                lowVisuals: lowVisualsRef.current,
            });
            seedPreparedRef.current = true;
        }

        const step = runtime.advanceWaveFrame(gameState.current, {
            now: performance.now(),
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            difficultySpeed: difficulty.speed,
            difficultyGap: difficulty.gap,
            isMini,
            isEndless,
            lowVisuals: lowVisualsRef.current,
        });

        if (step.now - lastHudUpdateRef.current >= (lowVisualsRef.current ? 100 : 50)) {
            if (timeDisplayRef.current) {
                timeDisplayRef.current.textContent = `${(gameState.current.runTime / 1000).toFixed(2)}s`;
            }
            if (progressRef.current && !isEndless) {
                const progress = Math.min(
                  100,
                  (gameState.current.distanceTraveled / gameState.current.finishLineX) * 100
                );
                progressRef.current.style.width = `${progress}%`;
            }
            lastHudUpdateRef.current = step.now;
        }

        if (step.died) {
            handleDeath();
            return;
        }

        if (step.won && !runRecordedRef.current) {
            setConsistency(runtime.calculateWaveConsistency(gameState.current));
            recordRun("won");
            onStatusChange(GameStatus.Won);
            playSound('win');
            const didBreakRecord = saveHighScore(gameState.current.runTime / 1000);
            if (didBreakRecord) setIsNewBest(true);
        }
    }

    const renderer = rendererRef.current;
    if (!renderer) {
        if (status === GameStatus.Playing) {
            requestRef.current = undefined;
            void ensureRenderer().then((loadedRenderer) => {
                if (loadedRenderer && statusRef.current === GameStatus.Playing) {
                    gameLoop();
                }
            });
        }
        return;
    }

    renderer(ctx, canvas, gameState.current, {
        isEndless,
        isMini,
        reduceMotion,
        lowVisuals: lowVisualsRef.current,
        showPlayer: status !== GameStatus.Lost,
        playerColor: difficulty.color,
    });

    if (status === GameStatus.Playing) {
        requestRef.current = requestAnimationFrame(gameLoop);
    } else {
        requestRef.current = undefined;
    }
  }, [status, difficulty, isEndless, isMini, saveHighScore, playSound, reduceMotion, ensureRenderer, ensureRuntime]);

  const handleDeath = () => {
      if (runRecordedRef.current) return;
      onStatusChange(GameStatus.Lost);
      gameState.current.shakeIntensity = reduceMotion ? 0 : 40; 
      runtimeRef.current?.createWaveExplosion(
          gameState.current,
          gameState.current.playerX,
          gameState.current.playerY,
          '#fff',
          lowVisualsRef.current,
          reduceMotion
      );
      playSound('crash');
      setConsistency(runtimeRef.current?.calculateWaveConsistency(gameState.current) ?? 'N/A');
      recordRun("lost");
      
      const currentTime = gameState.current.runTime / 1000;
      const didBreakRecord = saveHighScore(currentTime);
      if (didBreakRecord) {
          setIsNewBest(true);
          playSound('newBest');
      }
  };
  

  const handleStart = useCallback((e?: any) => {
     // Check if the target is a button, interactive element, or inside the modal
     if (e && e.target instanceof Element) {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.share-modal-content')) {
            return;
        }
     }
     
     if (shareOpenRef.current) return;
  
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
  }, [status, resetGame, onStatusChange, playSound]);

  const handleEnd = useCallback(() => {
     gameState.current.isHolding = false;
  }, []);

  const handleShareOpenChange = useCallback((open: boolean) => {
      shareOpenRef.current = open;
  }, []);

  const focusGame = useCallback(() => {
      requestAnimationFrame(() => {
          containerRef.current?.focus({ preventScroll: true });
      });
  }, []);

  const syncMusic = useCallback(() => {
      if (
          mutedRef.current ||
          statusRef.current !== GameStatus.Playing ||
          document.hidden
      ) {
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
  }, [ensureAudio, triggerBeat]);

  useEffect(() => {
      statusRef.current = status;
      mutedRef.current = isMuted;
      syncMusic();
  }, [isMuted, status, syncMusic]);

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
          syncMusic();
      };

      window.addEventListener('blur', releaseInput);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
          window.removeEventListener('blur', releaseInput);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
  }, [syncMusic]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (shareOpenRef.current) return;

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
  }, [handleStart, handleEnd, status]);

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
  }, [resetGame]);

  const runStats =
    status === GameStatus.Lost || status === GameStatus.Won
      ? runtimeRef.current?.getWaveRunStats(gameState.current) ?? {
          clickCount: gameState.current.clickCount,
          averageCps: 0,
          peakCps: 0,
          averageInterval: 0,
          intervalStdDev: 0,
        }
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
              <div
                ref={timeDisplayRef}
                className="text-3xl sm:text-4xl font-display font-black text-white italic drop-shadow-lg tabular-nums"
              >
                {(gameState.current.runTime / 1000).toFixed(2)}s
              </div>
              {!isEndless ? (
                <div className="w-32 sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                   <div
                      ref={progressRef}
                      className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-75"
                      style={{ width: `${Math.min(100, (gameState.current.distanceTraveled / gameState.current.finishLineX) * 100)}%` }}
                   />
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
                onPointerEnter={preloadGameplay}
                onPointerDown={preloadGameplay}
                onFocus={preloadGameplay}
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

      {(status === GameStatus.Lost || status === GameStatus.Won) && (
        <WaveRunOverlays
          status={status}
          isNewBest={isNewBest}
          runTimeSeconds={gameState.current.runTime / 1000}
          highScore={highScore}
          runStats={runStats}
          consistency={consistency}
          difficultyLabel={difficulty.label}
          isEndless={isEndless}
          progressPercent={
            isEndless
              ? 100
              : Math.min(100, (gameState.current.distanceTraveled / gameState.current.finishLineX) * 100)
          }
          onRetry={() => {
            resetGame();
            onStatusChange(GameStatus.Playing);
            focusGame();
          }}
          onMenu={() => {
            resetGame();
            onStatusChange(GameStatus.Idle);
          }}
          onShareOpenChange={handleShareOpenChange}
        />
      )}

    </div>
  );
});

export default GameCanvas;
