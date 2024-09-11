import { Button } from "@repo/ui/shad"
import Link from "next/link"
interface ButtonClientProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    linkTo: string;
    text: string;
    onClick?: () => void
}
export function ButtonClient({ linkTo, text, onClick, ...props }: ButtonClientProps) {
    return (
        <Button onClick={onClick} asChild {...props}>
            <Link href={linkTo}>{text}</Link>
        </Button>
    )
}