"use client"

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'
import { CodeSubmitButton } from "@/components/CodeSubmitButton"
import toast, { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react'
import { TestCaseResult, Submission } from "@prisma/client";

export interface Language {
    id: number;
    judge0Name: string;
    monacoName: string;
    judge0Id: number;
}
interface BoilerPlate {
    id: number;
    boilerPlateCode: string;
    languageId: number;
    problemId: number;
    language: Language
}
export type SubmissionData = Submission & {
    testCaseResults: TestCaseResult[];
}
export function CodeEditor({ boilerPlates, contestId }: { boilerPlates: BoilerPlate[], contestId?: string }) {
    const [selectedLanguage, setSelectedLanguage] = useState(boilerPlates[0]?.language.monacoName || "")
    const boilerPlate = boilerPlates.find((item) => item.language.monacoName === selectedLanguage)
    const [fullCode, setFullCode] = useState<string>(boilerPlate?.boilerPlateCode || "")
    const [submissionPending, setSubmissionPending] = useState(false);
    const [submissionResults, setSubmissionResults] = useState<SubmissionData | null>(null);

    useEffect(() => {
        setFullCode(boilerPlate?.boilerPlateCode || "")
    }, [boilerPlate])
    return (
        <div className='space-y-3'>
            <Toaster />
            <div className='flex items-center justify-between'>
                <LanguageSelector
                    languages={boilerPlates.map((item) => item.language)}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                />
                {
                    boilerPlate?.languageId || boilerPlate?.problemId
                        ?
                        <div className="flex justify-end">
                            <CodeSubmitButton
                                text="Submit"
                                contestId={contestId}
                                problemId={boilerPlate.problemId}
                                languageId={boilerPlate.languageId}
                                fullCode={fullCode}
                                submissionPending={submissionPending}
                                setSubmissionPending={setSubmissionPending}
                                setSubmissionResults={setSubmissionResults}
                            />
                        </div>
                        :
                        toast.error("Language not found, problem cannot be submitted")
                }
            </div>
            <Editor
                height={"50vh"}
                language={selectedLanguage}
                value={fullCode}
                onChange={(value) => setFullCode(value || '')}
                theme="vs-dark"
                loading="Editor is loading..."
                options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    selectOnLineNumbers: true
                }}
            />
            <div>
                {
                    submissionPending
                        ? <Loader2 className='animate-spin w-6' />
                        : JSON.stringify(submissionResults)
                }
            </div>
        </div>
    )
}