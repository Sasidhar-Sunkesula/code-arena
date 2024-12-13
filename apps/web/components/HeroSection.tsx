import { Button } from "@repo/ui/shad";
import Image from "next/image";
import { DemoButton } from "./DemoButton";

export function HeroSection() {
  return (
    <section className="p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Master Coding Challenges
          </h1>
          <p className="text-lg text-muted-foreground">
            Improve your coding skills with our diverse range of challenges.
            Practice, compete, and climb the leaderboard!
          </p>
          <div className="space-x-4 space-y-2">
            <DemoButton />
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
        <div className="relative h-[420px]">
          <Image
            src="/hero.png"
            alt="Coding Challenge Platform"
            layout="fill"
            loading="lazy"
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
