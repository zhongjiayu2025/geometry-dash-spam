import Leaderboard from "../../components/Leaderboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard Status",
  description: "Global leaderboard data is not currently collected on this static site.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/leaderboard",
  },
};

export default function LeaderboardPage() {
  return <Leaderboard />;
}
