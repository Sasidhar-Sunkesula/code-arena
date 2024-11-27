"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react";

export function TogglePasswordVisibility({ isPasswordVisible, setIsPasswordVisible }: {
    isPasswordVisible: boolean;
    setIsPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>
}) {
    function togglePasswordVisibility() {
        setIsPasswordVisible(prev => !prev);
    }
    return (
        <button
            type="button"
            className="absolute bottom-0 right-0 flex h-10 items-center px-4 text-neutral-500"
            onClick={togglePasswordVisibility}
        >
            {isPasswordVisible ? (
                <EyeIcon className="h-5 w-5" />
            ) : (
                <EyeOffIcon className="h-5 w-5" />
            )}
        </button>
    )
}