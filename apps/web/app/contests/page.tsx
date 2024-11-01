import { ContestList } from "@/components/ContestList";
import { getUpcomingContests } from "../actions/getUpcomingContests";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOpenContests } from "../actions/getOpenContests";
import toast, { Toaster } from "react-hot-toast";

export default async function ContestCatalog() {
    const session = await getServerSession(authOptions);
    const upcomingContests = await getUpcomingContests(session?.user.id);
    const openContests = await getOpenContests(session?.user.id);
    if (!upcomingContests.contests || !openContests.contests) {
        return toast.error("Unable to fetch contests at the moment")
    }
    return (
        <div className="px-8 py-6 space-y-5">
            <Toaster />
            <ContestList type="open" session={session} contests={openContests.contests} />
            <ContestList type="upcoming" session={session} contests={upcomingContests.contests} />
        </div>
    )
}