"use client"

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'
import { CodeSubmitButton } from "@/components/CodeSubmitButton"
import toast, { Toaster } from 'react-hot-toast';
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
export function CodeEditor({ boilerPlates, contestId }: { boilerPlates: BoilerPlate[], contestId?: string }) {
    const [selectedLanguage, setSelectedLanguage] = useState(boilerPlates[0]?.language.monacoName || "")
    const boilerPlate = boilerPlates.find((item) => item.language.monacoName === selectedLanguage)
    const [fullCode, setFullCode] = useState<string>(boilerPlate?.boilerPlateCode || "")

    useEffect(() => {
        setFullCode(boilerPlate?.boilerPlateCode || "")
    }, [boilerPlate])
    return (
        <>
            <Toaster />
            <LanguageSelector
                languages={boilerPlates.map((item) => item.language)}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
            />
            <Editor
                height={"60vh"}
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
            {
                boilerPlate?.languageId || boilerPlate?.problemId
                    ?
                    <div className="flex justify-end">
                        <CodeSubmitButton text="Submit" contestId={contestId} problemId={boilerPlate.problemId} languageId={boilerPlate.languageId} fullCode={fullCode} />
                    </div>
                    :
                    toast.error("Language not found, problem cannot be submitted")
            }
        </>
    )
}