import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageHero from "@/components/sections/PageHero";
import ExpoFeature from "@/components/sections/ExpoFeature";
import Timeline from "@/components/sections/Timeline";
import Press from "@/components/sections/Press";
import ClosingCta from "@/components/sections/ClosingCta";
import Words from "@/components/system/Words";
import { recognition } from "@/lib/content";

export const metadata: Metadata = {
  title: "Recognition",
  description: "BusGuard presented at the U.S. DOT Road Safety Innovation Expo, was recognized in five competitions, and was featured on WRIC ABC 8News.",
  alternates: { canonical: "/recognition" },
};

export default function RecognitionPage() {
  return (
    <>
      <PageHero eyebrow={recognition.eyebrow} title={recognition.title} sub={recognition.sub} accent={["stage"]} />
      <ExpoFeature priority />

      <section aria-labelledby="journey-title" className="section relative">
        <div className="frame">
          <div className="mb-16 md:mb-24">
            <p className="eyebrow signal" data-reveal>
              Our journey
            </p>
            <Words as="h2" id="journey-title" text={recognition.journey} className="t-l mt-6 max-w-[18ch] text-fg" />
            <p data-reveal className="mt-6 max-w-[30rem] text-fg-2" style={{ "--d": "150ms" } as CSSProperties}>
              Select any photo to view it full size.
            </p>
          </div>
          <Timeline />
        </div>
      </section>

      <Press />
      <ClosingCta />
    </>
  );
}
