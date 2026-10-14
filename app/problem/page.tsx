import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageHero from "@/components/sections/PageHero";
import ScaleField from "@/components/scenes/ScaleField";
import InterventionGap from "@/components/scenes/InterventionGap";
import Words from "@/components/system/Words";
import Brackets from "@/components/system/Brackets";
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
      <PageHero eyebrow={problem.eyebrow} title={problem.title} sub={problem.intro} accent={["watches"]} />
      <ScaleField />
      <InterventionGap />

      {/* Why it matters */}
      <section aria-label="Why the gap matters" className="section relative pt-8 md:pt-16">
        <ul data-reveal="stagger" className="frame grid gap-3 md:grid-cols-3 md:gap-4">
          {problem.cards.map((c, i) => (
            <li key={c.title} style={{ "--i": i } as CSSProperties}>
              <article className="lock card relative h-full p-7 md:p-8">
                <Brackets inset={10} />
                <p className="mono text-[11px] tracking-[0.14em] text-accent-ink">0{i + 1}</p>
                <h3 className="t-title mt-10 text-fg">{c.title}</h3>
                <p className="mt-3 text-fg-2 text-pretty">{c.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

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
