import Words from "@/components/system/Words";
import { problem } from "@/lib/content";

export function ProblemIntro({ as = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section aria-labelledby="problem-title" className="section relative pb-10 md:pb-16">
      <div className="frame grid-12 gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <p className="eyebrow signal" data-reveal>
            {problem.eyebrow}
          </p>
          <Words as={as} id="problem-title" text={problem.title} className="t-l mt-6 text-fg" accent={["watches"]} tabIndex={as === "h1" ? -1 : undefined} />
        </div>
        <div className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="t-body-l text-fg-2 text-pretty" data-reveal style={{ "--d": "200ms" } as React.CSSProperties}>
            {problem.intro}
          </p>
        </div>
      </div>
    </section>
  );
}

export function StatusQuo() {
  return (
    <section aria-label="Prevention first" className="section relative overflow-hidden">
      <div aria-hidden="true" className="glow left-1/2 top-1/2 h-[60vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-40" />
      <div className="frame relative text-center">
        <Words as="p" text={problem.closeTitle} className="t-l mx-auto max-w-[14ch] text-fg" accent={["violation"]} />
        <p data-reveal className="t-body-l mx-auto mt-8 max-w-[38rem] text-fg-2 text-pretty" style={{ "--d": "300ms" } as React.CSSProperties}>
          {problem.closeBody}
        </p>
      </div>
    </section>
  );
}
