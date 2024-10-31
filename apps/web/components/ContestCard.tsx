import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/shad"
import { CalendarIcon, HashIcon, LayersIcon } from "lucide-react"
import { ContestLevel } from "@prisma/client";
import Link from "next/link";

interface ContestCardProps {
    id: number;
    name: string;
    level: ContestLevel;
    closesOn: Date;
    _count: {
        problems: number
    }
}

export function ContestCard({ id, name, level, closesOn, _count }: ContestCardProps) {
    return (
        <Card className="md:w-10/12">
            <CardHeader className="p-4">
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[14px] px-4">
                <div className="flex items-center">
                    <HashIcon className="mr-2 h-4 w-4" />
                    <span>{_count.problems} Problems</span>
                </div>
                <div className="flex items-center">
                    <LayersIcon className="mr-2 h-4 w-4" />
                    <span className="font-medium">Level:</span>
                    <span className="ml-1">{level}</span>
                </div>
                <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="font-medium">Closes on:</span>
                    <span className="ml-1">{closesOn.toUTCString()}</span>
                </div>
            </CardContent>
            <CardFooter className="px-4">
                <Button className="w-full" asChild>
                    <Link href={`/contest/${id}`}>Participate</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}