"use client";

import { Toaster } from 'react-hot-toast';
import React from "react";
import { SubmissionData } from "./CodeEditor";
import { SubmissionType } from "@repo/common/types";
import { Badge, Button } from "@repo/ui/shad";
import { Play, ArrowRight } from "lucide-react";
import { useSubmitCode } from "@/app/hooks/useSubmitCode";
import { useSession } from 'next-auth/react';

type SubmitCodeProps = {
    text: string;
    type: SubmissionType;
    fullCode: string;
    problemId: number;
    contestId?: string;
    languageId: number;
    submissionPending: {
        run: boolean;
        submit: boolean;
    }
    setSubmissionPending: React.Dispatch<React.SetStateAction<{
        run: boolean;
        submit: boolean;
    }>>;
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
        contestId,
        type,
        submissionPending,
        setSubmissionPending,
        setSubmissionResults,
        setSubmitClicked
    });
    return (
        <div className="flex items-center gap-3">
            <Toaster />
            {type === SubmissionType.SUBMIT && !session.data?.user.id && (
                <Badge className="text-sm">You must be logged in to submit a problem</Badge>
            )}
            <Button disabled={submissionPending.run || submissionPending.submit || (type === SubmissionType.SUBMIT && !session.data?.user.id)} onClick={submitCode}>
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