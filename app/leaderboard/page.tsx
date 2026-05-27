import Leaderboard from "../../components/Leaderboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Global Leaderboards | Hardware & Click Tests",
    description: "Check out the top players worldwide for Click speed, reaction time, typing, and aim tests.",
};

export default function LeaderboardPage() {
    return <Leaderboard />;
}
