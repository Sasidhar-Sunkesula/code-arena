"use client";

import { getSubmissions } from "@/app/actions/getSubmissions";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { SubmissionStatus } from "@prisma/client";
import SubmissionInfoCard from "./SubmissionInfoCard";

export type Submission = {
    id: number;
    status: SubmissionStatus;
    submittedCode: string;
    createdAt: Date;
    runTime: number | null;
    memory: number | null;
    testCasesPassed: number | null;
    testCaseCount: number;
};
type SubmissionResponse = {
    message?: string;
    submissions?: Submission[];
};
export function ProblemSubmissions({ problemId, contestId }: { problemId: number, contestId?: number }) {
    const [submissionList, setSubmissionList] = useState<SubmissionResponse | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchSubmissions() {
            try {
                const submissions = await getSubmissions(problemId, contestId);
                setSubmissionList(submissions);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Error while fetching submissions")
            } finally {
                setLoading(false)
            }
        }
        fetchSubmissions()
    }, []);
    if (loading) {
        return (
            <div className="flex justify-center items-center w-full md:min-h-96">
                <Loader2 className="w-5 animate-spin" />
            </div>
        )
    }
    return (
        <div>
            <Toaster />
            {!submissionList ? (
                <div className="md:h-[450px] border p-2 text-destructive font-semibold flex justify-center items-center">Error while fetching submissions</div>
            ) : (
                <div className="space-y-2 md:h-[450px] overflow-y-auto">
                    {contestId && <p className="text-sm text-center">Submissions shown here are contest specific.</p>}
                    {submissionList?.submissions?.map((submission) => (
                        <SubmissionInfoCard
                            key={submission.id}
                            submittedCode={submission.submittedCode}
                            status={submission.status}
                            createdAt={submission.createdAt}
                            runTime={submission.runTime}
                            memory={submission.memory}
                            testCasesPassed={submission.testCasesPassed}
                            testCaseCount={submission.testCaseCount}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}