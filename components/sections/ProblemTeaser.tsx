import type { CSSProperties } from "react";
import CountUp from "@/components/system/CountUp";
import Words from "@/components/system/Words";
import { TransitionLink } from "@/components/system/Transition";
import { Arrow } from "@/components/system/Icons";
import { problem } from "@/lib/content";

/** One-screen summary of the problem for the home page. The full story lives on /problem. */
export default function ProblemTeaser() {
  return (
    <section aria-labelledby="problem-title" className="section relative">
      <div className="frame">
        <div className="grid-12 gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <p className="eyebrow signal" data-reveal>
              {problem.eyebrow}
            </p>
            <Words as="h2" id="problem-title" text={problem.title} className="t-l mt-6 text-fg" accent={["watches"]} />
          </div>
          <div className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p data-reveal className="t-body-l text-fg-2 text-pretty" style={{ "--d": "150ms" } as CSSProperties}>
              {problem.failureCallout}
            </p>
            <TransitionLink href="/problem" data-reveal className="btn btn-ghost btn-sm mt-6" style={{ "--d": "250ms" } as CSSProperties}>
              Read about the problem
              <Arrow />
            </TransitionLink>
          </div>
        </div>

        <dl data-reveal="stagger" className="mt-16 grid border-t border-line md:mt-24 md:grid-cols-3">
          {problem.stats.map((s, i) => (
            <div key={s.label} className="border-b border-line py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0" style={{ "--i": i } as CSSProperties}>
              <dt className="eyebrow !text-accent-ink">{s.label}</dt>
              <dd className="mt-4">
                <span className="t-stat-l block text-fg">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} duration={1600} />
                </span>
                <span className="mt-4 block text-fg-2 text-pretty">{s.body}</span>
                <span className="mono mt-4 block text-[10.5px] uppercase tracking-[0.12em] text-fg-3">Source: {s.source}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
