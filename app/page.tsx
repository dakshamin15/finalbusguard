import dynamic from "next/dynamic";
import StatsBento from "@/components/StatsBento";
import Achievements from "@/components/Achievements";
import HowItWorks from "@/components/HowItWorks";
import TechnologySection from "@/components/TechnologySection";
import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";

// Three.js uses browser-only globals at module init — skip SSR entirely
const BusGuardHero = dynamic(() => import("@/components/BusGuardHero"), { ssr: false });

export default function Home() {
  return (
    <>
      <BusGuardHero />
      <StatsBento />
      <Achievements />
      <HowItWorks />
      <TechnologySection />
      <SocialProof />
      <Pricing />
    </>
  );
}
