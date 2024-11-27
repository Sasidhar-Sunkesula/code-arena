"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/shad";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
interface LeaderboardEntry {
    username: string;
    score: number;
    rank: number;
    country: string;
}
export function LeaderBoardDisplay({ contestId }: { contestId: string }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<LeaderboardEntry[] | null>(null);

    useEffect(() => {
        const parsedContestId = parseInt(contestId);
        if (isNaN(parsedContestId)) {
            toast.error("Contest Id is invalid");
            return;
        }
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leaderboard/${contestId}`)
        eventSource.onmessage = (event) => {
            const data = event.data
            if (data) {
                setData(JSON.parse(data))
                setLoading(false)
                // eventSource.close()
            }
        }
        eventSource.onerror = () => {
            eventSource.close() // Close the connection if an error occurs
            setLoading(false)
        }

        return () => {
            eventSource.close()
            setLoading(false)
        };
    }, [])
    if (loading) {
        return (
            <div className="md:h-96 flex justify-center items-center">
                <Loader2 className="w-5 animate-spin" />
            </div>
        )
    }
    return (
        data ? (
            <>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>User Name</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Country</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((item) => (
                                <TableRow key={item.rank}>
                                    <TableCell>{item.rank}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell>{item.score}</TableCell>
                                    <TableCell>{item.country}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <Toaster />
            </>
        ) : (
            <div className="md:h-96 flex justify-center items-center text-sm">
                Unable to fetch leaderboard data
            </div>
        )
    )
}