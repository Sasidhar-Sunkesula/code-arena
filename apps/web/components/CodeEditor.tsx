"use client"

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'

export interface Language {
    id: number;
    judge0Name: string;
    monacoName: string;
    judge0Id: number;
}
interface BoilerPlate {
    id: number;
    boilerPlateCode: string;
    language: Language
}
export function CodeEditor({ boilerPlates }: { boilerPlates: BoilerPlate[] }) {
    const [selectedLanguage, setSelectedLanguage] = useState(boilerPlates[0]?.language.monacoName || "")
    const initialCode = boilerPlates.find((item) => item.language.monacoName === selectedLanguage)?.boilerPlateCode || ""
    const [code, setCode] = useState<string>(initialCode)

    useEffect(() => {
        setCode(initialCode)
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
                value={code}
                onChange={(value) => setCode(value || '')}
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
        </>
    )
}