"use client"

import { SubmitCodeSchema } from "@/app/api/submitCode/route";
import { Button } from "@repo/ui/shad";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import React from "react";
import { SendHorizontal } from "lucide-react";
import { SubmissionData } from "./CodeEditor";

type ButtonClientProps = {
    text: string;
    fullCode: string;
    problemId: number;
    contestId?: string;
    languageId: number;
    submissionPending: boolean;
    setSubmissionPending: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmissionResults: React.Dispatch<React.SetStateAction<SubmissionData | null>>
    setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CodeSubmitButton(
    { text,
        fullCode,
        languageId,
        problemId,
        contestId,
        setSubmissionPending,
        submissionPending,
        setSubmissionResults,
        setSubmitClicked
    }: ButtonClientProps) {
    const [submissionId, setSubmissionId] = useState<number | null>(null);
    async function submitCode() {
        try {
            const requestBody: SubmitCodeSchema = {
                problemId: problemId,
                submittedCode: fullCode,
                languageId: languageId,
                ...(contestId && !isNaN(parseInt(contestId)) ? { contestId: parseInt(contestId) } : {})
            };
            setSubmitClicked(true);
            setSubmissionPending(true);
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
            setSubmissionId(submissionData.submissionId);
        } catch (error) {
            setSubmissionPending(false);
            toast.error(error instanceof Error ? error.message : "An error occurred while submitting")
        }
    }
    useEffect(() => {
        if (submissionPending && submissionId) {
            const intervalId = setInterval(async () => {
                try {
                    const resultResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkStatus/${submissionId}`);
                    const submissionResult = await resultResponse.json();
                    // Check if the condition to stop polling is met
                    if (submissionResult?.msg !== "PENDING") {
                        clearInterval(intervalId);
                        setSubmissionPending(false);
                        setSubmissionResults(submissionResult.data)
                    }
                } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Error while fetching results")
                }
            }, 1000);

            // Cleanup interval on component unmount
            return () => clearInterval(intervalId);
        }
    }, [submissionPending, submissionId])
    return (
        <>
            <Toaster />
            <Button disabled={submissionPending} onClick={submitCode}>
                {submissionPending ? "Pending..." : text} <SendHorizontal className="w-4 ml-1" />
            </Button>
        </>
    );
}