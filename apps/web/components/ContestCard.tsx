import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/shad"
import { ArrowUpRight, ClockArrowDown, ClockArrowUp, Frown, HashIcon, LayersIcon } from "lucide-react"
import { ContestLevel } from "@prisma/client";
import { ContestRegister } from "./ContestRegister";
import Link from "next/link";

interface ContestCardProps {
    id: number;
    name: string;
    level: ContestLevel;
    startsOn: Date;
    closesOn: Date;
    _count: {
        problems: number
    },
    isRegistered: boolean;
    type: "current" | "upcoming";
}

export function ContestCard({ id, startsOn, isRegistered, type, name, level, closesOn, _count }: ContestCardProps) {
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
                    <ClockArrowUp className="mr-2 h-4 w-4" />
                    <span className="font-medium">{type === "upcoming" ? "Starts on :" : "Started on :"}</span>
                    <span className="ml-1">{startsOn.toUTCString()}</span>
                </div>
                <div className="flex items-center">
                    <ClockArrowDown className="mr-2 h-4 w-4" />
                    <span className="font-medium">Closes on :</span>
                    <span className="ml-1">{closesOn.toUTCString()}</span>
                </div>
            </CardContent>
            <CardFooter className="px-4">
                {
                    (isRegistered && type === "current") && (
                        <Link href={`/contest/${id}`}>
                            <Button>
                                Participate
                                <ArrowUpRight className="w-5 ml-1" />
                            </Button>
                        </Link>
                    )
                }
                {
                    (isRegistered && type === "upcoming") && (
                        <Button disabled>Registered!</Button>
                    )
                }
                {
                    (!isRegistered && type === "current") && (
                        <Button disabled>
                            Registrations Closed
                            <Frown className="w-5 ml-1" />
                        </Button>
                    )
                }
                {
                    (!isRegistered && type === "upcoming") && (
                        <ContestRegister contestId={id} />
                    )
                }
            </CardFooter>
        </Card>
    )
}