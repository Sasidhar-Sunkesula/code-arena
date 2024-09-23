"use client"

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'
import { CodeSubmitButton } from "@/components/CodeSubmitButton"

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
export function CodeEditor({ boilerPlates }: { boilerPlates: BoilerPlate[] }) {
    const [selectedLanguage, setSelectedLanguage] = useState(boilerPlates[0]?.language.monacoName || "")
    const initialCode = boilerPlates.find((item) => item.language.monacoName === selectedLanguage)?.boilerPlateCode || ""
    const [fullCode, setFullCode] = useState<string>(initialCode)

    useEffect(() => {
        setFullCode(initialCode)
    }, [initialCode])
    return (
        <>
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
            <div className="flex justify-end">
                <CodeSubmitButton text="Submit" fullCode={fullCode} />
            </div>
        </>
    )
}