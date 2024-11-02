import { ContestList } from "@/components/ContestList";
import { getUpcomingContests } from "../actions/getUpcomingContests";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentContests } from "../actions/getCurrentContests";
import toast, { Toaster } from "react-hot-toast";
import { LockKeyhole } from "lucide-react";

export default async function ContestCatalog() {
    const session = await getServerSession(authOptions);
    const upcomingContests = await getUpcomingContests(session?.user.id);
    const currentContests = await getCurrentContests(session?.user.id);
    if (upcomingContests.status !== 200 || currentContests.status !== 200) {
        toast.error("Unable to fetch contests at the moment");
        return null;
    }
    return (
        <div className="px-8 py-6 space-y-9">
            {
                session?.user && currentContests.registeredContests && currentContests.unregisteredContests
                    ? (
                        <>
                            {
                                currentContests.registeredContests.length > 0 && (
                                    <div className="space-y-3">
                                        <h2 className="text-lg font-medium">Registered Contests</h2>
                                        <ContestList type="current" contests={currentContests.registeredContests} />
                                    </div>
                                )
                            }
                            {
                                currentContests.unregisteredContests.length > 0 && (
                                    <div className="space-y-3">
                                        <h2 className="text-lg font-medium">Open Contests</h2>
                                        <ContestList type="current" contests={currentContests.unregisteredContests} />
                                    </div>
                                )
                            }
                        </>
                    )
                    : (
                        <>
                            <div className="md:h-52 flex justify-center items-center border bg-secondary rounded-xl text-lg font-medium">
                                <div className="flex flex-col items-center gap-y-1 justify-center">
                                    <LockKeyhole className="w-7" />
                                    Login to view your Registered Contests
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-lg font-medium">Open Contests</h2>
                                <ContestList type="current" contests={currentContests.contests!} />
                            </div>
                        </>
                    )
            }
            <div className="space-y-3">
                <h2 className="text-lg font-medium">Upcoming Contests</h2>
                <ContestList type="upcoming" contests={upcomingContests.contests!} />
            </div>
            <Toaster />
        </div>
    )
}