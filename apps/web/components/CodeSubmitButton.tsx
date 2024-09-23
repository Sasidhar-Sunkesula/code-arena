"use client"

import { Button } from "@repo/ui/shad"
interface ButtonClientProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    fullCode: string;
}
export function CodeSubmitButton({ text, fullCode }: ButtonClientProps) {
    async function submitCode() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/submitCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                problemId: 1,
                submittedCode: fullCode,
                languageId: 2,
                contestId: 1
            })
        })
        const data = await response.json();
        console.log(data);
    }
    return (
        <Button onClick={submitCode}>
            {text}
        </Button>
    )
}