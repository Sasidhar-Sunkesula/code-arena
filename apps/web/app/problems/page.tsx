import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { ProblemList as ProblemListComponent } from "@/components/ProblemList"; // Assuming the component is in this path

export default async function ProblemList() {
    const session = await getServerSession(authOptions);
    const problemList = await prisma.problem.findMany({
        select: {
            id: true,
            name: true,
            difficultyLevel: true,
            _count: {
                select: {
                    submissions: true // Count total submissions for each problem
                }
            },
            submissions: {
                where: {
                    status: "Accepted",
                    ...(session?.user.id && { userId: session.user.id })
                },
                select: {
                    status: true // Just to check if there is any accepted submission
                }
            }
        }
    });

    const optimizedProblemList = problemList.map(problem => ({
        id: problem.id,
        name: problem.name,
        difficultyLevel: problem.difficultyLevel,
        _count: problem._count,
        submissions: session?.user.id ? problem.submissions : []
    }));

    return (
        <div className="px-3 py-4">
            <ProblemListComponent
                problems={optimizedProblemList}
                contestId={null} // No contest in this case
                userId={session?.user?.id || null}
            />
        </div>
    );
}