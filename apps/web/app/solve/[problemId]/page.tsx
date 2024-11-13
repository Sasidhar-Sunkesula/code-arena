import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { CodeEditor } from "@/components/CodeEditor"
import prisma from "@repo/db/client"

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
        <div className="bg-card rounded-lg prose prose-stone dark:prose-invert">
          <h1 className="text-xl font-medium mb-3 underline">{problemData.name}</h1>
          <MarkdownRenderer content={problemData.content} />
        </div>
        <div>
          <CodeEditor userType={searchParams.type} tempId={searchParams.tempId} boilerPlates={problemData.boilerPlate} contestId={searchParams?.contestId} />
        </div>
      </div>
    </div>
  )
}