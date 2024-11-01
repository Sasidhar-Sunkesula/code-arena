"use client"

import { Button } from "@repo/ui/shad";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { ProfileUpdate } from "./ProfileUpdate";
import { isProfileUpdated } from "@/app/actions/isProfileUpdated";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export function ContestRegister() {
    const { data: session } = useSession();
    const [showProfileUpdate, setShowProfileUpdate] = useState(false);
    const router = useRouter();
    async function checkAuth() {
        if (!session?.user) {
            router.push("/api/auth/signin");
            return;
        }

        try {
            const response = await isProfileUpdated();
            if (response.status === 200 && !response.isUpdated) {
                setShowProfileUpdate(true);
            } else if (response.status !== 200 && response.msg) {
                toast.error(response.msg);
            } else {
                toast.success("You are ready to participate!");
            }
        } catch {
            toast.error("An error occurred while checking your profile.");
        }
    }
    return (
        <div>
            <Toaster />
            <Button onClick={checkAuth}>Participate</Button>
            {showProfileUpdate && <ProfileUpdate open={showProfileUpdate} onOpenChange={setShowProfileUpdate} />}
        </div>
    )
}