import dynamic from "next/dynamic";
import BusGuardExplainer from "@/components/BusGuardExplainer";
import SocialProof from "@/components/SocialProof";

// Three.js uses browser-only globals at module init — skip SSR entirely
const BusGuardHero = dynamic(() => import("@/components/BusGuardHero"), { ssr: false });

export default function Home() {
  return (
    <>
      <BusGuardHero />
      <BusGuardExplainer />
      <SocialProof />
      <Pricing />
    </>
  );
}
