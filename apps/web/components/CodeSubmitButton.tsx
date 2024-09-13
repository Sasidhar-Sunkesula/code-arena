"use client"

import { submitCode } from "@/app/actions/submitCode";
import { Button } from "@repo/ui/shad"
import Link from "next/link"
interface ButtonClientProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    linkTo: string;
    text: string;
}
export function CodeSubmitButton({ linkTo, text, ...props }: ButtonClientProps) {
    return (
        <Button onClick={() => submitCode()} asChild {...props}>
            <Link href={linkTo}>{text}</Link>
        </Button>
    )
}