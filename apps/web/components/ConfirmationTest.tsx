import { useState } from "react";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/shad";
import { Editor } from "@monaco-editor/react";
import { Loader2Icon } from "lucide-react";
import { BoilerplateCodes } from "./StepperWithForm";
import { CodeSubmitButton } from "./CodeSubmitButton";
import { SubmissionType } from "@repo/common/types";
import { Language, SubmissionData } from "./CodeEditor";
import { ResultDisplay } from "./ResultDisplay";
import toast, { Toaster } from "react-hot-toast";

interface ConfirmationTestProps {
    boilerplateCodes: BoilerplateCodes;
    languages: Language[];
    createdProblemId: number;
}

export function ConfirmationTest({ boilerplateCodes, languages, createdProblemId }: ConfirmationTestProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [submissionPending, setSubmissionPending] = useState(false);
    const [submissionResults, setSubmissionResults] = useState<SubmissionData | null>(null);
    const [submitClicked, setSubmitClicked] = useState(false);

    // Filter languages to only include those with non-empty boilerplate code
    const filteredLanguages = Object.keys(boilerplateCodes).filter(
        (language) => boilerplateCodes[language]?.trim() !== ""
    );

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        setCode(boilerplateCodes[language] ?? "");
    };
    const filteredLangInfo = languages.find((languageInfo) => languageInfo.judge0Name === selectedLanguage)
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Select Language</Label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredLanguages.map((language) => (
                            <SelectItem key={language} value={language}>
                                {language}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="mt-2 text-sm text-gray-500">
                    Select the language for which you have provided the boilerplate code.
                </p>
            </div>
            <div className="space-y-2">
                <Label>Boilerplate Code</Label>
                <Editor
                    height={"50vh"}
                    language={selectedLanguage}
                    value={code}
                    onChange={(value) => setCode(value || "")}
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
                {filteredLangInfo
                    ? <div className="flex justify-end">
                        <CodeSubmitButton
                            text="Submit"
                            type={SubmissionType.CONFIRMATION_TEST}
                            problemId={createdProblemId}
                            languageId={filteredLangInfo.id}
                            fullCode={code}
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