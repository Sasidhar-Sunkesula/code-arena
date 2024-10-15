import { useState } from "react";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/shad";
import { Editor } from "@monaco-editor/react";
import { Loader2Icon } from "lucide-react";
import { BoilerplateCodes } from "./StepperWithForm";

interface ConfirmationTestProps {
    boilerplateCodes: BoilerplateCodes;
}

export function ConfirmationTest({ boilerplateCodes }: ConfirmationTestProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [code, setCode] = useState<string>("");

    // Filter languages to only include those with non-empty boilerplate code
    const filteredLanguages = Object.keys(boilerplateCodes).filter(
        (language) => boilerplateCodes[language]?.trim() !== ""
    );

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        setCode(boilerplateCodes[language] ?? "");
    };

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
                    The boilerplate code should contain a function that the user has to implement and the input handling code for that function. The input handling code should also call the function.
                </p>
            </div>
        </div>
    );
}