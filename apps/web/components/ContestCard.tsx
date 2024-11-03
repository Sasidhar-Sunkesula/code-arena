import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/shad";
import { ArrowUpRight, ClockArrowDown, ClockArrowUp, Frown, HashIcon, LayersIcon } from "lucide-react";
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
        problems: number;
    };
    isRegistered: boolean;
    type: "current" | "upcoming" | "ended";
    isLoggedIn: boolean;
}
const formatDateToIST = (date: Date) => {
    const optionsDate: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long', // full month name  
        year: 'numeric'
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: "Asia/Kolkata"
    };

    const formattedDate = date.toLocaleDateString("en-IN", optionsDate);
    const formattedTime = date.toLocaleTimeString("en-IN", optionsTime);

    return `${formattedDate} ${formattedTime} IST`;
};
export function ContestCard({ id, startsOn, isRegistered, type, name, level, closesOn, _count, isLoggedIn }: ContestCardProps) {
    const renderActionButton = () => {
        if (!isLoggedIn) {
            if (type === "current") {
                return (
                    <Link href={`/contest/${id}`}>
                        <Button>
                            Participate
                            <ArrowUpRight className="w-5 ml-1" />
                        </Button>
                    </Link>
                );
            } else if (type === "upcoming") {
                return <ContestRegister contestId={id} />;
            }
        }

        switch (type) {
            case "current":
                return isRegistered ? (
                    <Link href={`/contest/${id}`}>
                        <Button>
                            Participate
                            <ArrowUpRight className="w-5 ml-1" />
                        </Button>
                    </Link>
                ) : (
                    <Button disabled>
                        Registrations Closed
                        <Frown className="w-5 ml-1" />
                    </Button>
                );
            case "upcoming":
                return isRegistered ? (
                    <Button disabled>Registered!</Button>
                ) : (
                    <ContestRegister contestId={id} />
                );
            case "ended":
                return (
                    <Link href={`/contest/${id}`}>
                        <Button>
                            View Results
                            <ArrowUpRight className="w-5 ml-1" />
                        </Button>
                    </Link>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="md:w-10/12">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
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
                    <span className="ml-1">{formatDateToIST(startsOn)}</span>
                </div>
                <div className="flex items-center">
                    <ClockArrowDown className="mr-2 h-4 w-4" />
                    <span className="font-medium">Closes on :</span>
                    <span className="ml-1">{formatDateToIST(closesOn)}</span>
                </div>
            </CardContent>
            <CardFooter>
                {renderActionButton()}
            </CardFooter>
        </Card>
    );
}