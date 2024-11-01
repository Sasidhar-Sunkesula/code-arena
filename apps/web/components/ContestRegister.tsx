"use client"

import { Button } from "@repo/ui/shad";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { ProfileUpdate } from "./ProfileUpdate";
import { isProfileUpdated } from "@/app/actions/isProfileUpdated";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { registerToContest } from "@/app/actions/registerToContest";
import { Loader2Icon } from "lucide-react";

export function ContestRegister({ contestId }: { contestId: number }) {
    const session = useSession();
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [showProfileUpdate, setShowProfileUpdate] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session.status === "authenticated" && session.data?.user) {
            checkProfile();
        }
    }, [session.status, session]);

    async function checkProfile() {
        try {
            const response = await isProfileUpdated();
            if (response.status === 200 && !response.isUpdated) {
                setShowProfileUpdate(true);
            } else if (response.status !== 200 && response.msg) {
                toast.error(response.msg);
            }
        } catch {
            toast.error("An error occurred while checking your profile.");
        }
    }

    async function handleParticipate() {
        if (!session?.data?.user) {
            router.push("/api/auth/signin");
            return;
        }
        try {
            setLoading(true);
            await checkProfile();
            const response = await registerToContest(session.data.user.id, contestId);
            if (response.status === 200) {
                toast.success(response.msg);
                setIsRegistered(true)
            } else {
                throw new Error(response.msg);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred while registering for the contest.");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div>
            <Toaster />
            <Button className="w-full md:w-28" onClick={handleParticipate} disabled={loading || isRegistered}>
                {loading ? <Loader2Icon className="w-5 animate-spin" /> : isRegistered ? "Registered!" : "Register"}
            </Button>
            {showProfileUpdate && <ProfileUpdate open={showProfileUpdate} onOpenChange={setShowProfileUpdate} />}
        </div>
    )
}