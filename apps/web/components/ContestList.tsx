import { Session } from "next-auth";
import { ContestCard } from "./ContestCard"
import { ContestLevel } from "@prisma/client";

interface Contest {
  id: number;
  name: string;
  level: ContestLevel;
  contributedBy: string;
  closesOn: Date;
  startsOn: Date;
  users: {
    userId: string;
  }[];
  _count: {
    problems: number;
  };
}
interface ContestListProps {
  type: "open" | "upcoming";
  contests: Contest[];
  session: Session | null;
}
export function ContestList({ contests, session, type }: ContestListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{type === "upcoming" ? "Upcoming Contests" : "Open Contests"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <ContestCard key={contest.id} type={type} {...contest} isRegistered={!session ? false : contest.users.length > 0} />
        ))}
      </div>
    </div>
  )
}