import { ProblemList } from "@/components/ProblemList"
import { ContestDetails } from "@/components/ContestDetails"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function ContestInfo({ params }: { params: { contestId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return redirect("/api/auth/signin")
    }
    const contestData = {
        name: "Weekly Algorithm Challenge",
        problemCount: 5,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        problems: [
            { id: 1, name: "Two Sum", level: "Easy", status: "Solved" },
            { id: 2, name: "Merge Intervals", level: "Medium", status: "Attempted" },
            { id: 3, name: "Binary Tree Level Order Traversal", level: "Medium", status: "Not Started" },
            { id: 4, name: "Trapping Rain Water", level: "Hard", status: "Not Started" },
            { id: 5, name: "Longest Palindromic Substring", level: "Medium", status: "Not Started" },
        ],
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{contestData.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <ProblemList problems={contestData.problems} />
                </div>
                <div>
                    <ContestDetails
                        name={contestData.name}
                        problemCount={contestData.problemCount}
                        endTime={contestData.endTime}
                        problems={contestData.problems}
                    />
                </div>
            </div>
        </div>
    )
}