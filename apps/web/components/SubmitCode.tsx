"use client";

import { useSubmitCode } from "@/app/hooks/useSubmitCode";
import { SubmissionType } from "@repo/common/types";
import { Badge, Button } from "@repo/ui/shad";
import { ArrowRight, Play } from "lucide-react";
import { useSession } from 'next-auth/react';
import React from "react";
import { SubmissionData, SubmissionPendingObj } from "./CodeEditor";

type SubmitCodeProps = {
    text: string;
    type: SubmissionType;
    fullCode: string;
    problemId?: number;
    contestId?: string;
    testCases?: {
        input: string;
        expectedOutput: string;
    }[];
    tempId?: string;
    userType?: string;
    languageId: number;
    submissionPending: SubmissionPendingObj
    setSubmissionPending: React.Dispatch<React.SetStateAction<SubmissionPendingObj>>;
    setSubmissionResults: React.Dispatch<React.SetStateAction<SubmissionData | null>>;
    setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SubmitCode({
    text,
    fullCode,
    languageId,
    problemId,
    contestId,
    type,
    tempId,
    userType,
    testCases,
    setSubmissionPending,
    submissionPending,
    setSubmissionResults,
    setSubmitClicked
}: SubmitCodeProps) {
    const session = useSession();
    const { submitCode } = useSubmitCode({
        fullCode,
        languageId,
        problemId,
        testCases,
        contestId,
        type,
        tempId,
        submissionPending,
        setSubmissionPending,
        setSubmissionResults,
        setSubmitClicked
    });
    return (
        <div className="flex items-center gap-3">
            {type === SubmissionType.SUBMIT && !session.data?.user && userType !== "demo" && (
                <Badge className="text-sm">You must be logged in to submit a problem</Badge>
            )}
            <Button disabled={submissionPending.run || submissionPending.submit || (type === SubmissionType.SUBMIT && userType !== "demo" && !session.data?.user.id)} onClick={submitCode}>
                {((type === SubmissionType.RUN && submissionPending.run) || (type === SubmissionType.SUBMIT && submissionPending.submit))
                    ? "Pending..."
                    : text
                }
                {type === SubmissionType.RUN
                    ? <Play className="w-4 ml-1" />
                    : <ArrowRight className="w-4 ml-1" />
                }
            </Button>
        </div>
    );
}