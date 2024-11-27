import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useSuccessRedirect(type: "Problem" | "Contest") {
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (success) {
            const toastId = toast.success(`${type} added successfully! Thank you for your contribution. Redirecting to home page in ${countdown}`, {
                style: {
                    background: '#333',
                    color: '#fff',
                    fontSize: "13px"
                },
                duration: 5000,
            });

            const intervalId = setInterval(() => {
                setCountdown(prev => {
                    const newCountdown = prev - 1;
                    toast.success(`${type} added successfully! Thank you for your contribution. Redirecting to home page in ${newCountdown}`, {
                        id: toastId,
                    });
                    return newCountdown;
                });
            }, 1000);

            setTimeout(() => {
                clearInterval(intervalId);
                router.push("/");
            }, 5000);

            return () => {
                clearInterval(intervalId);
            }
        }
    }, [success, router]);

    return { success, setSuccess };
}
