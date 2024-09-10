import { ProblemList } from "@/components/ProblemList"
import { ContestDetails } from "@/components/ContestDetails"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";

export default async function ContestInfo({ params }: { params: { contestId: string } }) {
    const contestId = parseInt(params.contestId);
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return redirect("/api/auth/signin")
    }
    const contestData = await prisma.contest.findUnique({
        where: {
            id: contestId
        },
        include: {
            problems: {
                include: {
                    problem: {
                        select: {
                            id: true,
                            name: true,
                            difficultyLevel: true
                        }
                    }
                }
            },
            submissions: {
                where: {
                    userId: session.user.id,
                    status: "SOLVED"
                },
                select: {
                    status: true
                }
            }
        }
    })

    return (
        !contestData
            ? <div className="font-bold text-destructive">Contest with id - {contestId} not found</div>
            : <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">{contestData.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <ProblemList problems={contestData.problems.map((problemData) => problemData.problem)} />
                    </div>
                    <div>
                        <ContestDetails
                            name={contestData.name}
                            problemCount={contestData.noOfProblems}
                            endTime={contestData.closesOn}
                            problems={contestData.submissions}
                        />
                    </div>
                </div>
            </div>
    )
}