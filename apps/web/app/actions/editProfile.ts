"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";

export async function editProfile(
  userId: string,
  userDetails: {
    username: string;
    fullName: string | null;
    location: string | null;
  },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || userId !== session.user.id) {
      return {
        status: 400,
        msg: "You are unauthorized to edit profile",
      };
    }
    const userNameExists = await prisma.user.findFirst({
      where: {
        id: {
          not: userId,
        },
        username: userDetails.username,
      },
    });
    if (userNameExists) {
      return {
        status: 500,
        msg: "Username already exists. Try another one!",
      };
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: userDetails.username,
        fullName: userDetails.fullName,
        location: userDetails.location,
      },
    });
    return {
      status: 204,
      msg: "Profile updated successfully!",
    };
  } catch (error) {
    return {
      status: 400,
      msg:
        error instanceof Error ? error.message : "Unable to update the profile",
    };
  }
}
