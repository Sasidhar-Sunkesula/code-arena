"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button } from "@repo/ui/shad";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { ProfileUpdate } from "./ProfileUpdate";
import { isProfileUpdated } from "@/app/actions/isProfileUpdated";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { registerToContest } from "@/app/actions/registerToContest";
import { ArrowRight, Loader2Icon } from "lucide-react";

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
                setIsRegistered(true)
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
    return (
        <div>
            <Toaster />
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button disabled={isRegistered}>
                        Register
                        <ArrowRight className="w-5 ml-1" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to register for the contest?</AlertDialogTitle>
                        <AlertDialogDescription>
                            If you change your mind, Make sure to un-register to prevent loss of contest rating.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={loading} onClick={handleParticipate}>
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