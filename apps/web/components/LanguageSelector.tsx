"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/shad"
interface LanguageSelectorProps {
    languages: string[]
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
                    <SelectItem key={lang} value={lang}>
                        {lang}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}