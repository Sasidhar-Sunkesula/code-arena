import { HeroSection } from "@/components/HeroSection";
import { ContestList } from "@/components/ContestList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import toast, { Toaster } from "react-hot-toast";
import { getUpcomingContests } from "./actions/getUpcomingContests";
import { getCurrentContests } from "./actions/getCurrentContests";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const upcomingContests = await getUpcomingContests(session?.user?.id);
  const currentContests = session?.user ? await getCurrentContests(session.user.id) : null;

  if (!upcomingContests.contests || (session?.user && !currentContests?.contests)) {
    toast.error("Unable to fetch contests at the moment");
    return null;
  }

  return (
    <div>
      <HeroSection />
      <section className="px-4 py-2 md:px-8 md:py-4">
        <h2 className="text-lg font-medium">Upcoming Contests</h2>
        <ContestList isLoggedIn={!!session?.user} type="upcoming" contests={upcomingContests.contests} />
      </section>
      {session?.user && currentContests && (
        <section className="px-4 py-2 md:px-8 md:py-4">
          <h2 className="text-lg font-medium">Current Contests</h2>
          <ContestList isLoggedIn={!!session?.user} type="current" contests={currentContests.contests} />
        </section>
      )}
      <Toaster />
    </div>
  );
}