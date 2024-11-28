"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";

export async function updateProfile(name: string, location: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("You need to login to update your profile");
    }
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name,
        location: location,
      },
    });
    return {
      status: 201,
      msg: "Profile updated successfully!",
    };
  } catch (error) {
    return {
      status: 500,
      msg:
        error instanceof Error
          ? error.message
          : "An unknown error occurred while updating the profile",
    };
  }
}
