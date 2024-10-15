"use server";

import prisma from "@repo/db/client";

export async function getLanguages() {
    try {
        const languages = await prisma.language.findMany({});
        return {
            languages
        };
    } catch (error) {
        return {
            msg: error instanceof Error ? error.message : "An error occurred while fetching languages."
        };
    }
}