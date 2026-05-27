import TypingTest from "../../components/TypingTest";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Typing Speed Test | WPM Checker",
    description: "Check your typing speed in Words Per Minute (WPM). A 60-second typing test to measure keyboard proficiency.",
};

export default function TypingPage() {
    return (
        <>
            <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl uppercase">
                    TYPING SPEED TEST
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                    Find out how fast you can type. 60 seconds on the clock.
                </p>
            </div>
            <TypingTest />
        </>
    );
}
