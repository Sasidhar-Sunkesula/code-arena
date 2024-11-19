import { MapPin } from "lucide-react";
import Image from "next/image";

export function UserDetails({ imageUrl, userName, country, joinedOn }: { imageUrl: string, userName: string, country: string, joinedOn: Date }) {
    return (
        <div className="flex flex-col items-center border py-4 rounded-sm shadow-sm">
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
                    <MapPin className="w-4 mr-2" />
                    <span>{country}</span>
                </div>
                <div suppressHydrationWarning>
                    <span>Joined on : </span>
                    <span>{joinedOn.toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    )
}