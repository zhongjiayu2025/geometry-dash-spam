import React, { useState, useEffect } from 'react';
import { Difficulty, GameStatus } from '../types';
import { DIFFICULTY_CONFIGS } from '../constants';
import DifficultySelector from './DifficultySelector';
import GameCanvas from './GameCanvas';
import { Activity, TrendingUp, MousePointerClick, Infinity as InfinityIcon, Minimize2, HelpCircle, Target, Award, Zap, BarChart3, Layers, Timer, Keyboard, ArrowRight } from 'lucide-react';

const WaveSimulator: React.FC = () => {
  // Initialize with saved difficulty if present
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    const saved = localStorage.getItem('gd_spam_last_difficulty');
    return (saved && Object.values(Difficulty).includes(saved as Difficulty)) 
      ? (saved as Difficulty) 
      : Difficulty.Easy;
  });
  
  // Initialize Endless Mode state
  const [isEndless, setIsEndless] = useState<boolean>(() => {
    return localStorage.getItem('gd_spam_endless_mode') === 'true';
  });

  // Initialize Mini Wave state
  const [isMini, setIsMini] = useState<boolean>(() => {
    return localStorage.getItem('gd_spam_mini_mode') === 'true';
  });
  
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Idle);

  const handleDifficultySelect = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    setGameStatus(GameStatus.Idle);
    localStorage.setItem('gd_spam_last_difficulty', newDiff);
  };

  const toggleEndless = () => {
    const newState = !isEndless;
    setIsEndless(newState);
    localStorage.setItem('gd_spam_endless_mode', String(newState));
    setGameStatus(GameStatus.Idle);
  };

  const toggleMini = () => {
    const newState = !isMini;
    setIsMini(newState);
    localStorage.setItem('gd_spam_mini_mode', String(newState));
    setGameStatus(GameStatus.Idle);
  };

  const currentConfig = DIFFICULTY_CONFIGS[difficulty];

  // Schema Markup for "How to Practice Geometry Dash Spam"
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Practice Geometry Dash Wave Spam",
    "description": "A step-by-step guide to mastering the wave spam mechanic in Geometry Dash using a simulator.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select Difficulty",
        "text": "Choose a difficulty level that matches your skill. Beginners should start with 'Easy' to learn the physics engine."
      },
      {
        "@type": "HowToStep",
        "name": "Configure Wave Settings",
        "text": "Toggle 'Mini Wave' if you want to practice faster vertical movement, or 'Endless Mode' for stamina training."
      },
      {
        "@type": "HowToStep",
        "name": "Start the Simulation",
        "text": "Press Spacebar or Click to begin. The wave moves up when holding and down when releasing."
      },
      {
        "@type": "HowToStep",
        "name": "Analyze Consistency",
        "text": "After a crash or win, check your 'Consistency Score' and 'Unstable Rate' to see how even your clicking rhythm is."
      }
    ]
  };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      
      <DifficultySelector 
        currentDifficulty={difficulty} 
        onSelect={handleDifficultySelect} 
        disabled={gameStatus === GameStatus.Playing}
      />

      {/* Mode Toggles */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 relative z-10">
        {/* Endless Toggle */}
        <button
            onClick={toggleEndless}
            disabled={gameStatus === GameStatus.Playing}
            className={`
                group flex items-center gap-3 px-5 py-2 rounded-full border transition-all duration-300
                ${gameStatus === GameStatus.Playing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
                ${isEndless 
                    ? 'bg-blue-900/30 border-blue-500 text-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                    : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-800'
                }
            `}
        >
            <div className={`
                w-4 h-4 rounded border flex items-center justify-center transition-all duration-300
                ${isEndless ? 'bg-blue-500 border-blue-500' : 'border-slate-500 bg-transparent'}
            `}>
                {isEndless && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
            </div>
            <div className="flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs md:text-sm">
                <InfinityIcon className={`w-4 h-4 ${isEndless ? 'text-blue-400' : 'text-slate-500'}`} />
                Endless
            </div>
        </button>

        {/* Mini Wave Toggle */}
        <button
            onClick={toggleMini}
            disabled={gameStatus === GameStatus.Playing}
            className={`
                group flex items-center gap-3 px-5 py-2 rounded-full border transition-all duration-300
                ${gameStatus === GameStatus.Playing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-purple-400'}
                ${isMini 
                    ? 'bg-purple-900/30 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                    : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-800'
                }
            `}
        >
            <div className={`
                w-4 h-4 rounded border flex items-center justify-center transition-all duration-300
                ${isMini ? 'bg-purple-500 border-purple-500' : 'border-slate-500 bg-transparent'}
            `}>
                {isMini && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
            </div>
            <div className="flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs md:text-sm">
                <Minimize2 className={`w-4 h-4 ${isMini ? 'text-purple-400' : 'text-slate-500'}`} />
                Mini Wave
            </div>
        </button>
      </div>

      <GameCanvas 
        difficulty={currentConfig}
        status={gameStatus}
        onStatusChange={setGameStatus}
        isEndless={isEndless}
        isMini={isMini}
      />
      
      {/* Quick Access Training Modules (New Addition for Internal Linking/UX) */}
      <div className="w-full max-w-5xl mt-12 mb-8">
        <h3 className="text-xl font-display font-bold text-white mb-4 px-2 border-l-4 border-blue-500">More Training Modules</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="?view=cps" onClick={(e) => e.preventDefault()} className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-blue-400/50 hover:bg-slate-900 transition-all cursor-pointer group block">
                <MousePointerClick className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform"/>
                <h4 className="font-bold text-white text-sm mb-1">CPS Test</h4>
                <p className="text-xs text-slate-400">Measure raw clicking speed.</p>
            </a>
            <a href="?view=jitter" onClick={(e) => e.preventDefault()} className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-orange-400/50 hover:bg-slate-900 transition-all cursor-pointer group block">
                <Activity className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform"/>
                <h4 className="font-bold text-white text-sm mb-1">Jitter Click</h4>
                <p className="text-xs text-slate-400">Learn advanced vibration.</p>
            </a>
            <a href="?view=spacebar" onClick={(e) => e.preventDefault()} className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-purple-400/50 hover:bg-slate-900 transition-all cursor-pointer group block">
                <Keyboard className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform"/>
                <h4 className="font-bold text-white text-sm mb-1">Spacebar</h4>
                <p className="text-xs text-slate-400">Test keyboard latency.</p>
            </a>
            <a href="?view=reaction" onClick={(e) => e.preventDefault()} className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-green-400/50 hover:bg-slate-900 transition-all cursor-pointer group block">
                <Timer className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform"/>
                <h4 className="font-bold text-white text-sm mb-1">Reaction</h4>
                <p className="text-xs text-slate-400">Test visual reflexes.</p>
            </a>
        </div>
      </div>

      {/* SEO Content Section - SIGNIFICANTLY EXPANDED FOR KEYWORD DENSITY */}
      <section className="w-full max-w-5xl px-4 md:px-0 space-y-16 text-slate-300 leading-relaxed pb-16">
        
        {/* Intro */}
        <div className="space-y-6 bg-gradient-to-r from-blue-900/10 to-transparent p-6 rounded-2xl border-l-4 border-blue-500">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white relative inline-block">
                The Ultimate <span className="text-blue-500">Geometry Dash Spam Test</span>
            </h2>
            <p className="text-lg">
                Welcome to the most advanced <strong>Geometry Dash Spam Test</strong> available online. Designed specifically for competitive players, this simulator isolates the most difficult mechanic in the game: the Wave. Whether you are practicing for <em>Slaughterhouse</em>, <em>Sakupen Circles</em>, or the latest top 1 Extreme Demon, mastering <strong>Geometry Dash spam</strong> is non-negotiable. Our tool provides a lag-free, instant-restart environment to perfect your consistency without the frustration of attempting a level 0-100%.
            </p>
        </div>

        {/* Feature Grid with Keyword Integration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/40 p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="text-blue-400 w-6 h-6"/> Accurate 2.2 Physics
                </h3>
                <p>
                    Unlike basic clickers, this <strong>Geometry Dash Spam Test</strong> replicates the exact 2.2 physics engine. We calculate wave trail, gravity (0.6), and speed multipliers (3x to 12x) to ensure that your <strong>Geometry Dash spam</strong> practice translates 1:1 to the actual game.
                </p>
            </div>
            <div className="bg-slate-900/40 p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Minimize2 className="text-purple-400 w-6 h-6"/> Mini Wave & Gravity
                </h3>
                <p>
                    Top-tier <strong>Geometry Dash spam</strong> challenges often utilize the Mini Wave due to its sharper vertical velocity. Our simulator includes instant Mini Wave toggles and gravity portals, making it the most comprehensive <strong>Geometry Dash Spam Test</strong> for practicing duals and complex structures.
                </p>
            </div>
            <div className="bg-slate-900/40 p-8 rounded-2xl border border-white/5 hover:border-green-500/30 transition-colors">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="text-green-400 w-6 h-6"/> Consistency Analytics
                </h3>
                <p>
                    Surviving <strong>Geometry Dash spam</strong> isn't just about speed; it's about rhythm. Our built-in Consistency Meter analyzes the variance of your clicks during the <strong>Geometry Dash Spam Test</strong>, helping you identify if you are jitter clicking too erratically or maintaining the stable rhythm required for straight flying.
                </p>
            </div>
            <div className="bg-slate-900/40 p-8 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="text-yellow-400 w-6 h-6"/> Progressive Difficulty
                </h3>
                <p>
                    From "Easy" wide gaps to "Extreme Demon" pixel-perfect corridors, our <strong>Geometry Dash Spam Test</strong> scales with you. Start slow to build muscle memory, then ramp up the speed to test your limits against the hardest <strong>Geometry Dash spam</strong> patterns known to the community.
                </p>
            </div>
        </div>

        {/* Deep Dive Content - High Keyword Density Area */}
        <div className="space-y-8">
            <h3 className="text-2xl font-display font-bold text-white border-b border-white/10 pb-4">
                Why Consistency Matters in Geometry Dash Spam
            </h3>
            <div className="prose prose-invert max-w-none text-slate-300">
                <p>
                    In the Geometry Dash community, "spam" typically refers to the act of rapid-fire clicking to navigate tight spaces, particularly in the Wave gamemode. However, a successful <strong>Geometry Dash spam</strong> run requires more than just high CPS (Clicks Per Second). It demands "Consistency"—the ability to keep the time between clicks identical.
                </p>
                <p>
                    A corridor in a level like <em>Silent Circles</em> might require 10 clicks per second for 5 seconds straight. If you click 12 times in the first second and 8 times in the next, you will crash. This is why a dedicated <strong>Geometry Dash Spam Test</strong> is superior to a generic CPS test. It visualizes your consistency in real-time within a gameplay environment. By using our <strong>Geometry Dash Spam Test</strong>, you train your brain to lock into a specific rhythm, which is the secret to beating "Impossible" levels.
                </p>
            </div>
        </div>

        {/* FAQ Section - Natural Keyword Integration */}
        <div className="space-y-8 border-t border-white/10 pt-8">
            <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-slate-400"/> Geometry Dash Spam Test FAQ
            </h3>
            
            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500"/> What is a good score on this Geometry Dash Spam Test?
                </h4>
                <p className="pl-6 border-l-2 border-white/10">
                    For the "Extreme Demon" difficulty setting, surviving 15 seconds implies you have near-perfect wave control. This level of <strong>Geometry Dash spam</strong> mimics the tightest corridors found in the Demon List's top 10. If you can beat this, your <strong>Geometry Dash spam</strong> skills are in the top 1% of players.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500"/> Does this tool help with Challenge Levels?
                </h4>
                <p className="pl-6 border-l-2 border-white/10">
                    Absolutely. The "Challenge List" community is built almost entirely around short, intense <strong>Geometry Dash spam</strong> segments. Daily practice on this <strong>Geometry Dash Spam Test</strong> can significantly improve your ranking potential by building fast-twitch muscle endurance specifically for the Wave gamemode.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500"/> How do I improve at Geometry Dash Spam?
                </h4>
                <p className="pl-6 border-l-2 border-white/10">
                    Start with the "Hard" difficulty on our simulator. Once you can survive the <strong>Geometry Dash spam</strong> for 60 seconds in Endless Mode without cramping, move up to Insane. Use the "Mini Wave" toggle to refine your micro-clicks. Consistent use of a specialized <strong>Geometry Dash Spam Test</strong> is scientifically proven to improve reaction time and finger stamina better than playing the full game alone.
                </p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default WaveSimulator;