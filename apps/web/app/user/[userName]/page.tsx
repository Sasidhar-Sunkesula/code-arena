import { SolvedProblemsChart } from "@/components/SolvedProblemsChartContainer";
import { UserDetails } from "@/components/UserDetails"
import prisma from "@repo/db/client"

export default async function Profile({ params }: { params: Promise<{ userName: string }> }) {
    const { userName } = await params;
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: userName,
                mode: "default"
            }
        }
    })
    if (!user) {
        return (
            <div className="flex justify-center items-center w-full text-destructive font-medium md:min-h-96">
                Unable to find the user
            </div>
        )
    }
    const problemCount = await prisma.problem.count();
    const solvedProblems = await prisma.submission.findMany({
        where: {
            status: "Accepted",
            contestId: null
        },
        distinct: ["problemId"],
        select: {
            problemId: true
        }
    });
    const totalSolved = solvedProblems.length;
    const chartData = [
        { level: "easy", solved: 275 },
        { level: "medium", solved: 200 },
        { level: "hard", solved: 287 }
    ]
    return (
        <div className="grid grid-cols-5 gap-x-5 px-8 py-6">
            <div className="col-span-1">
                <UserDetails
                    imageUrl={"https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-600nw-1241538838.jpg"}
                    userName={user.username}
                    country={user.location || ""}
                    joinedOn={user.createdAt}
                />
            </div>
            <div className="col-span-4">
                <SolvedProblemsChart
                    chartData={chartData}
                    solved={totalSolved}
                    totalProblems={problemCount}
                />
            </div>
        </div>
    )
}