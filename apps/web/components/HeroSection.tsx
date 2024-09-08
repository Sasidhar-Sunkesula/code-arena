import { Button } from "@repo/ui/shad"
import Image from "next/image"

export function HeroSection() {
    return (
        <section className="pt-20 md:pt-24 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                        Master Coding Challenges
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Improve your coding skills with our diverse range of challenges. Practice, compete, and climb the leaderboard!
                    </p>
                    <div className="space-x-4 space-y-2">
                        <Button size="lg">Get Started</Button>
                        <Button size="lg" variant="outline">Learn More</Button>
                    </div>
                </div>
                <div className="relative h-[400px] md:h-[450px]">
                    <Image
                        src="https://g-gm9wqkgflk.vusercontent.net/placeholder.svg"
                        alt="Coding Challenge Platform"
                        layout="fill"
                        objectFit="cover"
                        loading="lazy"
                        className="rounded-lg"
                    />
                </div>
            </div>
        </section>
    )
}