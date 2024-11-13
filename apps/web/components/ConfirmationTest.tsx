"use client"

import { useEffect, useRef, useState } from "react";
import { Label, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/shad";
import { Editor } from "@monaco-editor/react";
import { CheckCircle2, Loader2Icon } from "lucide-react";
import { SubmitCode } from "./SubmitCode";
import { SubmissionType } from "@repo/common/types";
import { Language, SubmissionData, SubmissionPendingObj } from "./CodeEditor";
import { ResultDisplay } from "./ResultDisplay";
import toast, { Toaster } from "react-hot-toast";
import { Boilerplate } from "./ProblemContributionForm";

interface ConfirmationTestProps {
    boilerplateCodes: Boilerplate[];
    languages: Language[];
    testCases: {
        input: string;
        expectedOutput: string;
    }[];
    setAllDone: React.Dispatch<React.SetStateAction<boolean>>
}

export function ConfirmationTest({ boilerplateCodes, testCases, languages, setAllDone }: ConfirmationTestProps) {
    const filteredBpc = boilerplateCodes.filter(bpc => bpc.callerCode.length > 50 && bpc.initialFunction.length > 50)
    const [selectedLanguage, setSelectedLanguage] = useState<string>(filteredBpc[0]?.judge0Name!);
    const [code, setCode] = useState<string>(filteredBpc[0]?.initialFunction ?? "");
    const [submissionPending, setSubmissionPending] = useState<SubmissionPendingObj>({ run: false, submit: false });
    const [submissionResults, setSubmissionResults] = useState<SubmissionData | null>(null);
    const [submitClicked, setSubmitClicked] = useState(false);
    const selectedLangInfo = languages.find(lang => lang.judge0Name === selectedLanguage);
    const acceptedLanguagesRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (submissionResults && submissionResults.status === "Accepted" && submissionResults.languageId === languages.find((lang) => lang.judge0Name === selectedLanguage)?.id) {
            if (!acceptedLanguagesRef.current.has(selectedLanguage)) {
                acceptedLanguagesRef.current.add(selectedLanguage);
                if (acceptedLanguagesRef.current.size === filteredBpc.length) {
                    setAllDone(true);
                }
            }
        }
    }, [submissionResults]);

    return (
        <div className="space-y-4">
            <Label>Select Language</Label>
            <Tabs
                defaultValue={selectedLanguage}
                className='space-y-3'
                onValueChange={(value) => setSelectedLanguage(value)}
            >
                <TabsList>
                    {
                        filteredBpc.map(bpc => (
                            <TabsTrigger key={bpc.judge0Name} value={selectedLanguage}>
                                {selectedLanguage}
                                {submissionResults && submissionResults.status === "Accepted" && submissionResults.languageId === selectedLangInfo?.id && (
                                    <CheckCircle2 className="w-5 text-green-500" />
                                )}
                            </TabsTrigger>
                        ))
                    }
                </TabsList>
                {
                    filteredBpc.map(bpc => (
                        <TabsContent key={bpc.judge0Name} value={selectedLanguage} className="space-y-10">
                            <div>
                                <Label>Boilerplate Function</Label>
                                <Editor
                                    height={"20vh"}
                                    width={"45vw"}
                                    language={selectedLangInfo?.monacoName}
                                    value={code}
                                    onChange={(value) => setCode(value ?? "")}
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
                                <p className="mt-2 text-sm text-gray-500">
                                    You should solve and test the problem with all the languages that you have submitted the boilerplate code.
                                </p>
                            </div>
                            <div>
                                <Label>Caller Code</Label>
                                <Editor
                                    height={"30vh"}
                                    width={"45vw"}
                                    language={selectedLangInfo?.monacoName}
                                    value={bpc.callerCode}
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
                                        selectOnLineNumbers: true,
                                        readOnly: true,
                                        readOnlyMessage: { value: "To edit caller code please go back to step 2", isTrusted: true }
                                    }}
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    To edit caller code please go back to step 2 and come back here.
                                </p>
                            </div>
                        </TabsContent>
                    ))
                }
            </Tabs>
            <div className="space-y-2">
                {
                    selectedLangInfo
                        ? <div className="flex justify-end">
                            <SubmitCode
                                text="Run"
                                testCases={testCases}
                                type={SubmissionType.RUN}
                                languageId={selectedLangInfo.id}
                                fullCode={`${code.trim()}\n${filteredBpc.find(bpc => bpc.judge0Name === selectedLanguage)?.callerCode}`}
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
            <Toaster />
        </div>
    );
}