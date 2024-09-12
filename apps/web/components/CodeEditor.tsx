"use client"

import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'

export function CodeEditor() {
    const [code, setCode] = useState("")
    const languages = ["javascript", "python", "java", "cpp"]
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0] || "")
    const handleSubmit = () => {
        console.log("Submitting code:", code)
        // Here you would typically send the code to your backend for evaluation
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