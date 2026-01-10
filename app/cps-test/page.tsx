import CpsTest from "../../components/CpsTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CPS Test 10 Seconds | Click Speed Test for Gamers",
    description: "Test your clicking speed in 10 seconds. The ultimate CPS test for Geometry Dash and Minecraft players. Measure raw clicks per second.",
};

export default function CpsTestPage() {
    return (
        <>
            <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl uppercase">
                    CLICK SPEED TEST
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                    Measure your raw clicking speed over a 10-second interval.
                </p>
            </div>
            <CpsTest />
        </>
    );
}