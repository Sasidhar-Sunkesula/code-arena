import prisma from "@repo/db/client"
import { ContestCard } from "./ContestCard"

export async function OpenContests() {
  const contests = await prisma.contest.findMany(
    {
      take: 10,
      orderBy: {
        closesOn: "asc"
      }
    });
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <ContestCard key={contest.id} {...contest} />
        ))}
      </div>
  )
}