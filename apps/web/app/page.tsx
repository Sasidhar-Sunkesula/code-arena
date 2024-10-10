import { HeroSection } from "@/components/HeroSection";
import { OpenContests } from "@/components/OpenContests";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="px-4 md:px-8">
        <h2 className="text-3xl font-bold">Open Contests</h2>
      </div>
      <section className="px-4 py-2 md:px-8 md:py-4">
        <OpenContests />
      </section>
    </div>
  );
}
