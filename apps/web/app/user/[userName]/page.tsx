import { getSolvedProblemsByLevel } from "@/app/actions/getSolvedProblemsByLevel";
import { getSubmissionsForPastYear } from "@/app/actions/getSubmissionsForPastYear";
import { RecentAC, RecentACProblems } from "@/components/RecentAC";
import { SolvedProblemsChart } from "@/components/SolvedProblemsChartContainer";
import { SubmissionsLineChart } from "@/components/SubmissionsLineChart";
import { UserDetails } from "@/components/UserDetails"
import { DifficultyLevel } from "@repo/common/types";
import prisma from "@repo/db/client"

type SolvedProblemsByLevel = {
    [key in DifficultyLevel]: number;
};
export type ChartData = {
    level: DifficultyLevel,
    solved: number,
    total: number
}

export default async function Profile({ params }: { params: Promise<{ userName: string }> }) {
    const { userName } = await params;
    let errorMessage = ""
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: userName,
                mode: "default"
            }
        }
    })
    if (!user)
        return errorMessage = "Unable to find the user";

    const submissionsByMonth = await getSubmissionsForPastYear(user.id);

    if (!submissionsByMonth.submissionsByMonth || submissionsByMonth.msg)
        return errorMessage = submissionsByMonth.msg;

    const solvedProblemsData = await getSolvedProblemsByLevel(user.id);

    if (solvedProblemsData.msg || !solvedProblemsData.solvedProblems)
        return errorMessage = solvedProblemsData.msg;

    const { solvedProblems, totalProblems, totalProblemsByLevel } = solvedProblemsData;

    // Reduce the solved problems to count by difficulty level
    const solvedProblemsByLevel: SolvedProblemsByLevel = solvedProblems.reduce((acc, curr) => {
        const level = curr.problem.difficultyLevel;
        if (!acc[level]) {
            acc[level] = 0;
        }
        acc[level]++;
        return acc;
    }, {} as SolvedProblemsByLevel);

    // Combine the results into chart data
    const pieChartData = totalProblemsByLevel.map(levelData => {
        const level = levelData.difficultyLevel as DifficultyLevel;
        return {
            level,
            solved: solvedProblemsByLevel[level] || 0,
            total: levelData._count._all
        };
    });

    const recentACProblems: RecentACProblems[] = solvedProblems.map(prob => {
        const formattedInfo: RecentACProblems = {
            id: prob.problemId,
            name: prob.problem.name,
            difficultyLevel: prob.problem.difficultyLevel,
            submittedOn: prob.createdAt
        }
        return formattedInfo;
    })
    if (errorMessage) {
        return (
            <div className="flex justify-center items-center w-full text-destructive font-medium md:min-h-96">
                {errorMessage}
            </div>
        )
    }
    return (
        <div className="grid grid-cols-5 gap-x-5 px-8 py-6">
            <div className="col-span-1">
                <UserDetails
                    imageUrl={"https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-600nw-1241538838.jpg"}
                    userName={user.username}
                    country={user.location || ""}
                    joinedOn={user.createdAt}
                />
                <SolvedProblemsChart
                    chartData={pieChartData}
                    solved={solvedProblems.length}
                    totalProblems={totalProblems}
                />
            </div>
            <div className="col-span-4 space-y-4">
                <SubmissionsLineChart chartData={submissionsByMonth.submissionsByMonth} />
                <RecentAC problems={recentACProblems} />
            </div>
        </div>
    )
}