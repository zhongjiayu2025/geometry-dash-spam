import PersonalStats from "../../components/PersonalStats";
import RelatedTools from "../../components/RelatedTools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Local Stats Dashboard",
  description: "View personal best scores stored locally in this browser.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardPage() {
  return (
    <>
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-blue-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          LOCAL BROWSER STATISTICS
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
          YOUR DASHBOARD
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          Track personal records saved locally in this browser. These scores are not uploaded to a global leaderboard.
        </p>
      </div>
      <PersonalStats />
      <RelatedTools currentTool="dashboard" />
    </>
  );
}
