import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import ProblemStats from "@/components/scenes/ProblemStats";
import ViolationScene from "@/components/scenes/ViolationScene";
import { ProblemIntro, StatusQuo } from "@/components/sections/ProblemIntro";
import SpecsBento from "@/components/sections/SpecsBento";
import Proof from "@/components/sections/Proof";
import ExpoFeature from "@/components/sections/ExpoFeature";
import RecognitionStrip from "@/components/sections/RecognitionStrip";
import Press from "@/components/sections/Press";
import ClosingCta from "@/components/sections/ClosingCta";
import { homeSteps } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemIntro />
      <ProblemStats />
      <StatusQuo />
      <ViolationScene steps={homeSteps} />
      <SpecsBento />
      <Proof />
      <ExpoFeature />
      <RecognitionStrip />
      <Press />
      <ClosingCta />
    </>
  );
}
