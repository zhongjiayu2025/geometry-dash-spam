import React, { useRef, useEffect, useCallback, useState, memo, useMemo } from 'react';
import { DifficultyConfig, GameStatus } from '../types';
import { WIN_TIME_MS, WAVE_SPEED_Y } from '../constants';
import { Trophy, AlertTriangle, ChevronsUp, Crown, Infinity as InfinityIcon, Volume2, VolumeX, Eye, EyeOff, Activity, Hash, Zap, Minimize2, Music2, Music4, Share2, Keyboard, Check, Settings, BarChart2, Trash2, X, Palette, Gauge, Ghost, MonitorOff, Route, Cpu } from 'lucide-react';

interface GameCanvasProps {
  difficulty: DifficultyConfig;
  status: GameStatus;
  onStatusChange: (status: GameStatus) => void;
  isEndless?: boolean;
  isMini?: boolean;
}

// ... existing interfaces ...
interface Obstacle {
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

interface Portal {
  x: number;
  y: number;
  type: 'gravity_up' | 'gravity_down';
  radius: number;
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  rotation: number; 
  vRot: number;     
}

interface Decoration {
  x: number;
  y: number;
  size: number;
  shape: 'square' | 'triangle';
  speedFactor: number; 
  rotation: number;
  opacity: number;
}

interface ClickEffect {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

interface LeaderboardEntry {
  id: number;
  time: number; // in seconds
  consistency: string;
  date: string;
}

type GenerationPattern = 'random' | 'straight' | 'stairs' | 'zigzag'; // Renamed and expanded
type SoundType = 'default' | 'mouse' | 'keyboard' | 'pop';
type TrailStyle = 'solid' | 'dashed' | 'particles';

// SVG Graph Component for Results
const CpsGraph = ({ intervals, color, width = 300, height = 60 }: { intervals: number[], color: string, width?: number, height?: number }) => {
    if (intervals.length < 5) return <div className="text-xs text-slate-500 text-center py-4">Not enough data for graph</div>;

    const dataPoints = intervals.map(i => i > 0 ? 1000 / i : 0);
    const smoothed = dataPoints.map((val, i, arr) => {
        if (i === 0 || i === arr.length - 1) return val;
        return (arr[i-1] + val + arr[i+1]) / 3;
    });

    const maxVal = 20; 
    const minVal = 0;
    
    const points = smoothed.map((val, i) => {
        const x = (i / (smoothed.length - 1)) * width;
        const y = height - ((Math.min(val, maxVal) - minVal) / (maxVal - minVal)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full bg-slate-900/50 rounded border border-white/5 p-2 mb-4">
            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono mb-1">
                <span>Start</span>
                <span>Click Speed Analysis</span>
                <span>End</span>
            </div>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
                <polygon fill={color} fillOpacity="0.1" points={`0,${height} ${points} ${width},${height}`} />
            </svg>
        </div>
    );
};

const GameCanvas: React.FC<GameCanvasProps> = memo(({ difficulty, status, onStatusChange, isEndless = false, isMini = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // DOM Refs
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);
  const consistencyRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  
  // Menus
  const [showSettings, setShowSettings] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  // Settings State
  const [isMuted, setIsMuted] = useState<boolean>(() => localStorage.getItem('gd_spam_muted') === 'true');
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(() => localStorage.getItem('gd_spam_music_muted') === 'true');
  const [clickSoundEnabled, setClickSoundEnabled] = useState<boolean>(() => localStorage.getItem('gd_spam_click_sfx') !== 'false');
  const [clickSoundType, setClickSoundType] = useState<SoundType>(() => (localStorage.getItem('gd_spam_sound_type') as SoundType) || 'mouse'); // Default to improved mouse
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => localStorage.getItem('gd_spam_reduced_motion') === 'true');
  const [showHitbox, setShowHitbox] = useState<boolean>(false);
  
  // New Features State
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(300); 
  const [showGhost, setShowGhost] = useState<boolean>(true); 
  const [focusMode, setFocusMode] = useState<boolean>(false); 
  const [trainingPattern, setTrainingPattern] = useState<GenerationPattern>('random');

  // Customization State
  const [userColor, setUserColor] = useState<string | null>(() => localStorage.getItem('gd_spam_user_color'));
  const [trailStyle, setTrailStyle] = useState<TrailStyle>(() => (localStorage.getItem('gd_spam_trail_style') as TrailStyle) || 'solid');

  // Game/UI State
  const [bestTime, setBestTime] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(1);
  const [consistency, setConsistency] = useState<string>('100%');
  const [unstableRate, setUnstableRate] = useState<number>(0); // New UR stat 
  const [copied, setCopied] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [finalIntervals, setFinalIntervals] = useState<number[]>([]); 
  
  // Keybind
  const [customKey, setCustomKey] = useState<string>(() => localStorage.getItem('gd_spam_bind_key') || 'Space');
  const [isBinding, setIsBinding] = useState(false);
  const customKeyRef = useRef<string>(localStorage.getItem('gd_spam_bind_key') || 'Space');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicFilterRef = useRef<BiquadFilterNode | null>(null); 
  
  const nextNoteTimeRef = useRef<number>(0);
  const nextMetronomeTimeRef = useRef<number>(0);
  const inputState = useRef<boolean>(false); 
  
  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('gd_spam_muted', String(isMuted)); }, [isMuted]);
  useEffect(() => { localStorage.setItem('gd_spam_music_muted', String(isMusicMuted)); }, [isMusicMuted]);
  useEffect(() => { localStorage.setItem('gd_spam_click_sfx', String(clickSoundEnabled)); }, [clickSoundEnabled]);
  useEffect(() => { localStorage.setItem('gd_spam_sound_type', clickSoundType); }, [clickSoundType]);
  useEffect(() => { localStorage.setItem('gd_spam_reduced_motion', String(reducedMotion)); }, [reducedMotion]);
  useEffect(() => { if(userColor) localStorage.setItem('gd_spam_user_color', userColor); else localStorage.removeItem('gd_spam_user_color'); }, [userColor]);
  useEffect(() => { localStorage.setItem('gd_spam_trail_style', trailStyle); }, [trailStyle]);

  // --- LEADERBOARD ---
  const getLeaderboardKey = useCallback(() => `gd_spam_lb_${difficulty.id}${isMini ? '_mini' : ''}${isEndless ? '_endless' : ''}`, [difficulty.id, isMini, isEndless]);

  const loadLeaderboard = useCallback(() => {
      const key = getLeaderboardKey();
      const stored = localStorage.getItem(key);
      if (stored) { try { setLeaderboard(JSON.parse(stored)); } catch(e) { setLeaderboard([]); } } else { setLeaderboard([]); }
  }, [getLeaderboardKey]);

  useEffect(() => {
      loadLeaderboard();
      const key = getLeaderboardKey();
      const stored = localStorage.getItem(key);
      if (stored) { const lb = JSON.parse(stored); if (lb.length > 0) setBestTime(lb[0].time); else setBestTime(0); }
  }, [loadLeaderboard, getLeaderboardKey]);

  const saveRunToLeaderboard = (timeSec: number, cons: string) => {
      const key = getLeaderboardKey();
      const entry: LeaderboardEntry = {
          id: Date.now(), time: parseFloat(timeSec.toFixed(2)), consistency: cons, date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      };
      const newLb = [...leaderboard, entry].sort((a, b) => b.time - a.time).slice(0, 5); 
      setLeaderboard(newLb); localStorage.setItem(key, JSON.stringify(newLb));
      if (newLb.length > 0) setBestTime(newLb[0].time);
  };

  const clearLeaderboard = (e: React.MouseEvent) => {
      e.stopPropagation();
      const key = getLeaderboardKey(); localStorage.removeItem(key); setLeaderboard([]); setBestTime(0);
  };

  // --- AUDIO ---
  const updateKeybind = (code: string) => {
    setCustomKey(code); customKeyRef.current = code; localStorage.setItem('gd_spam_bind_key', code); setIsBinding(false);
  };

  const gameState = useRef({
    playerY: 200, playerX: 100, velocityY: 0, rotation: 0, isHolding: false, gravitySide: 1, 
    obstacles: [] as Obstacle[], portals: [], particles: [], decorations: [], clickEffects: [], trail: [],
    startTime: 0, distanceTraveled: 0, lastObstacleX: 0, bgOffset: 0, groundOffset: 0, shakeIntensity: 0,
    deathCoords: { x: 0, y: 0 }, hasBeatenBest: false, frameCount: 0, lastFpsTime: 0,
    pattern: 'random' as GenerationPattern, patternCounter: 0, currentHue: 0, 
    baseColor: userColor || difficulty.color,
    beatPhase: 0, lastClickTime: 0, clickIntervals: [], consistencyScore: 100,
    currentRunFrames: [] as number[], 
    bestRunFrames: [] as number[]     
  });

  const requestRef = useRef<number>();

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;
          
          masterGainRef.current = ctx.createGain();
          masterGainRef.current.connect(ctx.destination);
          
          musicFilterRef.current = ctx.createBiquadFilter();
          musicFilterRef.current.type = 'lowpass';
          musicFilterRef.current.frequency.value = 400; 
          musicFilterRef.current.Q.value = 1;
          musicFilterRef.current.connect(masterGainRef.current);
      }
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  useEffect(() => {
      if (!musicFilterRef.current || !audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      
      if (status === GameStatus.Playing) {
          musicFilterRef.current.frequency.exponentialRampToValueAtTime(20000, now + 0.5);
      } else {
          musicFilterRef.current.frequency.exponentialRampToValueAtTime(400, now + 0.5);
      }
  }, [status]);

  const scheduleAudio = useCallback(() => {
    if (!audioCtxRef.current || isMuted || status !== GameStatus.Playing) return;
    const ctx = audioCtxRef.current;
    const lookahead = 0.1; 

    if (!isMusicMuted && musicFilterRef.current) {
        const tempo = 128; const secondsPerBeat = 60.0 / tempo;
        while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
            const time = nextNoteTimeRef.current;
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.frequency.setValueAtTime(150, time); osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
            gain.gain.setValueAtTime(0.3, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            osc.connect(gain); 
            gain.connect(musicFilterRef.current); 
            osc.start(time); osc.stop(time + 0.5);
            // Bass
            const bassOsc = ctx.createOscillator(); const bassGain = ctx.createGain(); bassOsc.type = 'sawtooth';
            const freq = [46.25, 55.00, 69.30][Math.floor(time % 3)]; 
            bassOsc.frequency.setValueAtTime(freq, time + secondsPerBeat/2);
            bassGain.gain.setValueAtTime(0.1, time + secondsPerBeat/2); bassGain.gain.linearRampToValueAtTime(0, time + secondsPerBeat);
            const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 400;
            bassOsc.connect(filter); filter.connect(bassGain); 
            bassGain.connect(musicFilterRef.current); 
            bassOsc.start(time + secondsPerBeat/2); bassOsc.stop(time + secondsPerBeat);
            nextNoteTimeRef.current += secondsPerBeat;
        }
    }

    if (metronomeEnabled && masterGainRef.current) {
        const secondsPerClick = 60.0 / bpm;
        while (nextMetronomeTimeRef.current < ctx.currentTime + lookahead) {
            const time = nextMetronomeTimeRef.current;
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.frequency.setValueAtTime(1200, time);
            osc.type = 'square';
            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            osc.connect(gain); gain.connect(masterGainRef.current);
            osc.start(time); osc.stop(time + 0.05);
            nextMetronomeTimeRef.current += secondsPerClick;
        }
    }
  }, [isMuted, isMusicMuted, status, metronomeEnabled, bpm]);

  useEffect(() => {
      if (status !== GameStatus.Playing) {
          if (audioCtxRef.current) {
              const now = audioCtxRef.current.currentTime;
              nextNoteTimeRef.current = now + 0.1;
              nextMetronomeTimeRef.current = now + 0.1;
          }
      }
  }, [status]);

  const playSound = useCallback((type: 'crash' | 'win' | 'newBest' | 'click' | 'portal') => {
    if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const dest = masterGainRef.current; 

    if (type === 'crash') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now); osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);
      gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain); gain.connect(dest); osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'win') {
        [523.25, 659.25, 783.99].forEach((freq, i) => { 
            const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'triangle'; osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, now + i*0.1); gain.gain.linearRampToValueAtTime(0.1, now + i*0.1 + 0.1); gain.gain.exponentialRampToValueAtTime(0.01, now + i*0.1 + 0.5);
            osc.connect(gain); gain.connect(dest); osc.start(now + i*0.1); osc.stop(now + i*0.1 + 0.5);
        });
    } else if (type === 'newBest') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); osc.frequency.linearRampToValueAtTime(1760, now + 0.1);
      gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.connect(gain); gain.connect(dest); osc.start(now); osc.stop(now + 0.2);
    } else if (type === 'click' && clickSoundEnabled) {
      // ENHANCED CLICK SYNTHESIS
      if (clickSoundType === 'mouse') {
          // Layer 1: High frequency snap (Micro-switch click)
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(3000, now);
          osc1.frequency.exponentialRampToValueAtTime(1000, now + 0.01);
          gain1.gain.setValueAtTime(0.2, now);
          gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
          osc1.connect(gain1);
          gain1.connect(dest);
          osc1.start(now);
          osc1.stop(now + 0.03);

          // Layer 2: Tactile Thud (Plastic resonance)
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(200, now);
          osc2.frequency.exponentialRampToValueAtTime(50, now + 0.05);
          gain2.gain.setValueAtTime(0.3, now);
          gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc2.connect(gain2);
          gain2.connect(dest);
          osc2.start(now);
          osc2.stop(now + 0.05);

          // Layer 3: Noise (Friction)
          const bufferSize = ctx.sampleRate * 0.01;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = 'highpass';
          noiseFilter.frequency.value = 5000;
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.1, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.01);
          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(dest);
          noise.start(now);

      } else if (clickSoundType === 'default') {
          const osc = ctx.createOscillator(); const gain = ctx.createGain(); const baseFreq = isMini ? 1500 : 1200;
          osc.frequency.setValueAtTime(baseFreq, now); osc.frequency.exponentialRampToValueAtTime(baseFreq/2, now + 0.05);
          gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.type = 'square'; osc.connect(gain); gain.connect(dest); osc.start(now); osc.stop(now + 0.05);
      } else if (clickSoundType === 'keyboard') {
          const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'triangle';
          osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
          gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.connect(gain); gain.connect(dest); osc.start(now); osc.stop(now + 0.05);
      } else if (clickSoundType === 'pop') {
          const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
          gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.connect(gain); gain.connect(dest); osc.start(now); osc.stop(now + 0.1);
      }
    } else if (type === 'portal') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now); osc.frequency.linearRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain); gain.connect(dest); osc.start(now); osc.stop(now + 0.3);
    }
  }, [isMuted, clickSoundEnabled, isMini, clickSoundType]);

  const shareScore = async (e: React.MouseEvent) => {
     e.stopPropagation();
     const score = (gameState.current.startTime ? ((Date.now() - gameState.current.startTime)/1000).toFixed(2) : "0.00");
     const text = `I just survived ${score}s on ${difficulty.label} difficulty in Geometry Dash Spam Test! 🌊 Can you beat me?`;
     const url = 'https://geometrydashspam.cc';

     // Try native share first
     if (typeof navigator !== 'undefined' && navigator.share) {
        try {
            await navigator.share({
                title: 'Geometry Dash Spam Test',
                text: text,
                url: url
            });
            return;
        } catch (err) {
            console.error('Share failed or canceled:', err);
            // Fallthrough to clipboard if share failed (e.g. user cancel or unsupported)
        }
     }
     
     // Fallback to Clipboard
     const fullText = `${text} ${url}`;
     navigator.clipboard.writeText(fullText);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const spawnDecoration = (canvasWidth: number, canvasHeight: number) => {
      if (reducedMotion) return;
      if (Math.random() < 0.02) { 
          gameState.current.decorations.push({
              x: canvasWidth + 50, y: Math.random() * canvasHeight, size: Math.random() * 40 + 10,
              shape: Math.random() > 0.5 ? 'square' : 'triangle', speedFactor: Math.random() * 0.3 + 0.1, 
              rotation: Math.random() * Math.PI * 2, opacity: Math.random() * 0.1 + 0.05
          });
      }
  };

  const spawnPortal = (x: number, y: number, currentGravity: number) => {
      const type = currentGravity === 1 ? 'gravity_up' : 'gravity_down';
      gameState.current.portals.push({ x, y, type, radius: 25, active: true });
  };

  const spawnObstacle = useCallback((canvasWidth: number, canvasHeight: number, startX: number) => {
    const minWall = 30; 
    const minGapCenter = minWall + difficulty.gap / 2;
    const maxGapCenter = canvasHeight - minWall - difficulty.gap / 2;
    
    // Pattern Logic
    if (gameState.current.patternCounter <= 0) {
        if (trainingPattern === 'random') {
            const rand = Math.random();
            if (rand < 0.4) gameState.current.pattern = 'random'; // actually flat-ish
            else if (rand < 0.7) gameState.current.pattern = Math.random() > 0.5 ? 'straight' : 'zigzag'; // Reuse strings for internal logic
            else gameState.current.pattern = 'stairs';
            gameState.current.patternCounter = Math.floor(Math.random() * 10) + 5;
        } else {
            // Force specific pattern
            gameState.current.pattern = trainingPattern === 'zigzag' ? 'zigzag' : trainingPattern === 'stairs' ? 'stairs' : 'straight';
            gameState.current.patternCounter = 999; // Keep it constant
        }
    }
    
    // Decrement only if we are in random mode to switch naturally
    if (trainingPattern === 'random') gameState.current.patternCounter--;

    const lastObs = gameState.current.obstacles[gameState.current.obstacles.length - 1];
    let targetTopHeight = 0;
    const effectiveSpeedY = isMini ? WAVE_SPEED_Y * 1.5 : WAVE_SPEED_Y;
    const slopeStep = effectiveSpeedY * 5; 

    if (!lastObs) {
        targetTopHeight = (canvasHeight - difficulty.gap) / 2;
    } else {
        const prevCenter = lastObs.topHeight + difficulty.gap / 2;
        let nextCenter = prevCenter;
        
        const pattern = trainingPattern === 'random' ? (gameState.current.pattern === 'random' ? 'random' : gameState.current.pattern) : trainingPattern;

        switch(pattern) {
            case 'straight': 
                // Dead straight line
                nextCenter = canvasHeight / 2; 
                break;
            case 'stairs': 
                // Sharp jumps
                if (Math.random() < 0.3) {
                    const direction = prevCenter > canvasHeight/2 ? -1 : 1;
                    nextCenter = prevCenter + (direction * difficulty.gap * 1.5);
                } else {
                    nextCenter = prevCenter; // hold platform
                }
                break;
            case 'zigzag': 
                // Continuous movement
                if (!gameState.current.currentHue) gameState.current.currentHue = 1; // hijack hue for direction state
                const dir = gameState.current.currentHue > 0 ? 1 : -1;
                nextCenter = prevCenter + (slopeStep * dir);
                if (nextCenter > maxGapCenter || nextCenter < minGapCenter) {
                    gameState.current.currentHue *= -1; // reverse
                    nextCenter = prevCenter;
                }
                break;
            case 'random': 
            default: 
                nextCenter = prevCenter + (Math.random() * 200 - 100); 
                break;
        }
        
        // Boundaries
        if (nextCenter < minGapCenter) nextCenter = minGapCenter;
        if (nextCenter > maxGapCenter) nextCenter = maxGapCenter;
        
        targetTopHeight = nextCenter - difficulty.gap / 2;
    }

    gameState.current.obstacles.push({
      x: startX, width: 50 + (difficulty.speed * 2), topHeight: targetTopHeight, bottomY: targetTopHeight + difficulty.gap, passed: false
    });
    
    // Portals only in random or specific modes
    const portalCooldown = 800; 
    const lastPortal = gameState.current.portals[gameState.current.portals.length-1];
    const canSpawnPortal = !lastPortal || (startX - lastPortal.x > portalCooldown);
    const gapCenter = targetTopHeight + difficulty.gap / 2;
    
    if (canSpawnPortal && Math.random() < 0.15 && trainingPattern === 'random') {
        let spawnType = gameState.current.gravitySide === 1 ? 'gravity_up' : 'gravity_down';
        if (lastPortal) {
            spawnType = lastPortal.type === 'gravity_up' ? 'gravity_down' : 'gravity_up';
        }
        gameState.current.portals.push({ x: startX + 25, y: gapCenter, type: spawnType as any, radius: 25, active: true });
    }
    gameState.current.lastObstacleX = startX;
  }, [difficulty, isMini, trainingPattern]);

  const resetGame = useCallback(() => {
    if (!canvasRef.current) return;
    const height = canvasRef.current.height;
    
    setAttempts(prev => prev + 1);
    setConsistency('100%');
    setUnstableRate(0); // Reset UR
    if (consistencyRef.current) consistencyRef.current.innerText = '100%';

    const existingBestRun = gameState.current.bestRunFrames;

    gameState.current = {
      playerY: height / 2, playerX: 100, velocityY: 0, rotation: 0, isHolding: inputState.current, gravitySide: 1, 
      obstacles: [], portals: [], particles: [], decorations: [], clickEffects: [], trail: [],
      startTime: 0, distanceTraveled: 0, lastObstacleX: 0, bgOffset: 0, groundOffset: 0, shakeIntensity: 0,
      deathCoords: { x: 0, y: 0 }, hasBeatenBest: false, frameCount: 0, lastFpsTime: performance.now(),
      pattern: 'random', patternCounter: 0, currentHue: 0, 
      baseColor: userColor || difficulty.color,
      beatPhase: 0, lastClickTime: 0, clickIntervals: [], consistencyScore: 100,
      currentRunFrames: [],
      bestRunFrames: existingBestRun
    };
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, height);
    if (progressBarRef.current) progressBarRef.current.style.width = '0%';
    
  }, [difficulty.color, userColor]);

  const createExplosion = (x: number, y: number, color: string) => {
    if (reducedMotion) return;
    gameState.current.shakeIntensity = 25;
    gameState.current.deathCoords = { x, y }; 
    playSound('crash');
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 8 + 4; const forwardMomentum = difficulty.speed * 0.8;
      gameState.current.particles.push({
        x, y, vx: (Math.cos(angle) * speed) + forwardMomentum, vy: Math.sin(angle) * speed,
        life: 1.0, color, size: Math.random() * 8 + 4, rotation: Math.random() * Math.PI * 2, vRot: (Math.random() - 0.5) * 0.5
      });
    }
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100; const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const calculateConsistency = () => {
      const intervals = gameState.current.clickIntervals; if (intervals.length < 5) return '100%';
      const spamIntervals = intervals.filter(i => i < 300); if (spamIntervals.length < 5) return '100%';
      
      const mean = spamIntervals.reduce((a, b) => a + b) / spamIntervals.length;
      const variance = spamIntervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / spamIntervals.length;
      const stdDev = Math.sqrt(variance);
      
      // Calculate Score
      const score = Math.max(0, Math.min(100, 100 - (stdDev - 5) * 2));
      gameState.current.consistencyScore = score;
      
      // Update Unstable Rate (stdDev * 10 is a common gaming metric)
      setUnstableRate(stdDev * 10);

      return `${score.toFixed(1)}%`;
  };

  const getBotLabel = (ur: number) => {
      if (ur === 0) return null;
      if (ur < 50) return { label: 'BOT / MACRO?', color: 'text-red-500' };
      if (ur < 80) return { label: 'GODLIKE', color: 'text-yellow-400' };
      if (ur < 150) return { label: 'PRO', color: 'text-purple-400' };
      if (ur < 250) return { label: 'DECENT', color: 'text-blue-400' };
      return { label: 'INCONSISTENT', color: 'text-slate-500' };
  };

  const handleGameEnd = (isWin: boolean, elapsed: number, color: string) => {
      if (elapsed > bestTime * 1000 || isWin) {
          gameState.current.bestRunFrames = [...gameState.current.currentRunFrames];
      }
      const finalCons = consistency; 
      saveRunToLeaderboard(elapsed / 1000, finalCons); 
      setFinalIntervals([...gameState.current.clickIntervals]);
      calculateConsistency(); // Final calc for stats
      onStatusChange(isWin ? GameStatus.Won : GameStatus.Lost);
  };

  // ... gameLoop (unchanged logic mostly, just pattern usage inside spawnObstacle)
  const gameLoop = useCallback((time: number) => {
    if (status !== GameStatus.Playing) return;
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    
    scheduleAudio();

    gameState.current.beatPhase += 0.05;
    const beatPulse = Math.pow((Math.sin(gameState.current.beatPhase) + 1) / 2, 4); 

    if (isEndless) {
       gameState.current.currentHue = (gameState.current.currentHue + 0.5) % 360;
       gameState.current.baseColor = hslToHex(gameState.current.currentHue, 80, 60);
    } else {
       gameState.current.baseColor = userColor || difficulty.color;
    }
    const currentColor = gameState.current.baseColor;

    gameState.current.frameCount++;
    if (time - gameState.current.lastFpsTime >= 1000) {
        gameState.current.frameCount = 0; gameState.current.lastFpsTime = time;
    }

    if (gameState.current.startTime === 0) gameState.current.startTime = time;
    const elapsed = time - gameState.current.startTime;

    if (!isEndless && progressBarRef.current && progressGlowRef.current) {
        const percentage = Math.min(100, (elapsed / WIN_TIME_MS) * 100);
        progressBarRef.current.style.width = `${percentage}%`;
        progressBarRef.current.style.backgroundColor = currentColor;
        progressBarRef.current.style.boxShadow = `0 0 15px ${currentColor}`;
        progressGlowRef.current.style.borderColor = currentColor;
    }
    
    if (timerRef.current) { timerRef.current.innerText = (elapsed/1000).toFixed(2) + 's'; }

    const wasHolding = gameState.current.isHolding; gameState.current.isHolding = inputState.current;
    
    if (wasHolding !== gameState.current.isHolding) {
       if (gameState.current.isHolding) {
           playSound('click');
           const now = Date.now();
           if (gameState.current.lastClickTime > 0) {
               const diff = now - gameState.current.lastClickTime;
               gameState.current.clickIntervals.push(diff);
               if (gameState.current.clickIntervals.length % 5 === 0) {
                   const newConsistency = calculateConsistency();
                   if (consistencyRef.current) {
                       consistencyRef.current.innerText = newConsistency;
                       const score = gameState.current.consistencyScore;
                       consistencyRef.current.className = `ml-1 font-bold ${score > 90 ? 'text-green-400' : score > 70 ? 'text-yellow-400' : 'text-red-400'}`;
                   }
                   setConsistency(newConsistency);
               }
           }
           gameState.current.lastClickTime = now;
       }
       if (!reducedMotion) {
           gameState.current.clickEffects.push({ x: gameState.current.playerX, y: gameState.current.playerY, life: 1.0, maxLife: 15 });
       }
    }

    if (bestTime > 0 && !gameState.current.hasBeatenBest) {
        const currentSec = elapsed / 1000;
        if (currentSec > bestTime) { gameState.current.hasBeatenBest = true; playSound('newBest'); }
    }

    if (!isEndless && elapsed >= WIN_TIME_MS) {
      playSound('win');
      handleGameEnd(true, elapsed, currentColor);
      return;
    }

    const width = canvas.width; const height = canvas.height;
    
    gameState.current.bgOffset -= difficulty.speed * 0.5; 
    if (gameState.current.bgOffset <= -50) gameState.current.bgOffset += 50;
    gameState.current.groundOffset -= difficulty.speed;
    if (gameState.current.groundOffset <= -50) gameState.current.groundOffset += 50;

    ctx.save();
    if (!reducedMotion && gameState.current.shakeIntensity > 0) {
      const shakeX = (Math.random() - 0.5) * gameState.current.shakeIntensity; const shakeY = (Math.random() - 0.5) * gameState.current.shakeIntensity;
      ctx.translate(shakeX, shakeY); gameState.current.shakeIntensity *= 0.9; 
      if (gameState.current.shakeIntensity < 0.5) gameState.current.shakeIntensity = 0;
    }

    ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, width, height);
    
    spawnDecoration(width, height);
    for(let i = gameState.current.decorations.length - 1; i >= 0; i--) {
        const decor = gameState.current.decorations[i]; decor.x -= difficulty.speed * decor.speedFactor; decor.rotation += 0.01;
        if (decor.x + decor.size < 0) { gameState.current.decorations.splice(i, 1); continue; }
        ctx.save(); ctx.translate(decor.x, decor.y); ctx.rotate(decor.rotation);
        ctx.fillStyle = currentColor; ctx.globalAlpha = decor.opacity;
        if (decor.shape === 'square') ctx.fillRect(-decor.size/2, -decor.size/2, decor.size, decor.size);
        else { ctx.beginPath(); ctx.moveTo(0, -decor.size/2); ctx.lineTo(decor.size/2, decor.size/2); ctx.lineTo(-decor.size/2, decor.size/2); ctx.fill(); }
        ctx.restore();
    }
    
    ctx.strokeStyle = currentColor; ctx.lineWidth = 1 + (beatPulse * 2); ctx.globalAlpha = 0.1 + (beatPulse * 0.15); 
    ctx.beginPath();
    for(let x = gameState.current.bgOffset; x < width; x += 50) { if (x < 0) continue; ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for(let y = 0; y < height; y += 50) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke(); ctx.globalAlpha = 1.0;

    if (showGhost && gameState.current.bestRunFrames.length > 0) {
        const frameIndex = Math.floor(elapsed / 16.666); 
        const ghostY = gameState.current.bestRunFrames[gameState.current.currentRunFrames.length]; 
        if (ghostY !== undefined) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(gameState.current.playerX, ghostY, 4, 0, Math.PI*2); 
            ctx.fill();
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#fff';
            ctx.restore();
        }
    }

    const waveSpeed = isMini ? WAVE_SPEED_Y * 1.5 : WAVE_SPEED_Y; 
    const deltaY = gameState.current.isHolding ? -waveSpeed : waveSpeed;
    gameState.current.playerY += deltaY * gameState.current.gravitySide;
    gameState.current.currentRunFrames.push(gameState.current.playerY);

    const slopeAngle = Math.atan2(waveSpeed, difficulty.speed);
    let targetRotation = slopeAngle;
    if (gameState.current.isHolding) targetRotation = -slopeAngle;
    targetRotation *= gameState.current.gravitySide;
    gameState.current.rotation += (targetRotation - gameState.current.rotation) * 0.6; 
    const collisionRadius = isMini ? 2 : 3;
    const floorHeight = 25;
    const floorSize = 50;

    if (gameState.current.playerY < floorHeight + collisionRadius || gameState.current.playerY > height - floorHeight - collisionRadius) {
      createExplosion(gameState.current.playerX, gameState.current.playerY, currentColor);
      handleGameEnd(false, elapsed, currentColor);
      ctx.restore(); return;
    }

    const trailOffset = isMini ? 3 : 5;
    gameState.current.trail.push({ x: gameState.current.playerX - trailOffset, y: gameState.current.playerY });
    gameState.current.trail = gameState.current.trail.map(p => ({ ...p, x: p.x - difficulty.speed })).filter(p => p.x > 0);

    const startBuffer = 500; const spawnDistance = 250; 
    if (gameState.current.distanceTraveled < startBuffer) {
        gameState.current.distanceTraveled += difficulty.speed; gameState.current.lastObstacleX = width; 
    } else {
        if (gameState.current.obstacles.length === 0 || (width + 100) - gameState.current.lastObstacleX > spawnDistance) {
            spawnObstacle(width, height, width + 50);
        }
    }

    for(let i = gameState.current.portals.length - 1; i >= 0; i--) {
        const portal = gameState.current.portals[i]; portal.x -= difficulty.speed;
        if (portal.active) {
            const dx = gameState.current.playerX - portal.x; const dy = gameState.current.playerY - portal.y; const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < portal.radius + 10) {
                if (portal.type === 'gravity_up' && gameState.current.gravitySide === 1) { gameState.current.gravitySide = -1; playSound('portal'); gameState.current.shakeIntensity = 10; } 
                else if (portal.type === 'gravity_down' && gameState.current.gravitySide === -1) { gameState.current.gravitySide = 1; playSound('portal'); gameState.current.shakeIntensity = 10; }
                portal.active = false; 
            }
        }
        if (portal.x < -100) { gameState.current.portals.splice(i, 1); } else {
            ctx.save(); ctx.translate(portal.x, portal.y); ctx.rotate(time / 200);
            const portalColor = portal.type === 'gravity_up' ? '#3b82f6' : '#eab308'; 
            ctx.beginPath(); ctx.arc(0, 0, portal.radius, 0, Math.PI * 2); ctx.strokeStyle = portalColor; ctx.lineWidth = 3; ctx.shadowBlur = 15; ctx.shadowColor = portalColor; ctx.stroke();
            ctx.restore();
        }
    }

    for (let i = gameState.current.obstacles.length - 1; i >= 0; i--) {
      const obs = gameState.current.obstacles[i]; obs.x -= difficulty.speed;
      if (gameState.current.playerX + collisionRadius > obs.x && gameState.current.playerX - collisionRadius < obs.x + obs.width) {
        if (gameState.current.playerY - collisionRadius < obs.topHeight || gameState.current.playerY + collisionRadius > obs.bottomY) {
           createExplosion(gameState.current.playerX, gameState.current.playerY, currentColor);
           handleGameEnd(false, elapsed, currentColor);
           ctx.restore(); return;
        }
      }
      if (obs.x + obs.width < -100) { gameState.current.obstacles.splice(i, 1); }
    }

    gameState.current.obstacles.forEach(obs => {
      ctx.fillStyle = '#0f172a'; ctx.fillRect(obs.x, 0, obs.width, obs.topHeight); ctx.fillRect(obs.x, obs.bottomY, obs.width, height - obs.bottomY); ctx.fillStyle = currentColor;
      const sawSize = 20; const sawHeight = 6; 
      ctx.beginPath(); const startSaw = Math.floor(Math.max(0, -obs.x) / sawSize) * sawSize; 
      for(let sx = startSaw; sx < obs.width; sx += sawSize) { const px = obs.x + sx; if (px > width) break; ctx.moveTo(px, obs.topHeight); ctx.lineTo(px + sawSize/2, obs.topHeight + sawHeight); ctx.lineTo(px + sawSize, obs.topHeight); } ctx.fill();
      ctx.beginPath(); for(let sx = startSaw; sx < obs.width; sx += sawSize) { const px = obs.x + sx; if (px > width) break; ctx.moveTo(px, obs.bottomY); ctx.lineTo(px + sawSize/2, obs.bottomY - sawHeight); ctx.lineTo(px + sawSize, obs.bottomY); } ctx.fill();
      ctx.strokeStyle = currentColor; ctx.lineWidth = 2 + beatPulse; ctx.beginPath(); ctx.moveTo(obs.x, obs.topHeight); ctx.lineTo(obs.x + obs.width, obs.topHeight); ctx.moveTo(obs.x, obs.bottomY); ctx.lineTo(obs.x + obs.width, obs.bottomY); ctx.stroke();
      if (showHitbox) { ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1; ctx.strokeRect(obs.x, 0, obs.width, obs.topHeight); ctx.strokeRect(obs.x, obs.bottomY, obs.width, height - obs.bottomY); }
    });

    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, width, floorHeight); ctx.fillRect(0, height - floorHeight, width, floorHeight);
    ctx.strokeStyle = currentColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, floorHeight); ctx.lineTo(width, floorHeight); ctx.moveTo(0, height - floorHeight); ctx.lineTo(width, height - floorHeight); ctx.stroke();
    ctx.fillStyle = currentColor; ctx.globalAlpha = 0.3; for(let x = gameState.current.groundOffset; x < width; x += floorSize) { ctx.fillRect(x + 10, 5, floorSize - 20, floorSize - 35); ctx.fillRect(x + 10, height - floorHeight + 10, floorSize - 20, floorSize - 35); } ctx.globalAlpha = 1.0;

    if (gameState.current.trail.length > 1) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowBlur = 15; ctx.shadowColor = currentColor;
      ctx.beginPath(); ctx.moveTo(gameState.current.trail[0].x, gameState.current.trail[0].y); 
      for (let i = 1; i < gameState.current.trail.length; i++) { ctx.lineTo(gameState.current.trail[i].x, gameState.current.trail[i].y); }
      ctx.strokeStyle = currentColor; ctx.lineWidth = isMini ? 2 : 4; ctx.lineCap = 'round'; 
      if (trailStyle === 'dashed') ctx.setLineDash([5, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(gameState.current.trail[0].x, gameState.current.trail[0].y); for (let i = 1; i < gameState.current.trail.length; i++) { ctx.lineTo(gameState.current.trail[i].x, gameState.current.trail[i].y); }
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    }

    for(let i = gameState.current.clickEffects.length - 1; i >= 0; i--) {
        const effect = gameState.current.clickEffects[i]; effect.life -= 1; if(effect.life <= 0) { gameState.current.clickEffects.splice(i, 1); continue; }
        const progress = 1 - (effect.life / effect.maxLife); ctx.beginPath(); const sizeMultiplier = isMini ? 0.6 : 1.0;
        ctx.arc(effect.x, effect.y, (10 + (progress * 20)) * sizeMultiplier, 0, Math.PI * 2); ctx.strokeStyle = currentColor; ctx.lineWidth = 2 * (1 - progress); ctx.stroke();
    }

    ctx.save(); ctx.translate(gameState.current.playerX, gameState.current.playerY); ctx.rotate(gameState.current.rotation);
    const scaleY = isMini ? 0.6 : 1.0; const scaleX = isMini ? 0.6 : 1.0;
    ctx.scale(scaleX, scaleY * gameState.current.gravitySide);
    ctx.beginPath(); ctx.moveTo(-6, -6); ctx.lineTo(8, 0); ctx.lineTo(-6, 6); ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = currentColor; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(2, 0); ctx.lineTo(-2, 2); ctx.closePath(); ctx.fillStyle = currentColor; ctx.fill();
    if (showHitbox) { ctx.beginPath(); ctx.arc(0, 0, collisionRadius, 0, Math.PI * 2); ctx.fillStyle = '#ef4444'; ctx.fill(); }
    ctx.restore(); ctx.restore(); 

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [difficulty, status, onStatusChange, spawnObstacle, isEndless, playSound, bestTime, showHitbox, clickSoundEnabled, isMini, isMuted, isMusicMuted, scheduleAudio, reducedMotion, consistency, saveRunToLeaderboard, userColor, trailStyle, showGhost, handleGameEnd]);

  const particleLoop = useCallback((time: number) => {
    if (status === GameStatus.Playing) return; 
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const width = canvas.width; const height = canvas.height; const currentColor = gameState.current.baseColor;
    gameState.current.beatPhase += 0.05; const beatPulse = Math.pow((Math.sin(gameState.current.beatPhase) + 1) / 2, 4); 
    
    ctx.save();
    if (!reducedMotion && gameState.current.shakeIntensity > 0) {
      const shakeX = (Math.random() - 0.5) * gameState.current.shakeIntensity; const shakeY = (Math.random() - 0.5) * gameState.current.shakeIntensity;
      ctx.translate(shakeX, shakeY); gameState.current.shakeIntensity *= 0.9; if (gameState.current.shakeIntensity < 0.5) gameState.current.shakeIntensity = 0;
    }

    if (status !== GameStatus.Playing) {
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.beginPath(); for(let x=0; x<width; x+=50) { ctx.moveTo(x, 0); ctx.lineTo(x, height); } for(let y=0; y<height; y+=50) { ctx.moveTo(0, y); ctx.lineTo(width, y); } ctx.stroke();
        ctx.strokeStyle = currentColor; ctx.lineWidth = 1; gameState.current.obstacles.forEach(obs => { ctx.strokeRect(obs.x, 0, obs.width, obs.topHeight); ctx.strokeRect(obs.x, obs.bottomY, obs.width, height - obs.bottomY); });
        if (status === GameStatus.Lost) {
          const { x, y } = gameState.current.deathCoords; ctx.beginPath(); ctx.arc(x, y, 20 + (beatPulse * 10), 0, Math.PI * 2); ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 * beatPulse})`; ctx.lineWidth = 3; ctx.stroke();
        }
    }

    for (let i = gameState.current.particles.length - 1; i >= 0; i--) {
      const p = gameState.current.particles[i]; p.x += p.vx; p.y += p.vy; p.rotation += p.vRot; p.life -= 0.02; p.vx *= 0.95; p.vy *= 0.95;
      if (p.life <= 0) { gameState.current.particles.splice(i, 1); continue; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color; ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.globalAlpha = p.life; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); ctx.restore();
    }
    ctx.restore();
    if (gameState.current.particles.length > 0 || gameState.current.shakeIntensity > 0 || status === GameStatus.Lost) { requestRef.current = requestAnimationFrame(particleLoop); }
  }, [status, difficulty, reducedMotion, userColor]);

  // Input Handling
  useEffect(() => {
    const handleInputDown = (e: Event) => {
        // STRICT CHECK: For Mouse/Touch events, only allow if the target IS the canvas.
        // This prevents clicks on overlay buttons from triggering the "reset game" logic.
        if (e.type !== 'keydown' && e.type !== 'keyup') {
            if (e.target !== canvasRef.current) {
                return;
            }
        }

        if (e.type === 'keydown') {
             if (isBinding) { e.preventDefault(); const code = (e as KeyboardEvent).code; updateKeybind(code); return; }
             const kbEvent = e as KeyboardEvent; if (kbEvent.code === 'KeyH') { setShowHitbox(prev => !prev); return; }
             const isTriggerKey = kbEvent.code === customKeyRef.current || kbEvent.code === 'ArrowUp'; if (!isTriggerKey) return;
        }
        if (e.type === 'touchstart') e.preventDefault();
        inputState.current = true; 
        if (status === GameStatus.Lost) { resetGame(); gameState.current.isHolding = true; onStatusChange(GameStatus.Playing); return; }
        if (status === GameStatus.Idle && !isBinding) { initAudio(); onStatusChange(GameStatus.Playing); gameState.current.isHolding = true; }
    };
    const handleInputUp = (e: Event) => {
        if (e.type === 'keyup') { const kbEvent = e as KeyboardEvent; const isTriggerKey = kbEvent.code === customKeyRef.current || kbEvent.code === 'ArrowUp'; if (!isTriggerKey) return; }
        inputState.current = false;
    };
    window.addEventListener('keydown', handleInputDown as any); window.addEventListener('keyup', handleInputUp as any);
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.addEventListener('mousedown', handleInputDown); canvas.addEventListener('mouseup', handleInputUp); canvas.addEventListener('mouseleave', handleInputUp);
        canvas.addEventListener('touchstart', handleInputDown, { passive: false }); canvas.addEventListener('touchend', handleInputUp);
    }
    return () => {
        window.removeEventListener('keydown', handleInputDown as any); window.removeEventListener('keyup', handleInputUp as any);
        if (canvas) {
            canvas.removeEventListener('mousedown', handleInputDown); canvas.removeEventListener('mouseup', handleInputUp); canvas.removeEventListener('mouseleave', handleInputUp);
            canvas.removeEventListener('touchstart', handleInputDown); canvas.removeEventListener('touchend', handleInputUp);
        }
    };
  }, [status, resetGame, onStatusChange, initAudio, isBinding]);

  useEffect(() => { requestRef.current = requestAnimationFrame(gameLoop); return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); }; }, [gameLoop]);
  useEffect(() => { if (status === GameStatus.Lost) { requestRef.current = requestAnimationFrame(particleLoop); } }, [status, particleLoop]);
  useEffect(() => { if (status === GameStatus.Idle) { resetGame(); } }, [status, resetGame, difficulty, userColor, trailStyle]);
  useEffect(() => {
      const handleResize = () => { if (containerRef.current && canvasRef.current) { canvasRef.current.width = containerRef.current.clientWidth; canvasRef.current.height = containerRef.current.clientHeight; if (status === GameStatus.Idle) { resetGame(); } } };
      window.addEventListener('resize', handleResize); handleResize(); return () => window.removeEventListener('resize', handleResize);
  }, [status, resetGame]);


  return (
    <div 
      className="relative w-full max-w-5xl aspect-video md:h-[500px] bg-slate-950 rounded-lg overflow-hidden transition-all duration-500 mx-auto select-none touch-none group" 
      ref={containerRef}
      style={{
        boxShadow: `0 0 30px ${gameState.current.baseColor}15, 0 0 0 1px ${gameState.current.baseColor}30`
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full cursor-pointer outline-none" />

      {/* KEYBIND OVERLAY */}
      {isBinding && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur z-50 flex flex-col items-center justify-center animate-in fade-in duration-200">
              <Keyboard className="w-16 h-16 text-blue-400 mb-4 animate-bounce" />
              <h2 className="text-3xl font-display font-bold text-white mb-2">PRESS ANY KEY</h2>
              <p className="text-slate-400">Press the key you want to use for wave control.</p>
              <button onClick={(e) => { e.stopPropagation(); setIsBinding(false); }} className="mt-8 px-6 py-2 bg-slate-800 rounded hover:bg-slate-700 text-white">Cancel</button>
          </div>
      )}

      {/* Decorative corners */}
      <div ref={progressGlowRef} className="absolute inset-0 pointer-events-none transition-colors duration-300 border-0" style={{ borderColor: gameState.current.baseColor }}>
         <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 opacity-50 border-inherit"></div>
         <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 opacity-50 border-inherit"></div>
         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 opacity-50 border-inherit"></div>
         <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 opacity-50 border-inherit"></div>
      </div>

      {/* TOP PROGRESS BAR */}
      {!isEndless && (status === GameStatus.Playing || status === GameStatus.Lost) && (
          <div 
            className={`absolute top-4 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black/60 backdrop-blur border border-white/20 rounded-full overflow-hidden shadow-lg z-20 transition-opacity duration-300 ${focusMode && status === GameStatus.Playing ? 'opacity-0' : 'opacity-100'}`}
          >
              <div 
                  ref={progressBarRef}
                  className="h-full relative"
                  style={{ width: '0%', backgroundColor: gameState.current.baseColor }}
              >
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_white]"></div>
              </div>
          </div>
      )}

      {/* Control Toolbar */}
      <div 
        className={`absolute bottom-4 right-4 z-20 flex items-center gap-2 transition-opacity duration-300 ${focusMode && status === GameStatus.Playing ? 'opacity-0' : 'opacity-100'}`}
      >
         {status === GameStatus.Playing && (
             <div className="px-2 py-1 bg-black/40 backdrop-blur rounded text-[10px] font-mono text-slate-400 border border-white/5 flex items-center gap-1">
                 <Hash className="w-3 h-3" /> Att: {attempts}
             </div>
         )}
         
         <div className="h-6 w-px bg-white/10 mx-1"></div>
         
         {status === GameStatus.Playing && (
             <div className="px-2 py-1 bg-black/40 backdrop-blur rounded text-[10px] font-mono border border-white/5 flex items-center gap-1">
                 <Zap className="w-3 h-3 text-yellow-400" />
                 <span ref={consistencyRef} className="text-green-400 font-bold ml-1">100%</span>
             </div>
         )}
         
         <div className="h-6 w-px bg-white/10 mx-1"></div>

         <button onClick={(e) => { e.stopPropagation(); setIsBinding(true); }} className="p-2 bg-black/40 backdrop-blur rounded-full transition-colors text-slate-400 hover:text-white group relative" title={`Current Key: ${customKey}`}>
            <Keyboard className="w-4 h-4" />
         </button>

         {/* CUSTOMIZATION PALETTE */}
         <div className="relative">
             <button onClick={(e) => { e.stopPropagation(); setShowPalette(!showPalette); setShowSettings(false); }} className={`p-2 backdrop-blur rounded-full transition-colors ${showPalette ? 'bg-blue-500/20 text-blue-400' : 'bg-black/40 text-slate-400 hover:text-white'}`} title="Customize Wave">
                <Palette className="w-4 h-4" />
             </button>
             {showPalette && (
                 <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-bottom-2">
                     <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                         <span className="text-xs font-bold text-white uppercase tracking-widest">Wave Garage</span>
                         <button onClick={() => setUserColor(null)} className="text-[10px] text-red-400 hover:text-red-300">Reset Color</button>
                     </div>
                     
                     <div className="mb-4">
                         <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 block">Wave Color</span>
                         <div className="flex flex-wrap gap-2">
                             {[difficulty.color, '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'].map((color, i) => (
                                 <button
                                    key={color + i}
                                    onClick={() => setUserColor(i === 0 ? null : color)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${userColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                 />
                             ))}
                         </div>
                     </div>

                     <div>
                         <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 block">Trail Style</span>
                         <div className="flex gap-2">
                             {(['solid', 'dashed', 'particles'] as TrailStyle[]).map(style => (
                                 <button
                                    key={style}
                                    onClick={() => setTrailStyle(style)}
                                    className={`flex-1 py-1 text-[10px] rounded uppercase border ${trailStyle === style ? 'bg-white text-black border-white' : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/30'}`}
                                 >
                                     {style}
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
             )}
         </div>

         {/* UNIFIED SETTINGS MENU */}
         <div className="relative">
             <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setShowPalette(false); }} className={`p-2 backdrop-blur rounded-full transition-colors ${showSettings ? 'bg-blue-500/20 text-blue-400' : 'bg-black/40 text-slate-400 hover:text-white'}`} title="Settings">
                <Settings className="w-4 h-4" />
             </button>
             {showSettings && (
                 <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-bottom-2">
                     <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">Game Settings</div>
                     
                     {/* Pattern Selector */}
                     <div className="px-3 pb-2 pt-1 border-b border-white/5 mb-1">
                         <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Scenario Pattern</span>
                         <div className="grid grid-cols-2 gap-1">
                             {(['random', 'straight', 'stairs', 'zigzag'] as GenerationPattern[]).map(pat => (
                                 <button 
                                    key={pat}
                                    onClick={() => setTrainingPattern(pat)}
                                    className={`text-[9px] py-1 rounded capitalize ${trainingPattern === pat ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                                 >
                                     {pat}
                                 </button>
                             ))}
                         </div>
                     </div>

                     <button onClick={() => setShowHitbox(!showHitbox)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex justify-between items-center text-xs text-slate-300">
                         <span className="flex items-center gap-2"><Eye className="w-3 h-3"/> Show Hitboxes</span>
                         {showHitbox && <Check className="w-3 h-3 text-green-400" />}
                     </button>

                     <button onClick={() => setShowGhost(!showGhost)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex justify-between items-center text-xs text-slate-300">
                         <span className="flex items-center gap-2"><Ghost className="w-3 h-3"/> Ghost Replay</span>
                         {showGhost && <Check className="w-3 h-3 text-green-400" />}
                     </button>

                     <button onClick={() => setFocusMode(!focusMode)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex justify-between items-center text-xs text-slate-300">
                         <span className="flex items-center gap-2"><MonitorOff className="w-3 h-3"/> Focus Mode (Hide HUD)</span>
                         {focusMode && <Check className="w-3 h-3 text-green-400" />}
                     </button>

                     <button onClick={() => setReducedMotion(!reducedMotion)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex justify-between items-center text-xs text-slate-300">
                         <span className="flex items-center gap-2"><Minimize2 className="w-3 h-3"/> Reduced Motion</span>
                         {reducedMotion && <Check className="w-3 h-3 text-green-400" />}
                     </button>

                     {/* METRONOME SECTION */}
                     <div className="h-px bg-white/5 my-1"></div>
                     <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                         <span>Metronome</span>
                         <span className="text-blue-400">{bpm} BPM</span>
                     </div>
                     <button onClick={() => setMetronomeEnabled(!metronomeEnabled)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex justify-between items-center text-xs text-slate-300 mb-1">
                         <span className="flex items-center gap-2"><Gauge className="w-3 h-3"/> Enable Tick</span>
                         {metronomeEnabled && <Check className="w-3 h-3 text-green-400" />}
                     </button>
                     <div className="px-3 pb-2">
                         <input 
                            type="range" 
                            min="60" 
                            max="600" 
                            step="10" 
                            value={bpm} 
                            onChange={(e) => setBpm(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                         />
                     </div>

                     <div className="h-px bg-white/5 my-1"></div>
                     <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sound</div>

                     <button onClick={() => setClickSoundEnabled(!clickSoundEnabled)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded flex justify-between items-center text-xs text-slate-300">
                         <span>Click SFX</span>
                         {clickSoundEnabled && <Check className="w-3 h-3 text-green-400" />}
                     </button>
                     
                     <div className="grid grid-cols-2 gap-1 px-1">
                        {['default', 'mouse', 'keyboard', 'pop'].map(type => (
                             <button 
                                key={type}
                                onClick={() => { setClickSoundType(type as SoundType); setClickSoundEnabled(true); playSound('click'); }} 
                                className={`text-[10px] py-1 rounded text-center capitalize ${clickSoundType === type ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                             >
                                {type}
                             </button>
                        ))}
                     </div>
                 </div>
             )}
         </div>

         <button 
            onClick={(e) => { e.stopPropagation(); setIsMusicMuted(!isMusicMuted); }}
            className={`p-2 backdrop-blur rounded-full transition-colors ${!isMusicMuted ? 'bg-purple-500/20 text-purple-400' : 'bg-black/40 text-slate-400 hover:text-white'}`}
            title="Music (Techno)"
         >
            {!isMusicMuted ? <Music2 className="w-4 h-4" /> : <Music4 className="w-4 h-4" />}
         </button>

         <button 
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur rounded-full text-slate-400 hover:text-white transition-colors"
            title={isMuted ? "Unmute Master" : "Mute Master"}
         >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
         </button>
      </div>

      {/* START SCREEN */}
      {status === GameStatus.Idle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[2px] z-10 animate-in fade-in duration-300 pointer-events-none">
          <div className="text-center space-y-6 p-8 border border-white/10 bg-black/50 rounded-2xl shadow-2xl backdrop-blur-md max-w-md mx-4 pointer-events-auto">
            <div>
              <div className="flex justify-center gap-2 mb-2">
                 {isMini && <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">Mini Wave Active</span>}
                 {trainingPattern !== 'random' && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{trainingPattern} Mode</span>}
              </div>
              <h2 className="text-5xl font-display font-black text-white mb-2 tracking-tight" style={{ textShadow: `0 0 20px ${gameState.current.baseColor}` }}>
                {difficulty.label.toUpperCase()}
              </h2>
              <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: gameState.current.baseColor, boxShadow: `0 0 10px ${gameState.current.baseColor}` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm font-mono text-slate-400 bg-black/30 p-4 rounded-lg">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500">Goal</span>
                    <span className="text-white font-bold flex items-center justify-center gap-1">
                      {isEndless ? (
                        <>Endless <InfinityIcon className="w-3 h-3" /></>
                      ) : (
                        "15 Seconds"
                      )}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500">Best Time</span>
                    <span className="text-white font-bold flex items-center justify-center gap-1">
                        <Crown className="w-3 h-3 text-yellow-500" />
                        {bestTime > 0 ? `${bestTime}s` : '--'}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 uppercase tracking-widest mb-4">
              <ChevronsUp className="w-4 h-4 animate-bounce" /> Hold {customKey} / Tap to Fly
            </div>

            <button
              onClick={() => { initAudio(); onStatusChange(GameStatus.Playing); }}
              className="group relative w-full py-4 bg-white text-black font-display font-black text-xl rounded hover:scale-[1.02] transition-transform overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              START RUN
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER / WON SCREEN (Unified Dashboard) */}
      {(status === GameStatus.Lost || status === GameStatus.Won) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 animate-in zoom-in-95 duration-200 pointer-events-none p-4">
          <div className="w-full max-w-2xl bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col md:flex-row">
             
             {/* Left: Result Stats */}
             <div className="p-6 md:p-8 flex-grow flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
                 <div className={`absolute inset-0 opacity-10 ${status === GameStatus.Won ? 'bg-yellow-500' : 'bg-red-600'}`}></div>
                 
                 {status === GameStatus.Won ? 
                    <Trophy className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" /> : 
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
                 }
                 
                 <h2 className="text-4xl font-display font-bold text-white mb-1">
                    {status === GameStatus.Won ? 'CLEARED!' : 'CRASHED'}
                 </h2>
                 <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-6">
                    {trainingPattern !== 'random' ? `${trainingPattern} Training` : `${difficulty.label} Mode`}
                 </p>

                 <div className="text-5xl font-mono font-bold text-white mb-2">
                    <span ref={timerRef}>
                        {(gameState.current.startTime ? ((Date.now() - gameState.current.startTime)/1000).toFixed(2) : "0.00")}s
                    </span>
                 </div>
                 
                 {/* ANALYTICS ROW */}
                 <div className="flex justify-center gap-6 mb-6 w-full">
                     <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Consistency</span>
                        <span className={`font-bold text-lg ${gameState.current.consistencyScore > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{consistency}</span>
                     </div>
                     <div className="w-px h-8 bg-white/10"></div>
                     <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">UR (Unstable Rate)</span>
                        <span className="font-bold text-lg text-blue-400">{unstableRate.toFixed(1)}</span>
                     </div>
                     <div className="w-px h-8 bg-white/10"></div>
                     <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Bot Check</span>
                        {(() => {
                            const label = getBotLabel(unstableRate);
                            return label ? <span className={`font-bold text-xs mt-1 ${label.color}`}>{label.label}</span> : <span className="text-xs text-slate-600">--</span>;
                        })()}
                     </div>
                 </div>

                 {/* CPS Graph */}
                 <CpsGraph intervals={finalIntervals} color={status === GameStatus.Won ? '#eab308' : '#ef4444'} />

                 <div className="flex gap-2 w-full mt-auto">
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(GameStatus.Idle);
                        }}
                        className={`flex-1 py-3 font-bold uppercase tracking-widest rounded transition-all cursor-pointer z-50 ${status === GameStatus.Won ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                     >
                        Retry
                     </button>
                     <button onClick={shareScore} className={`px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer z-50 flex items-center justify-center gap-2 font-bold transition-all ${copied ? 'bg-green-500/20 text-green-400' : ''}`}>
                        {copied ? <><Check className="w-5 h-5" /> COPIED</> : <><Share2 className="w-5 h-5" /> SHARE</>}
                     </button>
                 </div>
             </div>

             {/* Right: Local Leaderboard */}
             <div className="w-full md:w-64 bg-slate-900/50 p-6 flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                         <Crown className="w-3 h-3 text-yellow-500" /> Local Top 5
                     </h3>
                     <button onClick={clearLeaderboard} className="text-slate-600 hover:text-red-400 transition-colors" title="Clear History">
                         <Trash2 className="w-3 h-3" />
                     </button>
                 </div>
                 
                 <div className="flex-grow space-y-2">
                     {leaderboard.length === 0 ? (
                         <div className="text-center text-slate-600 text-xs py-8">No records yet.<br/>Be the first!</div>
                     ) : (
                         leaderboard.map((entry, i) => (
                             <div key={entry.id} className="flex justify-between items-center text-xs p-2 rounded bg-white/5 border border-white/5">
                                 <div className="flex items-center gap-2">
                                     <span className={`font-mono font-bold ${i === 0 ? 'text-yellow-400' : 'text-slate-400'}`}>#{i+1}</span>
                                     <span className="text-white font-mono">{entry.time.toFixed(2)}s</span>
                                 </div>
                                 <div className="text-right">
                                     <div className={`font-bold ${parseInt(entry.consistency) > 90 ? 'text-green-500' : 'text-slate-500'}`}>{entry.consistency}</div>
                                     <div className="text-[9px] text-slate-600">{entry.date}</div>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>
             </div>

          </div>
        </div>
      )}
      
       <div className="absolute top-6 left-6 pointer-events-none">
          <div 
            className="px-4 py-2 rounded-sm bg-black/60 backdrop-blur-md border-l-4 text-sm font-bold text-white uppercase tracking-widest shadow-lg mb-2"
            style={{ borderColor: gameState.current.baseColor }}
          >
              {difficulty.label} 
              {isEndless && <span className="text-blue-400 ml-1">(∞)</span>}
              {isMini && <span className="text-purple-400 ml-1">(MINI)</span>}
          </div>
          {bestTime > 0 && (
             <div className="flex items-center gap-1 text-xs text-yellow-500 font-mono bg-black/40 px-2 py-1 rounded">
                <Crown className="w-3 h-3" /> Best: {bestTime}s
             </div>
          )}
      </div>
    </div>
  );
});

export default GameCanvas;