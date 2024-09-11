import { Button } from "@repo/ui/shad"
import Link from "next/link"

export function ButtonClient({ linkTo, text, onClick }: { linkTo: string, text: string, onClick?: () => void }) {
    return (
        <Button onClick={onClick} asChild className="w-full">
            <Link href={linkTo}>{text}</Link>
        </Button>
    )
}