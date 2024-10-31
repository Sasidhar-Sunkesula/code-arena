

export default function ContestLeaderboard({ params }: { params: { contestId: string } }) {
    return (
        <div>
            Contest Leaderboard page - {params.contestId}
        </div>
    )
}