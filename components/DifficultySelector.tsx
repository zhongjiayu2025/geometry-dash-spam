import React, { memo } from 'react';
import { Difficulty, DifficultyConfig } from '../types';
import { DIFFICULTY_CONFIGS } from '../constants';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  disabled: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = memo(function DifficultySelector({ currentDifficulty, onSelect, disabled }) {
  const activeConfig = DIFFICULTY_CONFIGS[currentDifficulty];

  return (
    <div className="w-full max-w-5xl mx-auto mb-4 md:mb-7 relative z-20">
      {/* Container */}
      <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 p-2 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl overflow-x-auto overscroll-x-contain">
        {Object.values(DIFFICULTY_CONFIGS).map((config: DifficultyConfig) => {
          const isSelected = currentDifficulty === config.id;
          
          return (
            <button
              key={config.id}
              onClick={() => onSelect(config.id)}
              disabled={disabled}
              className={`
                relative shrink-0 px-3 py-2 md:px-6 md:py-3 rounded-xl font-display font-bold text-[11px] md:text-sm tracking-wider uppercase transition-all duration-300
                overflow-hidden group
                ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
                ${isSelected 
                  ? 'text-black shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-105' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
              style={{
                backgroundColor: isSelected ? config.color : 'transparent',
                boxShadow: isSelected ? `0 0 25px ${config.color}50` : 'none',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {config.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Description Tag */}
      <div className="flex justify-center mt-2 md:mt-4">
        <div 
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border bg-black/50 backdrop-blur-sm transition-colors duration-500"
          style={{ borderColor: `${activeConfig.color}40` }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeConfig.color }}></span>
          <span className="text-xs md:text-sm text-slate-300 font-medium">
             {activeConfig.description}
          </span>
          <span className="hidden sm:block w-px h-3 bg-white/10 mx-1"></span>
          <span className="hidden sm:inline text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">
            Speed: {activeConfig.speed} / Gap: {activeConfig.gap}px
          </span>
        </div>
      </div>
    </div>
  );
});

export default DifficultySelector;