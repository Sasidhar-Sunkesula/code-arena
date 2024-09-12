"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/shad"
import { Language } from "./CodeEditor"
interface LanguageSelectorProps {
    languages: Language[]
    selectedLanguage: string
    setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>
}
export function LanguageSelector({ selectedLanguage, setSelectedLanguage, languages }: LanguageSelectorProps) {
    return (
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.monacoName}>
                        {lang.displayName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}