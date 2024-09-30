"use client"

import { Loader2 } from 'lucide-react'
import { SubmissionData } from './CodeEditor';
import { TestCaseResults } from './TestCaseResults';

interface ResultDisplayProps {
    submissionPending: boolean;
    submissionResults: SubmissionData | null
}
export function ResultDisplay({ submissionPending, submissionResults }: ResultDisplayProps) {
    return (
        <div className='border rounded-lg p-3 shadow-md'>
            {
                submissionPending
                    ? <div className='flex min-h-40 justify-center items-center'>
                        <Loader2 className='animate-spin w-6' />
                    </div>
                    : submissionResults
                        ? <TestCaseResults submissionResults={submissionResults} />
                        : <div>Unable to get the submission results</div>
            }
        </div>
    )
}