"use server"

import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";

export async function isProfileUpdated() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error("You need to login to check your profile")
        }
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            }
        });
        if (!user) {
            throw new Error("Unable to find the user")
        }
        const isUpdated = user.name?.trim() && user.location?.trim() ? true : false;
        return {
            status: 200,
            isUpdated: isUpdated
        }
    } catch (error) {
        return {
            status: 500,
            msg: error instanceof Error
                ? error.message
                : "An unknown error occurred while updating the profile"
        }
    }
}