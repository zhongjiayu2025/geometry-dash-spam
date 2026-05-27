import PollingRateTest from "../../components/PollingRateTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mouse Polling Rate Checker | Hz Test",
    description: "Check your mouse polling rate in Hz. Ensure your gaming mouse is running at 1000Hz or higher for optimal performance in Geometry Dash.",
};

export default function PollingRatePage() {
    return (
        <>
            <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl uppercase">
                    MOUSE HZ CHECKER
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                    Measure your mouse polling rate to discover its true USB report capability.
                </p>
            </div>
            <PollingRateTest />
        </>
    );
}
