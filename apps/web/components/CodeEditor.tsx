"use client"

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'

export function CodeEditor() {
    const [mounted, setMounted] = useState(false)
    const [code, setCode] = useState("")
    const languages = ["javascript", "python", "java", "cpp"]
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0] || "")
    const handleSubmit = () => {
        console.log("Submitting code:", code)
        // Here you would typically send the code to your backend for evaluation
    }
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <>
            <LanguageSelector
                languages={languages}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
            />
            <Editor
                height={"60vh"}
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                defaultLanguage="javascript"
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