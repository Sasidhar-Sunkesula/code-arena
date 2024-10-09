import { HeroSection } from "@/components/HeroSection";
import { OpenContests } from "@/components/OpenContests";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="px-4 md:px-8">
        <h2 className="text-3xl text-center font-bold">Open Contests</h2>
      </div>
      <OpenContests />
    </div>
  );
}
