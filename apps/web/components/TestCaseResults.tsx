import { formatMemory, formatRunTime } from "@/lib/utils";
import { SubmissionStatus } from "@prisma/client";
import { SubmissionStatusDisplay } from "@repo/common/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/shad";
import { Check, Cpu, Timer, X } from "lucide-react";
import React from "react";
import { CodeBlock } from "./CodeBlock";
import { SubmissionData } from "./CodeEditor";

export function TestCaseResults({ submissionResults }: { submissionResults: SubmissionData }) {
    const syntaxError = submissionResults.testCaseResults.find(result => result.stderr && result.stderr.includes('SyntaxError'));

    if (syntaxError) {
        return (
            <div className='flex flex-col gap-y-3'>
                <div className='font-semibold text-xl'>{submissionResults.status}</div>
                <div className="text-destructive bg-red-50 dark:bg-red-500/15 dark:text-red-400 text-sm tracking-wider p-2">
                    {syntaxError.stderr}
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-y-3'>
            <div className="flex items-center justify-between py-1">
                <div className={`font-semibold text-xl ${submissionResults.status === SubmissionStatus.Accepted ? "text-green-600" : "text-red-600"}`}>
                    {SubmissionStatusDisplay[submissionResults.status]}
                </div>
                <div className="flex items-center gap-x-4">
                    <div className="text-sm flex items-center gap-x-1">
                        <Timer className="w-3" /> {formatRunTime(submissionResults.runTime)} ms
                    </div>
                    <div className="text-sm flex items-center gap-x-1">
                        <Cpu className="w-3" /> {formatMemory(submissionResults.memory)} MB
                    </div>
                </div>
            </div>
            <Tabs defaultValue="0" className="w-full space-y-3">
                <TabsList className="space-x-3">
                    {
                        submissionResults.testCaseResults.map((result, index) => (
                            <TabsTrigger key={index} value={index.toString()}>
                                {result.status === SubmissionStatus.Accepted
                                    ? <Check className="w-5 mr-1 text-green-500" />
                                    : <X className="w-5 mr-1" />}
                                Case {index + 1}
                            </TabsTrigger>
                        ))
                    }
                </TabsList>
                {
                    submissionResults.testCaseResults.map((result, index) => (
                        <TabsContent key={index} value={index.toString()} className="flex flex-col gap-y-3">
                            {result.stderr && result.status !== "Accepted" ? (
                                <>
                                    <CodeBlock title="Status" content={SubmissionStatusDisplay[result.status]} />
                                    <div className="text-destructive bg-red-50 dark:bg-red-500/15 dark:text-red-400 rounded-sm text-sm tracking-wider p-2">
                                        {result.stderr}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <CodeBlock title="Status" content={result.status} />
                                    <CodeBlock title="Input" content={result.testCase.input} />
                                    <CodeBlock title="Expected Output" content={result.testCase.expectedOutput} />
                                    <CodeBlock title="Your Output" content={result.stdout === "undefined\n" ? "No output" : result.stdout} />
                                </>
                            )}
                        </TabsContent>
                    ))
                }
            </Tabs>
        </div>
    );
}