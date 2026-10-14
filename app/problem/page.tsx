import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ProblemHero from "@/components/sections/ProblemHero";
import FailurePanels from "@/components/scenes/FailurePanels";
import ScaleField from "@/components/scenes/ScaleField";
import InterventionGap from "@/components/scenes/InterventionGap";
import Words from "@/components/system/Words";
import Magnetic from "@/components/system/Magnetic";
import { TransitionLink } from "@/components/system/Transition";
import { Arrow } from "@/components/system/Icons";
import { problem } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Problem",
  description: "Illegal school bus passings put millions of children in the danger zone every year. Existing systems only document violations after the fact.",
  alternates: { canonical: "/problem" },
};

export default function ProblemPage() {
  return (
    <>
      <ProblemHero />
      <ScaleField />
      <InterventionGap />

      <FailurePanels />

      {/* Close */}
      <section aria-labelledby="close-title" className="section relative overflow-hidden">
        <div aria-hidden="true" className="glow left-1/2 top-1/2 h-[60vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-40" />
        <div className="frame relative text-center">
          <Words as="h2" id="close-title" text={problem.closeTitle} className="t-l mx-auto max-w-[14ch] text-fg" accent={["violation"]} />
          <p data-reveal className="t-body-l mx-auto mt-8 max-w-[38rem] text-fg-2 text-pretty" style={{ "--d": "250ms" } as CSSProperties}>
            {problem.closeBody}
          </p>
          <div data-reveal className="mt-12 flex justify-center" style={{ "--d": "400ms" } as CSSProperties}>
            <Magnetic>
              <TransitionLink href="/technology" className="btn btn-primary">
                {problem.closeCta}
                <span className="btn-arrow">
                  <Arrow />
                </span>
              </TransitionLink>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}
