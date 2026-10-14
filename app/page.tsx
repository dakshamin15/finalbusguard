import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import ProblemTeaser from "@/components/sections/ProblemTeaser";
import ViolationScene from "@/components/scenes/ViolationScene";
import Proof from "@/components/sections/Proof";
import ExpoFeature from "@/components/sections/ExpoFeature";
import RecognitionStrip from "@/components/sections/RecognitionStrip";
import ClosingCta from "@/components/sections/ClosingCta";
import { homeSteps } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The landing page tells the story once; depth lives on /problem, /technology, and /recognition.
export default function Home() {
  return (
    <>
      <Hero />
      <ProblemTeaser />
      <ViolationScene steps={homeSteps} />
      <Proof />
      <ExpoFeature />
      <RecognitionStrip compact />
      <ClosingCta />
    </>
  );
}
