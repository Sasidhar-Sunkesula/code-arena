import { ContestList } from "@/components/ContestList";
import { authOptions } from "@/lib/auth";
import { LockKeyhole } from "lucide-react";
import { getServerSession, Session } from "next-auth";
import toast, { Toaster } from "react-hot-toast";
import { getCurrentContests } from "../actions/getCurrentContests";
import { getEndedContests } from "../actions/getEndedContests";
import { getUpcomingContests } from "../actions/getUpcomingContests";

export const renderContestSection = (
  session: Session | null,
  title: string,
  contests: any[],
  type: "current" | "upcoming" | "ended",
) => {
  if (contests.length > 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-medium">{title}</h2>
        <ContestList
          isLoggedIn={!!session?.user}
          type={type}
          contests={contests}
        />
      </div>
    );
  }
  return null;
};
export default async function ContestCatalog() {
  const session = await getServerSession(authOptions);
  const upcomingContests = await getUpcomingContests(session?.user?.id);
  const currentContests = await getCurrentContests(session?.user?.id);
  const endedContests = await getEndedContests(session?.user?.id);

  if (
    upcomingContests.status !== 200 ||
    currentContests.status !== 200 ||
    endedContests.status !== 200
  ) {
    toast.error("Unable to fetch contests at the moment");
    return null;
  }

  return (
    <div className="px-8 py-6 space-y-9">
      <Toaster />
      {session?.user &&
      currentContests.registeredContests &&
      currentContests.unregisteredContests ? (
        <>
          {renderContestSection(
            session,
            "Registered Contests",
            currentContests.registeredContests,
            "current",
          )}
          {renderContestSection(
            session,
            "Open Contests",
            currentContests.unregisteredContests,
            "current",
          )}
        </>
      ) : (
        <>
          <div className="md:h-52 flex justify-center items-center border bg-secondary rounded-xl text-lg font-medium">
            <div className="flex flex-col items-center gap-y-1 justify-center">
              <LockKeyhole className="w-7" />
              Login to view your Registered Contests
            </div>
          </div>
          {renderContestSection(
            session,
            "Open Contests",
            currentContests.contests || [],
            "current",
          )}
        </>
      )}
      {renderContestSection(
        session,
        "Upcoming Contests",
        upcomingContests.contests || [],
        "upcoming",
      )}
      {renderContestSection(
        session,
        "Ended Contests",
        endedContests.contests || [],
        "ended",
      )}
    </div>
  );
}
