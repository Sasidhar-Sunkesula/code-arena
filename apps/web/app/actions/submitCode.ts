"use server"

import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function submitCode() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return {
            msg: "Unauthenticated request"
        }
    }
    try {
        const batchSubmissionResponse = await fetch(`${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "submissions": [
                    {
                        "language_id": 46,
                        "source_code": "echo hello from Bash"
                    },
                    {
                        "language_id": 71,
                        "source_code": "print(\"hello from Python\")"
                    },
                    {
                        "language_id": 72,
                        "source_code": "puts(\"hello from Ruby\")"
                    }
                ]
            })
        })
        const batchSubmissionTokens = await batchSubmissionResponse.json();
        console.log(batchSubmissionTokens);
        return batchSubmissionTokens;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.log(errorMessage);
        return {
            msg: errorMessage
        }
    }
}