"use client"

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'

export function CodeEditor() {
    const [mounted, setMounted] = useState(false)
    const [code, setCode] = useState("")
    const languages = ["JavaScript", "Python", "Java", "C++"]
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
                height="400px"
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </>
    )
}