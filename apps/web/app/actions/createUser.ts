"use server";

import prisma from "@repo/db/client";
import bcrypt from "bcrypt";

export async function createUser(
  userName: string,
  email: string,
  password: string,
) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return {
        status: 400,
        msg: "User already exists",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await prisma.user.create({
      data: {
        email: email,
        password: hash,
        username: userName,
      },
    });
    return {
      status: 200,
      msg: "User created successfully!",
    };
  } catch (error) {
    return {
      status: 500,
      msg:
        error instanceof Error ? error.message : "Unable to create an account",
    };
  }
}
