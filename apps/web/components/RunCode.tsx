"use client"

import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import React from "react";
import { SubmissionData } from "./CodeEditor";
import { SubmissionType, SubmitCodeSchema } from "@repo/common/types";
import { Button } from "@repo/ui/shad";
import { Play } from "lucide-react";

type RunCodeProps = {
    text: string;
    type: SubmissionType;
    fullCode: string;
    problemId: number;
    contestId?: string;
    languageId: number;
    submissionPending: boolean;
    setSubmissionPending: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmissionResults: React.Dispatch<React.SetStateAction<SubmissionData | null>>
    setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
type SubmissionToken = {
    token: string
}
export function RunCode({
    text,
    fullCode,
    languageId,
    problemId,
    contestId,
    type,
    setSubmissionPending,
    submissionPending,
    setSubmissionResults,
    setSubmitClicked
}: RunCodeProps) {
    const [submissionTokens, setSubmissionTokens] = useState<SubmissionToken[] | null>(null);
    async function submitCode() {
        try {
            const requestBody: SubmitCodeSchema = {
                problemId: problemId,
                submittedCode: fullCode,
                languageId: languageId,
                type: type,
                ...(contestId && !isNaN(parseInt(contestId)) ? { contestId: parseInt(contestId) } : {})
            };
            setSubmitClicked(true);
            setSubmissionPending(true);
            const submissionResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            const submissionData = await submissionResponse.json();
            if (!submissionResponse.ok) {
                throw new Error(submissionData.msg);
            }
            setSubmissionTokens(submissionData.submissionTokens);
        } catch (error) {
            setSubmissionPending(false);
            toast.error(error instanceof Error ? error.message : "An error occurred while submitting")
        }
    }
    useEffect(() => {
        if (submissionPending && submissionTokens) {
            const intervalId = setInterval(async () => {
                try {
                    const resultResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check/run`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            problemId: problemId,
                            submissionTokens: submissionTokens.map((tokenObj) => tokenObj.token)
                        })
                    })
                    if (!resultResponse.ok) {
                        const errorData = await resultResponse.json();
                        throw new Error(errorData.msg);
                    }
                    const submissionResult = await resultResponse.json();
                    // Check if the condition to stop polling is met
                    if (submissionResult?.msg !== "PENDING") {
                        clearInterval(intervalId)
                        setSubmissionPending(false);
                        setSubmissionResults(submissionResult.data)
                    }
                } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Error while fetching results")
                }
            }, 1000)

            // Cleanup interval on component unmount
            return () => clearInterval(intervalId);
        }
    }, [submissionPending, submissionTokens])
    return (
        <div className="flex items-center gap-3">
            <Toaster />
            <Button disabled={submissionPending} onClick={submitCode}>
                {submissionPending ? "Pending..." : text}
                <Play className="w-4 ml-1" />
            </Button>
        </div>
    )
}