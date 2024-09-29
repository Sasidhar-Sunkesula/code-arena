import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/shad";
import { SubmissionData } from "./CodeEditor";
import { Cpu, Hourglass } from "lucide-react";

export function TestCaseResults({ submissionResults }: { submissionResults: SubmissionData }) {
    return (
        <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-xl'>{submissionResults.status}</div>
            <Tabs defaultValue={submissionResults.testCaseResults[0]?.id.toString()} className="w-full">
                <TabsList>
                    {
                        submissionResults.testCaseResults.map((result, index) => (
                            <TabsTrigger key={result.id} value={result.id.toString()}>Case {index + 1}</TabsTrigger>
                        ))
                    }
                </TabsList>
                {
                    submissionResults.testCaseResults.map((result) => (
                        <TabsContent key={result.id} value={result.id.toString()} className="flex flex-col gap-y-3">
                            <div className="flex items-center justify-between p-1">
                                <div className="font-medium">{result.status}</div>
                                <div className="flex items-center gap-x-4">
                                    <div className="text-sm flex items-center gap-x-1"><Hourglass className="w-3" /> {result.time.toFixed(2)} sec</div>
                                    <div className="text-sm flex items-center gap-x-1"><Cpu className="w-3" /> {(result.memory / 1024).toFixed(1)} MB</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-sm">Input</div>
                                <code className="py-2 px-4 bg-secondary">{result.testCase.input}</code>
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-sm">Your Output</div>
                                <code className="py-2 px-4 bg-secondary">{result.stdout}</code>
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-sm">Expected Output</div>
                                <code className="py-2 px-4 bg-secondary">{result.testCase.expectedOutput}</code>
                            </div>
                        </TabsContent>
                    ))
                }
            </Tabs>
        </div>
    )
}