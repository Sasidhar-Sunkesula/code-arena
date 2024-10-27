"use client"

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'
import { SubmitCode } from './SubmitCode'
import toast, { Toaster } from 'react-hot-toast';
import { TestCaseResult, Submission, TestCase } from "@prisma/client";
import { ResultDisplay } from './ResultDisplay'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/shad'
import { Loader2Icon } from 'lucide-react'
import { ProblemSubmissions } from './ProblemSubmissions'
import { SubmissionType } from '@repo/common/types'

export interface Language {
    id: number;
    judge0Name: string;
    monacoName: string;
    judge0Id: number;
}
interface BoilerPlateWithLanguage {
    id: number;
    boilerPlateCode: string;
    languageId: number;
    problemId: number;
    language: Language
}
type TestCaseWithResult = TestCaseResult & {
    testCase: TestCase;
};
export type SubmissionData = Submission & {
    testCaseResults: TestCaseWithResult[]
}
export function CodeEditor({ boilerPlates, contestId }: { boilerPlates: BoilerPlateWithLanguage[], contestId?: string }) {
    const [selectedLanguage, setSelectedLanguage] = useState(boilerPlates[0]?.language.monacoName || "")
    const boilerPlateOfSelectedLang = boilerPlates.find((item) => item.language.monacoName === selectedLanguage)
    const [fullCode, setFullCode] = useState<string>(boilerPlateOfSelectedLang?.boilerPlateCode || "")
    const [submissionPending, setSubmissionPending] = useState<{ run: boolean, submit: boolean }>({ run: false, submit: false });
    const [submissionResults, setSubmissionResults] = useState<SubmissionData | null>(null);
    const [submitClicked, setSubmitClicked] = useState(false);

    useEffect(() => {
        setFullCode(boilerPlateOfSelectedLang?.boilerPlateCode || "")
    }, [boilerPlateOfSelectedLang])

    return (
        <div className='space-y-3'>
            <Toaster />
            <div className='flex items-center gap-x-3'>
                <label className='font-medium text-sm'>Select a language:</label>
                <LanguageSelector
                    languages={boilerPlates.map((item) => item.language)}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                />
            </div>
            <Tabs defaultValue="editor" className='space-y-3'>
                <TabsList className='w-[250px]'>
                    <TabsTrigger value="editor" className='w-[125px]'>Editor</TabsTrigger>
                    <TabsTrigger value="submissions" className='w-[125px]'>Submissions</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                    <Editor
                        height={"50vh"}
                        language={selectedLanguage}
                        value={fullCode}
                        onChange={(value) => setFullCode(value || '')}
                        theme="vs-dark"
                        loading={<Loader2Icon className='w-5 animate-spin' />}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 16,
                            padding: {
                                top: 6,
                                bottom: 4
                            },
                            smoothScrolling: true,
                            lineNumbers: 'on',
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            selectOnLineNumbers: true
                        }}
                    />
                </TabsContent>
                <TabsContent value="submissions">
                    {
                        boilerPlateOfSelectedLang?.problemId &&
                        <ProblemSubmissions
                            problemId={boilerPlateOfSelectedLang?.problemId}
                            contestId={(contestId && !isNaN(parseInt(contestId))) ? parseInt(contestId) : undefined}
                        />
                    }
                </TabsContent>
            </Tabs>
            {
                boilerPlateOfSelectedLang?.languageId || boilerPlateOfSelectedLang?.problemId
                    ? <div className="flex items-center gap-x-3 justify-end">
                        <SubmitCode
                            text="Run"
                            type={SubmissionType.RUN}
                            problemId={boilerPlateOfSelectedLang.problemId}
                            languageId={boilerPlateOfSelectedLang.languageId}
                            fullCode={fullCode}
                            submissionPending={submissionPending}
                            setSubmissionPending={setSubmissionPending}
                            setSubmissionResults={setSubmissionResults}
                            setSubmitClicked={setSubmitClicked}
                        />
                        <SubmitCode
                            text="Submit"
                            type={SubmissionType.SUBMIT}
                            contestId={contestId}
                            problemId={boilerPlateOfSelectedLang.problemId}
                            languageId={boilerPlateOfSelectedLang.languageId}
                            fullCode={fullCode}
                            submissionPending={submissionPending}
                            setSubmissionPending={setSubmissionPending}
                            setSubmissionResults={setSubmissionResults}
                            setSubmitClicked={setSubmitClicked}
                        />
                    </div>
                    : toast.error("Language not found, problem cannot be submitted")
            }
            {
                submitClicked && <ResultDisplay
                    submissionPending={submissionPending}
                    submissionResults={submissionResults}
                />
            }
        </div>
    )
}