import { HeroSection } from "@/components/HeroSection";
import { OpenContests } from "@/components/OpenContests";

export default async function Home() {
  return (
    <div>
      //TODO: Add invisible captcha
      <HeroSection />
      <OpenContests />
    </div>
  );
}
