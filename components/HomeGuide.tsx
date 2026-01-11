
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
        "name": "Why is a Geometry Dash Spam Test important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Taking a Geometry Dash Spam Test helps you measure your consistency and raw CPS (clicks per second). Mastering Geometry Dash spam is essential for beating Extreme Demons like Slaughterhouse."
        }
      },
      {
        "@type": "Question",
        "name": "What is the hardest Geometry Dash Spam level?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "As of 2026, the wave spam in 'Acheron' and the challenge level 'VSC' are considered the pinnacle of difficulty. They require elite Geometry Dash spam skills with near-zero error margin."
        }
      },
      {
        "@type": "Question",
        "name": "How does this Geometry Dash Spam Test work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our Geometry Dash Spam Test simulator replicates the 2.2 physics engine, allowing you to practice wave spam patterns without the loading times of the actual game."
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
          Mastering the <strong>Geometry Dash spam</strong> mechanic is the gateway from casual play to the Extreme Demon difficulty. Whether it's the tight corridors of <em>Slaughterhouse</em> or the endurance runs of <em>The Golden</em>, raw <Link href="/cps-test" className="text-blue-400 hover:underline">Click Speed (CPS)</Link> is useless without control. This guide explains how our **Geometry Dash Spam Test** can help you perfect your technique.
        </p>
      </div>

      {/* Physics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
         <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
               <Cpu className="w-6 h-6 text-purple-400" />
               Physics of Geometry Dash Spam
            </h3>
            <p>
               To pass any <strong>Geometry Dash spam test</strong>, you must understand the discrete physics engine. Every "tick", the game calculates the player's position.
            </p>
            <ul className="space-y-4">
               <li className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                  <strong className="text-white block mb-1">Gravity & Velocity</strong>
                  The wave gamemode typically has a gravity value of roughly <code className="text-purple-300">0.6</code>. When holding, vertical velocity increases linearly. Our <strong>Geometry Dash Spam Test</strong> simulator replicates this acceleration curve to 99% accuracy.
               </li>
               <li className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                  <strong className="text-white block mb-1">Slope Interaction (2.2 Update)</strong>
                  In 2.1, hitting a slope often resulted in death. Update 2.2 introduced "slide physics" to <strong>Geometry Dash spam</strong>, allowing for "gliding" on surfaces. This changed the meta from "don't touch anything" to "controlled sliding".
               </li>
            </ul>
         </div>

         <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
               <Monitor className="w-6 h-6 text-green-400" />
               Hz Advantage in GD Spam
            </h3>
            <p>
               Why do top players use high refresh rate monitors for <strong>Geometry Dash spam</strong>? It provides more visual feedback frames.
            </p>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-16 font-bold text-slate-500 text-right">60Hz</div>
                    <div>
                       <div className="h-2 w-full bg-slate-800 rounded-full mb-1 overflow-hidden"><div className="h-full w-[16%] bg-red-500"></div></div>
                       <p className="text-xs text-slate-400">16.6ms input delay. Hard for precise Geometry Dash spam.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-16 font-bold text-slate-500 text-right">144Hz</div>
                    <div>
                       <div className="h-2 w-full bg-slate-800 rounded-full mb-1 overflow-hidden"><div className="h-full w-[40%] bg-yellow-500"></div></div>
                       <p className="text-xs text-slate-400">6.9ms input delay. The standard for passing a spam test.</p>
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
               Note: Check your visual reaction speed with our <Link href="/reaction-test" className="text-blue-400 hover:underline">Reaction Time Test</Link> to see if your hardware is holding back your **Geometry Dash spam** potential.
            </p>
         </div>
      </div>

      {/* Techniques Deep Dive */}
      <div className="space-y-8">
         <h3 className="text-2xl font-display font-bold text-white border-b border-white/10 pb-4">
            Clicking Techniques for Geometry Dash Spam
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                 <MousePointer2 className="w-8 h-8 text-blue-500 mb-4" />
                 <h4 className="font-bold text-white mb-2">1. Normal Clicking</h4>
                 <p className="text-sm text-slate-400 mb-4">Using one finger. Best for accuracy in a controlled <strong>Geometry Dash spam test</strong>.</p>
                 <div className="text-xs font-mono text-slate-500">
                    <div>Max Speed: ~7-9 CPS</div>
                    <div>Control: High</div>
                    <div>Risk: Low</div>
                 </div>
             </div>
             
             <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors">
                 <Activity className="w-8 h-8 text-orange-500 mb-4" />
                 <h4 className="font-bold text-white mb-2">2. Jitter Clicking</h4>
                 <p className="text-sm text-slate-400 mb-4">Vibrating forearm muscles. Essential for high speed <strong>Geometry Dash spam</strong>.</p>
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
                 <p className="text-sm text-slate-400 mb-4">Alternating two fingers. The modern meta for passing any <strong>spam test</strong>.</p>
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
                  Most players focus on raw speed (CPS) during a <strong>Geometry Dash spam test</strong>, but the game is actually about <strong>rhythm</strong>. If you are clicking at 10 CPS, but the gap between your clicks varies, your wave trail will become unstable.
              </p>
              <p>
                  This instability causes you to clip the top or bottom spikes in tight corridors. Our simulator's "Consistency Score" measures the standard deviation of your click intervals, making it the most advanced <strong>Geometry Dash spam</strong> tool available.
              </p>
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
                    What is the best mouse for Geometry Dash Spam?
                </h4>
                <p className="text-sm text-slate-400 pl-6 border-l-2 border-white/10">
                    Lightweight mice with low click latency are best for <strong>Geometry Dash spam</strong>. The <strong>Razer Viper 8K</strong> and <strong>Logitech G Pro X Superlight</strong> are top choices.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0"/> 
                    Is the spacebar better for Spam Tests?
                </h4>
                <p className="text-sm text-slate-400 pl-6 border-l-2 border-white/10">
                    Generally, the spacebar is slower for rapid direction changes due to higher "travel distance". However, for an endurance **Geometry Dash spam test**, the thumb is stronger. Check your keyboard speed on our <Link href="/spacebar-counter" className="text-blue-400 hover:underline">Spacebar Counter</Link>.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0"/> 
                    How do I improve my Spam Consistency?
                </h4>
                <p className="text-sm text-slate-400 pl-6 border-l-2 border-white/10">
                   Practice is key. Use our <strong>Geometry Dash Spam Test</strong> simulator daily on "Endless Mode" to build muscle memory without tensing your arm.
                </p>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0"/> 
                    Does this Spam Test work on mobile?
                </h4>
                <p className="text-sm text-slate-400 pl-6 border-l-2 border-white/10">
                    Yes. Our <strong>Geometry Dash Spam</strong> simulator is optimized for 120Hz mobile screens, making it the perfect portable training tool.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HomeGuide;
