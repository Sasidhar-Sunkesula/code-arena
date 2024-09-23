"use client"

import { SubmitCodeSchema } from "@/app/api/submitCode/route";
import { Button } from "@repo/ui/shad";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

interface ButtonClientProps {
    text: string;
    fullCode: string;
    problemId: number;
    contestId?: string;
    languageId: number;
}

export function CodeSubmitButton({ text, fullCode, languageId, problemId, contestId }: ButtonClientProps) {
    const [loading, setLoading] = useState(false);
    const [submissionPending, setSubmissionPending] = useState(false);
    async function submitCode() {
        try {
            const requestBody: SubmitCodeSchema = {
                problemId: problemId,
                submittedCode: fullCode,
                languageId: languageId,
                ...(contestId && !isNaN(parseInt(contestId)) ? { contestId: parseInt(contestId) } : {})
            };
            setLoading(true);
            const submissionResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/submitCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            if (!submissionResponse.ok) {
                throw new Error("Unable to create a submission at this moment")
            }
            const submissionData: { submissionId: number } = await submissionResponse.json();
            setSubmissionPending(true);
            const resultResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkStatus/${submissionData.submissionId}`)
            const submissionResult = await resultResponse.json();
            console.log(submissionResult);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred while submitting")
        } finally {
            setLoading(false);
            setSubmissionPending(false);
        }
    }

    return (
        <>
            <Toaster />
            <Button disabled={loading} onClick={submitCode}>
                {loading ? "Submitting..." : submissionPending ? "Pending..." : text}
            </Button>
        </>
    );
}