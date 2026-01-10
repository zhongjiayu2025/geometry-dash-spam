import SpacebarCounter from "../../components/SpacebarCounter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Spacebar Counter | Keyboard Latency & Speed Test",
    description: "Accurate Spacebar speed test. Measure your thumb endurance and keyboard switch latency for rhythm games.",
};

export default function SpacebarCounterPage() {
    return (
        <>
            <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl uppercase">
                    SPACEBAR COUNTER
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                    Test your keyboard latency and spamming capability.
                </p>
            </div>
            <SpacebarCounter />
        </>
    );
}