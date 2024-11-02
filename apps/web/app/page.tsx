import { HeroSection } from "@/components/HeroSection";
import { ContestList } from "@/components/ContestList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import toast, { Toaster } from "react-hot-toast";
import { getOpenContests } from "./actions/getCurrentContests";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const openContests = await getOpenContests(session?.user.id);
  if (!openContests.contests) {
    return toast.error("Unable to fetch contests at the moment")
  }
  return (
    <div>
      <Toaster />
      <HeroSection />
      <section className="px-4 py-2 md:px-8 md:py-4">
        <ContestList type="open" session={session} contests={openContests.contests} />
      </section>
    </div>
  );
}
