import { LeaderBoardDisplay } from "@/components/Leaderboard";

export default async function ContestLeaderboard(props: { params: Promise<{ contestId: string }> }) {
    const params = await props.params;
    return (
        <div className="px-8 py-6 space-y-5">
            <h2 className="font-medium text-xl">Live Leaderboard</h2>
            <LeaderBoardDisplay contestId={params.contestId} />
        </div>
    )
}