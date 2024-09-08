import { getServerSession } from "next-auth";
import AppBar from "@/components/AppBar";
import { authOptions } from "@/lib/auth";
import { HeroSection } from "@/components/HeroSection";
import { OpenContests } from "@/components/OpenContests";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <AppBar session={session} />
      <HeroSection />
      <OpenContests />
    </div>
  );
}
