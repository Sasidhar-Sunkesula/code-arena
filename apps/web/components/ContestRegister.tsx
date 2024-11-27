"use client"

import { isProfileUpdated } from "@/app/actions/isProfileUpdated";
import { registerToContest } from "@/app/actions/registerToContest";
import { unregisterFromContest } from "@/app/actions/unregisterFromContest";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button } from "@repo/ui/shad";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ProfileUpdate } from "./ProfileUpdate";

export function ContestRegister({ contestId, initialIsRegistered }: { contestId: number, initialIsRegistered: boolean }) {
    const session = useSession();
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
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
            const response = await registerToContest(contestId);
            if (response.status === 200) {
                setIsRegistered(true);
                toast.success(response.msg);
                return;
            } else {
                throw new Error(response.msg);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred while registering for the contest.");
        } finally {
            setLoading(false);
        }
    }

    async function handleUnregister() {
        if (!session?.data?.user) {
            router.push("/api/auth/signin");
            return;
        }
        try {
            setLoading(true);
            const response = await unregisterFromContest(contestId);
            if (response.status === 200) {
                setIsRegistered(false);
                toast.success(response.msg);
                return;
            } else {
                throw new Error(response.msg);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred while unregistering from the contest.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Toaster />
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button disabled={loading}>
                        {isRegistered ? "Unregister" : "Register"}
                        <ArrowRight className="w-5 ml-1" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isRegistered ? "Are you sure you want to unregister from the contest?" : "Are you sure you want to register for the contest?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isRegistered ? "If you change your mind, you can register again before the contest starts." : "If you change your mind, make sure to unregister."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={loading} onClick={isRegistered ? handleUnregister : handleParticipate}>
                            {loading
                                ? <Loader2Icon className="w-5 animate-spin" />
                                : "Continue"
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {showProfileUpdate && <ProfileUpdate open={showProfileUpdate} onOpenChange={setShowProfileUpdate} />}
        </div>
    )
}