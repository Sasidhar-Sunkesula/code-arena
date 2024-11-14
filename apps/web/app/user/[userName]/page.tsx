import { UserDetails } from "@/components/UserDetails"
import prisma from "@repo/db/client"

export default async function Profile({ params }: { params: { userName: string } }) {
    const user = await prisma.user.findFirst({
        where: {
            name: {
                equals: params.userName,
                mode: "insensitive"
            }
        }
    })
    if (!user) {
        return (
            <div className="flex justify-center items-center w-full text-destructive font-medium md:min-h-96">
                Unable to find the user
            </div>
        )
    }

    return (
        <div className="grid grid-cols-5 gap-x-5">
            <div className="col-span-1">
                <UserDetails
                    imageUrl={"https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-woman-600nw-1241538838.jpg"}
                    userName={user.name}
                    country={user.location}
                />
            </div>
        </div>
    )
}