import PersonalStats from "../../components/PersonalStats";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Stats Dashboard | CPS Test Profile",
    description: "View all your personal best scores for clicking, typing, and aiming in one place.",
};

export default function DashboardPage() {
    return (
        <>
            <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-blue-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    PROFILE STATISTICS
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl">
                    YOUR DASHBOARD
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                    Track your improvement across all hardware and skill tests. Records are saved locally in your browser.
                </p>
            </div>
            <PersonalStats />
        </>
    );
}
