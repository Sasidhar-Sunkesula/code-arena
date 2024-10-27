"use client"

import { Badge, Button } from "@repo/ui/shad";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import React from "react";
import { ArrowRight } from "lucide-react";
import { SubmissionData } from "./CodeEditor";
import { useSession } from "next-auth/react";
import { SubmissionType, SubmitCodeSchema } from "@repo/common/types";

type SubmitCodeProps = {
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

export function SubmitCode({
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
}: SubmitCodeProps) {
    const [submissionId, setSubmissionId] = useState<number | null>(null);
    const session = useSession();

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
                    const resultResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check/submit/${submissionId}`);
                    if (!resultResponse.ok) {
                        const errorData = await resultResponse.json();
                        throw new Error(errorData.msg);
                    }
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
        <div className="flex items-center gap-3">
            <Toaster />
            {!session.data?.user.id && <Badge className="text-sm">You must be logged in to submit a problem</Badge>}
            <Button disabled={submissionPending || !session.data?.user.id} onClick={submitCode}>
                {submissionPending ? "Pending..." : text} <ArrowRight className="w-4 ml-1" />
            </Button>
        </div>
    );
}