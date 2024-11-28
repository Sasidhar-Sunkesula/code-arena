"use server";

import prisma from "@repo/db/client";

export async function searchProblems(searchKey: string) {
  if (!searchKey.trim()) {
    return {
      searchResults: [],
    };
  }
  try {
    const result = await prisma.problem.findMany({
      where: {
        name: {
          contains: searchKey,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        id: true,
      },
      take: 5,
    });
    return {
      searchResults: result,
    };
  } catch (error) {
    return {
      msg:
        error instanceof Error
          ? error.message
          : "An unknown error occurred while getting search results",
    };
  }
}
