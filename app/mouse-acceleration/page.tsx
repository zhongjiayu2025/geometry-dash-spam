import MouseAccelerationTest from "../../components/MouseAccelerationTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mouse Acceleration Checker | Enhance Pointer Precision Test",
    description: "Check if mouse acceleration (Enhance Pointer Precision) is enabled on your system. Prevent inconsistent aim in FPS games.",
};

export default function MouseAccelerationPage() {
    return (
        <>
            <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl uppercase">
                    MOUSE ACCELERATION
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                    Test if your operating system is artificially modifying your pointer speed.
                </p>
            </div>
            <MouseAccelerationTest />
        </>
    );
}
