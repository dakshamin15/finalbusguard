import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageHero from "@/components/sections/PageHero";
import ProblemStats from "@/components/scenes/ProblemStats";
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
      <ProblemStats />

      {/* Documentation-only failure */}
      <section aria-labelledby="failure-title" className="section relative">
        <div className="frame grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <p className="eyebrow signal" data-reveal>
              Why current systems fall short
            </p>
            <Words as="h2" id="failure-title" text={problem.failureTitle} className="t-l mt-6 text-fg" />
            <p data-reveal className="t-body-l mt-8 max-w-[34rem] text-fg-2 text-pretty" style={{ "--d": "150ms" } as CSSProperties}>
              {problem.failureBody}
            </p>
          </div>
          <blockquote className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8 lg:self-end">
            <Words as="p" text={problem.failureCallout} step={30} className="t-quote text-fg" />
          </blockquote>
        </div>

        <ul data-reveal="stagger" className="frame mt-20 grid gap-3 md:grid-cols-3 md:gap-4">
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
