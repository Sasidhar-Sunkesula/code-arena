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
import { editorOptions } from './BoilerplateCodeForm'
import { SubmissionStand } from './SubmissionStand'
import { getSubmissionStand } from '@/app/actions/getSubmissionStand'
import { formatMemory, formatRunTime } from '@/lib/utils'

export interface Language {
    id: number;
    judge0Name: string;
    monacoName: string;
    judge0Id: number;
}
interface BoilerPlateWithLanguage {
    id: number;
    initialFunction: string;
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
export type SubmissionPendingObj = { run: boolean, submit: boolean };

export function CodeEditor({ userType, tempId, boilerPlates, contestId }: { userType?: string, tempId?: string, boilerPlates: BoilerPlateWithLanguage[], contestId?: string }) {
    const [selectedLanguage, setSelectedLanguage] = useState(boilerPlates[0]?.language.monacoName || "")
    const boilerPlateOfSelectedLang = boilerPlates.find((item) => item.language.monacoName === selectedLanguage)
    const [fullCode, setFullCode] = useState<string>(boilerPlateOfSelectedLang?.initialFunction || "")
    const [submissionPending, setSubmissionPending] = useState<SubmissionPendingObj>({ run: false, submit: false });
    const [submissionResults, setSubmissionResults] = useState<SubmissionData | null>(null);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [submissionsData, setSubmissionsData] = useState<{ memory: number; runTime: number }[] | null>(null);

    useEffect(() => {
        setFullCode(boilerPlateOfSelectedLang?.initialFunction || "")
    }, [boilerPlateOfSelectedLang])

    useEffect(() => {
        async function fetchSubmissionsData() {
            try {
                const data = await getSubmissionStand(submissionResults!.problemId, contestId ? parseInt(contestId) : undefined);
                if (!data.formattedData || data.msg) {
                    throw new Error(data.msg)
                }
                console.log(data);
                setSubmissionsData(data.formattedData);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to fetch submissions data");
            }
        }
        submissionResults && submitClicked && fetchSubmissionsData();
    }, [submissionResults, submitClicked]);
    return (
        <div className='space-y-3'>
            <div className='flex items-center gap-x-3'>
                <label className='font-medium text-sm'>Select a language:</label>
                <LanguageSelector
                    languages={boilerPlates.map((item) => item.language)}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                />
            </div>
            <Tabs defaultValue="editor" className='space-y-3'>
                <TabsList>
                    <TabsTrigger value="editor" className='w-[125px]'>Editor</TabsTrigger>
                    <TabsTrigger value="submissions" className='w-[125px]'>Submissions</TabsTrigger>
                    {submissionResults && submissionsData && <TabsTrigger value="lastSubmission" className='w-[125px]'>Last Submission</TabsTrigger>}
                </TabsList>
                <TabsContent value="editor">
                    <Editor
                        height={"50vh"}
                        language={selectedLanguage}
                        value={fullCode}
                        onChange={(value) => setFullCode(value || '')}
                        theme="vs-dark"
                        loading={<Loader2Icon className='w-5 animate-spin' />}
                        options={editorOptions}
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
                <TabsContent value='lastSubmission'>
                    {(() => {
                        if (submissionsData && submissionResults) {
                            const runTime = formatRunTime(submissionResults.runTime);
                            const memory = formatMemory(submissionResults.memory);
                            return <SubmissionStand
                                chartData={submissionsData}
                                currentSubmission={{ runTime, memory }}
                            />
                        }
                    })()}
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
                            tempId={tempId}
                            userType={userType}
                            submissionPending={submissionPending}
                            setSubmissionPending={setSubmissionPending}
                            setSubmissionResults={setSubmissionResults}
                            setSubmitClicked={setSubmitClicked}
                        />
                    </div>
                    : toast.error("Language not found, problem cannot be submitted")
            }
            {submitClicked && <ResultDisplay
                submissionPending={submissionPending}
                submissionResults={submissionResults}
            />}
            <Toaster />
        </div>
    )
}