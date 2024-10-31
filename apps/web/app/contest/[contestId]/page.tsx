import { ProblemList } from "@/components/ProblemList"
import { ContestDetails } from "@/components/ContestDetails"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@repo/db/client";

export default async function ContestInfo({ params }: { params: { contestId: string } }) {
    const contestId = parseInt(params.contestId);
    const session = await getServerSession(authOptions);
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
                            difficultyLevel: true,
                            _count: {
                                select: {
                                    submissions: true // Count total submissions for each problem
                                }
                            },
                            submissions: session?.user?.id ? {
                                where: {
                                    userId: session.user.id
                                },
                                select: {
                                    status: true
                                }
                            } : false // Include user submissions only if user is logged in
                        }
                    }
                }
            },
            _count: {
                select: {
                    problems: true // Count total problems for the contest
                }
            }
        }
    });
    // Flatten the submissions array and include problemId
    const submissions = (session?.user?.id && contestData)
        ? contestData.problems.flatMap((problemData) =>
            problemData.problem.submissions.map((submission) => ({
                ...submission,
                problemId: problemData.problem.id
            }))
        )
        : [];
    return (
        !contestData
            ? <div className="font-bold text-destructive">Contest with id - {contestId} not found</div>
            : <div className="container mx-auto px-2 py-8">
                <h1 className="text-3xl font-bold mb-8">{contestData.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
                    <div className="md:col-span-2">
                        <ProblemList
                            problems={contestData.problems.map((problemData) => problemData.problem)}
                            contestId={contestId}
                            userId={session?.user?.id || null}
                        />
                    </div>
                    <div>
                        <ContestDetails
                            contestId={contestId}
                            name={contestData.name}
                            problemCount={contestData._count.problems}
                            endTime={contestData.closesOn}
                            submissions={submissions}
                        />
                    </div>
                </div>
            </div>
    )
}