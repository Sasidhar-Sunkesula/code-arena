"use client"

import { useEffect, useRef, useState } from "react";
import { Label, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/shad";
import { Editor } from "@monaco-editor/react";
import { CheckCircle2, Loader2Icon } from "lucide-react";
import { CodeSubmitButton } from "./SubmitCode";
import { SubmissionType } from "@repo/common/types";
import { Language, SubmissionData } from "./CodeEditor";
import { ResultDisplay } from "./ResultDisplay";
import toast, { Toaster } from "react-hot-toast";
import { BoilerplateCodes } from "./ProblemContributionForm";

interface ConfirmationTestProps {
    boilerplateCodes: BoilerplateCodes;
    languages: Language[];
    setAllDone: React.Dispatch<React.SetStateAction<boolean>>
}

export function ConfirmationTest({ boilerplateCodes, languages, setAllDone }: ConfirmationTestProps) {
    // Filter languages to only include those with non-empty boilerplate code
    const filteredLanguages = Object.keys(boilerplateCodes).filter(
        (language) => boilerplateCodes[language]?.trim() !== ""
    );
    const [selectedLanguage, setSelectedLanguage] = useState<string>(filteredLanguages[0] ?? "");
    const [code, setCode] = useState<BoilerplateCodes>(boilerplateCodes);
    const [submissionPending, setSubmissionPending] = useState(false);
    const [submissionResults, setSubmissionResults] = useState<SubmissionData | null>(null);
    const [submitClicked, setSubmitClicked] = useState(false);
    const selectedLangInfo = languages.find((lang) => lang.judge0Name === selectedLanguage)
    const acceptedLanguagesRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (submissionResults && submissionResults.status === "Accepted" && submissionResults.languageId === languages.find((lang) => lang.judge0Name === selectedLanguage)?.id) {
            if (!acceptedLanguagesRef.current.has(selectedLanguage)) {
                acceptedLanguagesRef.current.add(selectedLanguage);
                if (acceptedLanguagesRef.current.size === filteredLanguages.length) {
                    setAllDone(true);
                }
            }
        }
    }, [submissionResults, filteredLanguages.length, languages, selectedLanguage, setAllDone]);

    function handleCodeChange(lang: string, code: string) {
        setCode(prev => ({
            ...prev,
            [lang]: code
        }));
    }
    function handleLanguageChange(lang: string) {
        setSelectedLanguage(lang);
    }
    return (
        <div className="space-y-4">
            <Label>Select Language</Label>
            <Tabs defaultValue={selectedLanguage} className='space-y-3' onValueChange={handleLanguageChange}>
                <TabsList>
                    {
                        filteredLanguages.map((lang) => (
                            <TabsTrigger key={lang} value={lang}>
                                {lang}
                                {submissionResults && submissionResults.status === "Accepted" && submissionResults.languageId === selectedLangInfo?.id && (
                                    <CheckCircle2 className="w-5 text-green-500" />
                                )}
                            </TabsTrigger>
                        ))
                    }
                </TabsList>
                {
                    filteredLanguages.map((lang) => (
                        <TabsContent key={lang} value={lang}>
                            <Label>Boilerplate Code</Label>
                            <Editor
                                height={"50vh"}
                                language={selectedLangInfo?.monacoName}
                                value={code[lang]}
                                onChange={(value) => handleCodeChange(lang, value ?? "")}
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
                        </TabsContent>
                    ))
                }
            </Tabs>
            <div className="space-y-2">
                {
                    selectedLangInfo && code[selectedLanguage]
                        ? <div className="flex justify-end">
                            <CodeSubmitButton
                                text="Submit"
                                type={SubmissionType.CONFIRMATION_TEST}
                                languageId={selectedLangInfo.id}
                                fullCode={code[selectedLanguage]}
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