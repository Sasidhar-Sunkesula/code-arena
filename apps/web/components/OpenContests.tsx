import prisma from "@repo/db/client"
import { ContestCard } from "./ContestCard"

export async function OpenContests() {
  const currentDate = new Date();
  const contests = await prisma.contest.findMany({
    where: {
      startsOn: {
        lte: currentDate, // Contest has started
      },
      closesOn: {
        gte: currentDate, // Contest has not ended
      },
    },
    include: {
      _count: {
        select: {
          problems: true
        }
      }
    },
    take: 10,
    orderBy: {
      closesOn: "asc",
    },
  });

  return (
    <div>
      {contests.length === 0 ? (
        <div className="text-sm md:h-96 flex justify-center items-center">There are no open contests at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <ContestCard key={contest.id} {...contest} />
          ))}
        </div>
      )}
    </div>
  )
}