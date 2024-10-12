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
            message: "An error occurred while fetching languages. Please try again later."
        };
    }
}