import { HeroSection } from "@/components/HeroSection";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { getUpcomingContests } from "./actions/getUpcomingContests";
import { renderContestSection } from "./contests/page";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const upcomingContests = await getUpcomingContests(session?.user.id);

  return (
    <div>
      <HeroSection />
      <section className="px-4 py-2 md:px-8 md:py-4">
        {
          upcomingContests.status !== 200 || !upcomingContests.contests
            ? <div className="text-center text-lg font-medium">Unable to get upcoming contests</div>
            : upcomingContests.contests.length === 0
              ? <div className="text-center text-lg font-medium">
                No upcoming contests. Contribute One? <Link className="underline text-blue-500" href={"/contribute?type=contest"}>Click here</Link>
              </div>
              : renderContestSection(session, "Upcoming Contests", upcomingContests.contests || [], "upcoming")
        }
      </section>
    </div>
  );
}