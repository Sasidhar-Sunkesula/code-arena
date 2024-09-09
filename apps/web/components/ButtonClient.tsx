import { Button } from "@repo/ui/shad"
import Link from "next/link"

export function ButtonClient({ linkTo }: { linkTo: string }) {
    return (
        <Button asChild className="w-full">
            <Link href={linkTo}>Participate</Link>
        </Button>
    )
}