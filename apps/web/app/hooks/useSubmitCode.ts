import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { SubmissionData, SubmissionPendingObj } from "@/components/CodeEditor";
import { SubmissionType, SubmitCodeSchema } from "@repo/common/types";

type UseSubmitCodeProps = {
    fullCode: string;
    languageId: number;
    problemId?: number;
    contestId?: string;
    type: SubmissionType;
    testCases?: {
        input: string;
        expectedOutput: string;
    }[];
    submissionPending: SubmissionPendingObj
    setSubmissionPending: React.Dispatch<React.SetStateAction<SubmissionPendingObj>>;
    setSubmissionResults: React.Dispatch<React.SetStateAction<SubmissionData | null>>;
    setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

type SubmissionToken = {
    token: string;
};

export function useSubmitCode({
    fullCode,
    languageId,
    problemId,
    contestId,
    submissionPending,
    type,
    testCases,
    setSubmissionPending,
    setSubmissionResults,
    setSubmitClicked
}: UseSubmitCodeProps) {
    const [submissionTokens, setSubmissionTokens] = useState<SubmissionToken[] | null>(null);
    const [submissionId, setSubmissionId] = useState<number | null>(null);

    async function submitCode() {
        setSubmissionResults(null);
        try {
            const requestBody: SubmitCodeSchema = {
                problemId: problemId,
                submittedCode: fullCode,
                languageId: languageId,
                type: type,
                testCases: testCases,
                ...(contestId && !isNaN(parseInt(contestId)) ? { contestId: parseInt(contestId) } : {})
            };
            setSubmitClicked(true);
            type === SubmissionType.RUN
                ? setSubmissionPending(prev => ({ ...prev, run: true, submit: false }))
                : setSubmissionPending(prev => ({ ...prev, run: false, submit: true }))
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
            if (type === SubmissionType.RUN) {
                setSubmissionTokens(submissionData.submissionTokens);
            } else {
                setSubmissionId(submissionData.submissionId);
            }
        } catch (error) {
            setSubmissionPending({ run: false, submit: false })
            toast.error(error instanceof Error ? error.message : "An error occurred while submitting");
        }
    }

    useEffect(() => {
        if (submissionPending.run || submissionPending.submit) {
            const intervalId = setInterval(async () => {
                try {
                    if (type === SubmissionType.RUN && submissionTokens) {
                        const resultResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check/run`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                problemId: problemId,
                                submissionTokens: submissionTokens.map((tokenObj) => tokenObj.token)
                            })
                        });
                        const submissionResult = await resultResponse.json();
                        if (!resultResponse.ok) {
                            throw new Error(submissionResult.msg);
                        }
                        // Check if the condition to stop polling is met
                        if (submissionResult?.msg !== "PENDING") {
                            clearInterval(intervalId);
                            setSubmissionPending(prev => ({ ...prev, run: false }))
                            setSubmissionResults(submissionResult.data);
                        }
                    } else if (type === SubmissionType.SUBMIT && submissionId) {
                        const resultResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check/submit/${submissionId}`);
                        const submissionResult = await resultResponse.json();
                        if (!resultResponse.ok) {
                            throw new Error(submissionResult.msg);
                        }
                        // Check if the condition to stop polling is met
                        if (submissionResult?.msg !== "PENDING") {
                            clearInterval(intervalId);
                            setSubmissionPending(prev => ({ ...prev, submit: false }))
                            setSubmissionResults(submissionResult.data);
                            submissionResult.data.status === "Accepted" && toast.success("Problem Submitted!")
                        }
                    }
                } catch (error) {
                    setSubmissionPending({ run: false, submit: false })
                    toast.error(error instanceof Error ? error.message : "Error while fetching results");
                }
            }, 1000);

            // Cleanup interval on component unmount
            return () => clearInterval(intervalId);
        }
    }, [submissionTokens, submissionId]);

    return { submitCode };
}