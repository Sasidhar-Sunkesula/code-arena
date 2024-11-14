import { MapPin } from "lucide-react";
import Image from "next/image";

export function UserDetails({ imageUrl, userName, country }: { imageUrl: string, userName: string, country: string }) {
    return (
        <div className="flex flex-col items-center border">
            <Image
                src={imageUrl}
                alt="profile-image"
                width={200}
                height={200}
                className="rounded-full border-2"
            />
            <div>
                <div className="text-xl font-medium">{userName}</div>
                <div className="text-sm flex items-center">
                    <MapPin className="w-4" />
                    <span>{country}</span>
                </div>
            </div>
        </div>
    )
}