import { CodeXml } from "lucide-react";
import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <CodeXml className="h-6 w-6" />
            <span className="font-bold text-lg">CodeArena</span>
        </Link>
    )
}