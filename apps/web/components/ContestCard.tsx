import { Button } from "@repo/ui/shad"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/shad"
import { CalendarIcon, HashIcon, LayersIcon } from "lucide-react"

interface ContestCardProps {
    name: string
    problemCount: number
    level: string
    closesOn: string
}

export function ContestCard({ name, problemCount, level, closesOn }: ContestCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center">
                    <HashIcon className="mr-2 h-4 w-4" />
                    <span>{problemCount} Problems</span>
                </div>
                <div className="flex items-center">
                    <LayersIcon className="mr-2 h-4 w-4" />
                    <span>Level: {level}</span>
                </div>
                <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Closes on: {closesOn}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Participate</Button>
            </CardFooter>
        </Card>
    )
}