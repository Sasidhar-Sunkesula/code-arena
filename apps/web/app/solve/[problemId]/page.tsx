import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { CodeEditor } from "@/components/CodeEditor"
import prisma from "@repo/db/client"
import { Badge } from "@repo/ui/shad";
import Link from "next/link";

export default async function ProblemSolvingPage({ params, searchParams }: { params: { problemId: string }, searchParams: { contestId?: string, tempId?: string, type?: string } }) {
  const problemId = parseInt(params.problemId);
  const problemData = await prisma.problem.findUnique({
    where: {
      id: problemId
    },
    include: {
      boilerPlate: {
        include: {
          language: true
        }
      }
    }
  })
  if (!problemData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-destructive font-medium text-xl">
        Problem with id - {problemId} not found
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-lg prose">
          <div className="flex items-start gap-x-5">
            <h1 className="text-xl font-medium mb-3 underline">{problemData.name}</h1>
            <Link className="hover:scale-105" href={`/user/${problemData.contributedBy.toLowerCase()}`}>
              <Badge variant={"outline"} className="px-3 py-2 hover:text-blue-700 hover:underline">
                <span>Contributed by :</span>
                <span>&nbsp;{problemData.contributedBy}</span>
              </Badge>
            </Link>
          </div>
          <MarkdownRenderer content={problemData.content} />
        </div>
        <div>
          <CodeEditor userType={searchParams.type} tempId={searchParams.tempId} boilerPlates={problemData.boilerPlate} contestId={searchParams?.contestId} />
        </div>
      </div>
    </div>
  )
}