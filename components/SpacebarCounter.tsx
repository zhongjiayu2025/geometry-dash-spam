import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard, RotateCcw, Zap, Target, ArrowRight, MousePointerClick, Activity } from 'lucide-react';

const SpacebarCounter: React.FC = () => {
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10.00);
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startTest = useCallback(() => {
    setActive(true);
    setFinished(false);
    setCount(1);
    setTimeLeft(10.00);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault(); // Prevent scrolling
      if (e.repeat) return; // Ignore holding down

      setIsPressed(true);

      if (finished) return;
      
      if (!active) {
        startTest();
        return;
      }
      setCount(c => c + 1);
    }
  }, [active, finished, startTest]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (active && !finished) {
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, 10 - elapsed);
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          setFinished(true);
          setActive(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 10);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, finished]);

  const reset = () => {
    setActive(false);
    setFinished(false);
    setCount(0);
    setTimeLeft(10.00);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Display */}
      <div className="relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center overflow-hidden mb-8">
        
        <div className="relative z-10">
          <div className="mb-12">
            <h2 className="text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Spacebar Presses</h2>
            <div className="text-8xl md:text-9xl font-display font-black text-white tracking-tighter drop-shadow-2xl">
              {count}
            </div>
          </div>

          {/* Visual Spacebar */}
          <div className="flex justify-center mb-8">
            <div 
              className={`
                w-full max-w-md h-24 rounded-lg border-b-8 transition-all duration-75 flex items-center justify-center
                ${isPressed 
                  ? 'bg-purple-500 border-purple-700 translate-y-2 shadow-none' 
                  : 'bg-slate-200 border-slate-400 shadow-[0_10px_20px_rgba(0,0,0,0.5)] translate-y-0'
                }
              `}
            >
              <span className={`font-bold text-xl uppercase tracking-widest ${isPressed ? 'text-white' : 'text-slate-500'}`}>Space</span>
            </div>
          </div>

          {!active && !finished && (
            <p className="text-purple-400 animate-pulse font-mono">Press SPACE to Start 10s Timer</p>
          )}
           
          {active && (
            <p className="text-slate-500 font-mono">Time Remaining: <span className="text-white font-bold">{timeLeft.toFixed(2)}s</span></p>
          )}

          {finished && (
             <div className="animate-in fade-in zoom-in duration-300">
                <p className="text-xl text-white font-bold mb-4">Time's Up! Speed: <span className="text-purple-400">{(count / 10).toFixed(2)} CPS</span></p>
                <button 
                  onClick={reset}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg inline-flex items-center gap-2 transition-colors shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" /> RESET COUNTER
                </button>
             </div>
          )}
        </div>

        {/* Background Decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5 flex flex-col items-center">
             <Keyboard className="w-8 h-8 text-purple-500 mb-2" />
             <span className="text-slate-400 text-xs uppercase">Key</span>
             <span className="text-white font-bold">SPACEBAR</span>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5 flex flex-col items-center">
             <Zap className="w-8 h-8 text-yellow-500 mb-2" />
             <span className="text-slate-400 text-xs uppercase">Speed (CPS)</span>
             <span className="text-white font-bold">{finished ? (count / 10).toFixed(2) : (active && timeLeft < 10 ? (count / (10 - timeLeft)).toFixed(2) : '0.00')}</span>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-xl border border-white/5 flex flex-col items-center">
             <RotateCcw className="w-8 h-8 text-blue-500 mb-2 cursor-pointer hover:rotate-180 transition-transform" onClick={reset} />
             <span className="text-slate-400 text-xs uppercase">Reset</span>
             <span className="text-white font-bold">MANUAL</span>
          </div>
      </div>

      {/* SEO CONTENT SECTION */}
      <section className="space-y-12 pb-12">
          
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 md:p-12">
             <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
                 <Keyboard className="w-8 h-8 text-purple-500"/> Why is the Spacebar King in Geometry Dash?
             </h2>
             <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                 <p>
                     While the mouse allows for micro-adjustments in ship flying, the <strong>spacebar</strong> is often preferred for "Endurance Spam" sections in Geometry Dash. This is because the thumb is the strongest digit on the human hand, capable of sustaining repetitive motion longer than the index finger without cramping.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                     <div>
                         <h4 className="text-white font-bold mb-2">Advantages of Spacebar Spam:</h4>
                         <ul className="list-disc pl-5 space-y-2 text-sm">
                             <li><strong>Higher Stamina:</strong> The thumb has more muscle mass.</li>
                             <li><strong>Mechanical Switches:</strong> Keyboards often have faster actuation points (e.g., Cherry MX Silver) compared to standard mouse switches.</li>
                             <li><strong>Stability:</strong> Pressing a keyboard key doesn't move your crosshair/aim like clicking a mouse might.</li>
                         </ul>
                     </div>
                     <div>
                         <h4 className="text-white font-bold mb-2">When to use it:</h4>
                         <p className="text-sm">
                             Use the spacebar for long, straight wave corridors or UFO sections where rhythm is key. Avoid it for rapid direction changes where the travel distance of the key (3-4mm) might be too slow compared to a mouse click (0.5mm).
                         </p>
                     </div>
                 </div>
             </div>
          </div>

          {/* Internal Linking / Related Tools */}
          <div className="border-t border-white/10 pt-8">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500"/> Improve Your Mechanics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a href="#" onClick={(e) => { e.preventDefault(); (window as any).history.pushState(null, '', '/cps-test'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0,0); }} className="group block bg-slate-900/40 border border-white/5 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400"><MousePointerClick className="w-6 h-6"/></div>
                          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors"/>
                      </div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Mouse CPS Test</h4>
                      <p className="text-xs text-slate-400">Compare your thumb speed to your index finger speed.</p>
                  </a>

                  <a href="#" onClick={(e) => { e.preventDefault(); (window as any).history.pushState(null, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0,0); }} className="group block bg-slate-900/40 border border-white/5 rounded-xl p-6 hover:border-green-500/50 transition-all">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-green-900/20 rounded-lg text-green-400"><Target className="w-6 h-6"/></div>
                          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-green-400 transition-colors"/>
                      </div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">Wave Simulator</h4>
                      <p className="text-xs text-slate-400">Put your spacebar spam to the test in a real scenario.</p>
                  </a>

                   <a href="#" onClick={(e) => { e.preventDefault(); (window as any).history.pushState(null, '', '/reaction-test'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0,0); }} className="group block bg-slate-900/40 border border-white/5 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-yellow-900/20 rounded-lg text-yellow-400"><Zap className="w-6 h-6"/></div>
                          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-yellow-400 transition-colors"/>
                      </div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Reaction Time</h4>
                      <p className="text-xs text-slate-400">Is your keyboard adding latency? Check your input delay.</p>
                  </a>
              </div>
          </div>
      </section>

    </div>
  );
};

export default SpacebarCounter;