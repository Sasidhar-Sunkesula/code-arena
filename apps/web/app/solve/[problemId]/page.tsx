import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { CodeEditor } from "@/components/CodeEditor"
import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function ProblemSolvingPage({ params, searchParams }: { params: { problemId: string }, searchParams: { contestId: string | undefined } }) {
  const problemId = parseInt(params.problemId);
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/api/auth/signin")
  }
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

  return (
    !problemData
      ? <div className="font-bold text-destructive">Contest with id - {problemId} not found</div>
      : <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg prose prose-stone dark:prose-invert">
            <h1 className="text-3xl font-bold mb-3">{problemData.name}</h1>
            <MarkdownRenderer content={problemData.content} />
          </div>
          <div className="space-y-4">
            <CodeEditor boilerPlates={problemData.boilerPlate} contestId={searchParams?.contestId} />
          </div>
        </div>
      </div>
  )
}