import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/shad"
import { CalendarIcon, HashIcon, LayersIcon } from "lucide-react"
import { ContestLevel } from "@prisma/client";
import { ContestRegister } from "./ContestRegister";
import Link from "next/link";

interface ContestCardProps {
    id: number;
    name: string;
    level: ContestLevel;
    closesOn: Date;
    _count: {
        problems: number
    },
    isRegistered: boolean;
    type: "open" | "upcoming";
}

export function ContestCard({ id, isRegistered, type, name, level, closesOn, _count }: ContestCardProps) {
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
                {
                    isRegistered
                        ? type === "open"
                            ? <Link href={`/contest/${id}`}>
                                <Button>Participate</Button>
                            </Link>
                            : <Button className="w-full md:w-28" disabled>Registered!</Button>
                        : <ContestRegister contestId={id} />
                }
            </CardFooter>
        </Card>
    )
}