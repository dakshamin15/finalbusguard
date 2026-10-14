import type { CSSProperties } from "react";
import Words from "@/components/system/Words";
import GridLines from "@/components/system/GridLines";
import WatchingLens from "@/components/scenes/WatchingLens";
import { problem } from "@/lib/content";

/** Problem page opener: the headline beside a surveillance lens that watches you back. */
export default function ProblemHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+clamp(56px,9vw,120px))] md:pb-24">
      <GridLines />
      <div aria-hidden="true" className="glow -right-[10%] top-[10%] h-[70vmin] w-[70vmin] opacity-40" />
      <div className="frame relative grid-12 items-center gap-y-14">
        <div className="col-span-4 md:col-span-8 lg:col-span-6">
          <p className="eyebrow signal fade-load" style={{ "--d": "0ms" } as CSSProperties}>
            {problem.eyebrow}
          </p>
          <Words as="h1" text={problem.title} mode="load" delay={100} tabIndex={-1} className="t-xl mt-7 text-fg outline-none" accent={["watches"]} />
          <p className="t-body-l fade-load mt-8 max-w-[34rem] text-fg-2 text-pretty" style={{ "--d": "600ms" } as CSSProperties}>
            {problem.intro}
          </p>
        </div>
        <div className="fade-load col-span-4 md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-8" style={{ "--d": "300ms" } as CSSProperties}>
          <WatchingLens />
        </div>
      </div>
    </section>
  );
}
