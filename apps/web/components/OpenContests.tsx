import prisma from "@repo/db/client"
import { ContestCard } from "./ContestCard"

export async function OpenContests() {
  const contests = await prisma.contest.findMany({ take: 10 });
  return (
    <section className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6">Open Contests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <ContestCard key={contest.id} {...contest} linkTo={`/contest/${contest.id}`} />
        ))}
      </div>
    </section>
  )
}