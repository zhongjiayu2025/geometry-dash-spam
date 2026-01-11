
import React from 'react';
import Link from 'next/link';
import { Zap, Activity, MousePointer2, Monitor, HelpCircle, Layers, Cpu, TrendingUp } from 'lucide-react';

const HomeGuide: React.FC = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why is high Hz important for Geometry Dash spam?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Higher refresh rates (144Hz, 240Hz, 360Hz) reduce input latency and provide more visual feedback frames. This allows players to perform micro-adjustments in the wave gamemode that are mathematically impossible or extremely luck-based on 60Hz."
        }
      },
      {
        "@type": "Question",
        "name": "What is the hardest spam part in Geometry Dash?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "As of 2026, the wave spam in 'Acheron' and the challenge level 'VSC' are considered the pinnacle of difficulty. They require clicking consistencies of over 12 CPS with near-zero error margin."
        }
      },
      {
        "@type": "Question",
        "name": "How does 2.2 physics affect wave spam?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Update 2.2 changed how hitboxes interact with slopes. While the core gravity remains similar, the collision detection is slightly more forgiving on slopes, making 'sliding' spam techniques more viable than in 2.1."
        }
      }
    ]
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 space-y-16 text-slate-300 leading-relaxed pb-16 pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* Introduction */}
      <div className="space-y-6 bg-gradient-to-r from-blue-900/10 to-transparent p-8 rounded-2xl border-l-4 border-blue-500 backdrop-blur-sm">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white relative inline-block">
          The Definitive Guide to <span className="text-blue-500">Geometry Dash Spam</span>
        </h2>
        <p className="text-lg">
          Mastering the "Spam" mechanic is the gateway from casual play to the Extreme Demon difficulty. Whether it's the tight corridors of <em>Slaughterhouse</em> or the endurance runs of <em>The Golden</em>, raw <Link href="/cps-test" className="text-blue-400 hover:underline">Click Speed (CPS)</Link> is useless without <strong>control</strong> and <strong>physics knowledge</strong>. This guide breaks down the science behind the wave.
        </p>
      </div>

      {/* Physics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
         <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
               <Cpu className="w-6 h-6 text-purple-400" />
               Physics Engine Analysis: 2.1 vs 2.2
            </h3>
            <p>
               Geometry Dash operates on a discrete physics engine. Every "tick", the game calculates the player's position.
            </p>
            <ul className="space-y-4">
               <li className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                  <strong className="text-white block mb-1">Gravity & Velocity</strong>
                  The wave gamemode typically has a gravity value of roughly <code className="text-purple-300">0.6</code> (depending on speed). When holding, vertical velocity increases linearly. When releasing, it decreases. Our <Link href="/" className="text-blue-400 hover:underline">Wave Simulator</Link> replicates this acceleration curve to 99% accuracy.
               </li>
               <li className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                  <strong className="text-white block mb-1">Slope Interaction (2.2 Update)</strong>
                  In 2.1, hitting a slope hitbox often resulted in instant death if the angle wasn't perfect. Update 2.2 introduced "slide physics" to the wave, allowing for "gliding" on surfaces. This changed the spam meta from "don't touch anything" to "controlled sliding".
               </li>
            </ul>
         </div>

         <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
               <Monitor className="w-6 h-6 text-green-400" />
               The "Hz" Advantage: 60 vs 360
            </h3>
            <p>
               Why do top players spend thousands on 360Hz monitors? It's not just for smooth visuals.
            </p>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-16 font-bold text-slate-500 text-right">60Hz</div>
                    <div>
                       <div className="h-2 w-full bg-slate-800 rounded-full mb-1 overflow-hidden"><div className="h-full w-[16%] bg-red-500"></div></div>
                       <p className="text-xs text-slate-400">16.6ms input delay window. Hard for precise spam.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-16 font-bold text-slate-500 text-right">144Hz</div>
                    <div>
                       <div className="h-2 w-full bg-slate-800 rounded-full mb-1 overflow-hidden"><div className="h-full w-[40%] bg-yellow-500"></div></div>
                       <p className="text-xs text-slate-400">6.9ms input delay. The standard for insane demons.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-16 font-bold text-white text-right">360Hz</div>
                    <div>
                       <div className="h-2 w-full bg-slate-800 rounded-full mb-1 overflow-hidden"><div className="h-full w-[100%] bg-green-500"></div></div>
                       <p className="text-xs text-slate-400">2.7ms input delay. Essential for frame-perfect spam.</p>
                    </div>
                </div>
            </div>
            <p className="text-sm text-slate-400 italic mt-4">
               Note: Check your own visual reaction speed with our <Link href="/reaction-test" className="text-blue-400 hover:underline">Reaction Time Test</Link> to see if your hardware is holding you back.
            </p>
         </div>
      </div>

      {/* Techniques Deep Dive */}
      <div className="space-y-8">
         <h3 className="text-2xl font-display font-bold text-white border-b border-white/10 pb-4">
            Clicking Techniques for Spam Consistency
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                 <MousePointer2 className="w-8 h-8 text-blue-500 mb-4" />
                 <h4 className="font-bold text-white mb-2">1. Normal Clicking</h4>
                 <p className="text-sm text-slate-400 mb-4">Using one finger. Best for accuracy and control.</p>
                 <div className="text-xs font-mono text-slate-500">
                    <div>Max Speed: ~7-9 CPS</div>
                    <div>Control: High</div>
                    <div>Risk: Low</div>
                 </div>
             </div>
             
             <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors">
                 <Activity className="w-8 h-8 text-orange-500 mb-4" />
                 <h4 className="font-bold text-white mb-2">2. Jitter Clicking</h4>
                 <p className="text-sm text-slate-400 mb-4">Vibrating forearm muscles. Essential for high speed.</p>
                 <div className="text-xs font-mono text-slate-500">
                    <div>Max Speed: ~10-15 CPS</div>
                    <div>Control: Low</div>
                    <div>Risk: High (RSI)</div>
                 </div>
                 <Link href="/jitter-click" className="mt-4 block text-xs text-blue-400 hover:text-white uppercase font-bold tracking-wider">Learn Jitter →</Link>
             </div>

             <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors">
                 <Layers className="w-8 h-8 text-pink-500 mb-4" />
                 <h4 className="font-bold text-white mb-2">3. Butterfly Clicking</h4>
                 <p className="text-sm text-slate-400 mb-4">Alternating two fingers. The modern meta.</p>
                 <div className="text-xs font-mono text-slate-500">
                    <div>Max Speed: ~15-25 CPS</div>
                    <div>Control: Medium</div>
                    <div>Risk: Medium</div>
                 </div>
                 <Link href="/butterfly-click" className="mt-4 block text-xs text-blue-400 hover:text-white uppercase font-bold tracking-wider">Learn Butterfly →</Link>
             </div>
         </div>
      </div>

      {/* Consistency Analysis */}
      <div className="bg-slate-900/50 rounded-2xl p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              The Secret Metric: "Consistency Variance"
          </h3>
          <div className="prose prose-invert max-w-none text-slate-300">
              <p>
                  Most players focus on raw speed (CPS), but Geometry Dash spam is about <strong>rhythm</strong>. If you are clicking at 10 CPS, but the gap between your clicks varies (e.g., 90ms, then 110ms, then 85ms), your wave trail will become unstable.
              </p>
              <p>
                  This instability causes you to clip the top or bottom spikes in tight corridors. Our simulator's "Consistency Score" measures the standard deviation of your click intervals. A score of 100% means perfect metronomic precision.
              </p>
              <div className="flex gap-4 mt-6">
                  <div className="flex-1 bg-black/30 p-4 rounded-lg border border-white/5">
                      <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Bad Consistency</div>
                      <div className="h-8 flex items-end gap-1">
                          <div className="w-1/6 bg-red-500/50 h-[40%]"></div>
                          <div className="w-1/6 bg-red-500/50 h-[80%]"></div>
                          <div className="w-1/6 bg-red-500/50 h-[30%]"></div>
                          <div className="w-1/6 bg-red-500/50 h-[90%]"></div>
                          <div className="w-1/6 bg-red-500/50 h-[50%]"></div>
                          <div className="w-1/6 bg-red-500/50 h-[20%]"></div>
                      </div>
                  </div>
                  <div className="flex-1 bg-black/30 p-4 rounded-lg border border-white/5">
                      <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Good Consistency</div>
                      <div className="h-8 flex items-end gap-1">
                          <div className="w-1/6 bg-green-500/50 h-[60%]"></div>
                          <div className="w-1/6 bg-green-500/50 h-[62%]"></div>
                          <div className="w-1/6 bg-green-500/50 h-[58%]"></div>
                          <div className="w-1/6 bg-green-500/50 h-[61%]"></div>
                          <div className="w-1/6 bg-green-500/50 h-[59%]"></div>
                          <div className="w-1/6 bg-green-500/50 h-[60%]"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8 border-t border-white/10 pt-8">
        <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-slate-400"/> Technical FAQ
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0"/> 
                    What is the best mouse for spam?
                </h4>
                <p className="text-sm text-slate-400 pl-6 border-l-2 border-white/10">
                    Lightweight mice with low click latency are best. The <strong>Razer Viper 8K</strong> (8000Hz polling) and <strong>Logitech G Pro X Superlight</strong> are top choices. Avoid heavy office mice as they cause fatigue.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0"/> 
                    Is the spacebar faster than the mouse?
                </h4>
                <p className="text-sm text-slate-400 pl-6 border-l-2 border-white/10">
                    Generally, the spacebar is slower for rapid direction changes due to higher "travel distance" (3-4mm vs 0.5mm on a mouse). However, the thumb is stronger for endurance. Check your keyboard speed on our <Link href="/spacebar-counter" className="text-blue-400 hover:underline">Spacebar Counter</Link>.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0"/> 
                    How do I stop my hand from hurting?
                </h4>
                <p className="text-sm text-slate-400 pl-6 border-l-2 border-white/10">
                    Pain indicates bad technique. You are likely tensing your shoulder or wrist too much. Try lowering your desk height or switching to a "Jitter" technique that uses arm muscles instead of wrist tendons.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0"/> 
                    Does this simulator work on mobile?
                </h4>
                <p className="text-sm text-slate-400 pl-6 border-l-2 border-white/10">
                    Yes. 120Hz mobile screens are excellent for Geometry Dash. However, touch input has inherently higher latency than a wired mouse.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HomeGuide;
