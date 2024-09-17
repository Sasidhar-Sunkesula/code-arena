import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/shad"
import { CalendarIcon, HashIcon, LayersIcon } from "lucide-react"
import { ButtonClient } from "./ButtonClient"
import { ContestLevel } from "@prisma/client";

interface ContestCardProps {
    id: number;
    name: string;
    noOfProblems: number;
    level: ContestLevel;
    closesOn: Date;
}

export function ContestCard({ id, name, noOfProblems, level, closesOn }: ContestCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center">
                    <HashIcon className="mr-2 h-4 w-4" />
                    <span>{noOfProblems} Problems</span>
                </div>
                <div className="flex items-center">
                    <LayersIcon className="mr-2 h-4 w-4" />
                    <span>Level: {level}</span>
                </div>
                <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Closes on: {closesOn.toUTCString()}</span>
                </div>
            </CardContent>
            <CardFooter>
                <ButtonClient linkTo={`/contest/${id}`} text="Participate" className="w-full" />
            </CardFooter>
        </Card>
    )
}