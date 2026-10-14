import type { CSSProperties } from "react";
import CountUp from "@/components/system/CountUp";
import Words from "@/components/system/Words";
import { proof } from "@/lib/content";

const COLS = 24;

/** 211 trials drawn as 211 cells, then the true positive rate as a bar, then the testimonial. */
export default function Proof({ quoteOnly = false }: { quoteOnly?: boolean }) {
  return (
    <section aria-labelledby="proof-title" className="section relative overflow-hidden">
      <div className="frame">
        {!quoteOnly && (
          <>
            <div className="grid-12 gap-y-6">
              <div className="col-span-4 md:col-span-8 lg:col-span-8">
                <p className="eyebrow signal" data-reveal>
                  Proof
                </p>
                <Words as="h2" id="proof-title" text="Measured, not promised." className="t-l mt-6 text-fg" />
              </div>
            </div>

            <div className="grid-12 mt-16 gap-y-16 md:mt-24">
              {/* 211 */}
              <div className="col-span-4 md:col-span-8 lg:col-span-6">
                <p className="t-stat-l text-fg" style={{ fontSize: "clamp(4.5rem, 2rem + 8vw, 10rem)" }}>
                  <CountUp value={proof.trials} />
                </p>
                <p className="t-title mt-4 text-fg">Trials</p>
                <div
                  data-reveal="fade"
                  aria-hidden="true"
                  className="cells mt-8 grid max-w-[560px] gap-[5px]"
                  style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: proof.trials }).map((_, i) => {
                    const r = Math.floor(i / COLS);
                    const c = i % COLS;
                    return <span key={i} className="cell aspect-square rounded-[2px] bg-fg" style={{ "--cd": `${(r + c) * 22}ms` } as CSSProperties} />;
                  })}
                </div>
              </div>

              {/* 95.3% */}
              <div className="col-span-4 md:col-span-8 lg:col-span-6">
                <p className="t-stat-l text-accent" style={{ fontSize: "clamp(4.5rem, 2rem + 8vw, 10rem)" }}>
                  <CountUp value={proof.tpr} decimals={1} suffix="%" duration={1800} />
                </p>
                <p className="t-title mt-4 text-fg">True positive rate</p>
                <div data-reveal="fade" aria-hidden="true" className="bar mt-8 max-w-[560px]">
                  <div className="relative h-3 overflow-hidden rounded-full bg-[rgba(var(--fg-rgb),0.08)]">
                    <div className="bar-fill absolute inset-y-0 left-0 w-full origin-left rounded-full bg-accent" style={{ "--to": proof.tpr / 100 } as CSSProperties} />
                  </div>
                  <div className="mono mt-3 flex justify-between text-[10.5px] uppercase tracking-[0.14em] text-fg-3">
                    <span>0</span>
                    <span>100%</span>
                  </div>
                </div>
                <p data-reveal className="mt-10 max-w-[30rem] text-fg-2 text-pretty" style={{ "--d": "300ms" } as CSSProperties}>
                  A custom-trained computer vision model watches the stop arm and surrounding traffic on every trip, day, night, rain, or shine.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Testimonial */}
        <figure className={`relative ${quoteOnly ? "" : "mt-28 md:mt-40"}`}>
          {quoteOnly && <h2 id="proof-title" className="sr-only">What districts say</h2>}
          <span aria-hidden="true" className="t-quote pointer-events-none absolute -left-2 -top-[0.45em] select-none text-[12rem] leading-none text-accent opacity-25 md:-left-6 md:text-[18rem]">
            &ldquo;
          </span>
          <blockquote className="relative">
            <Words as="p" text={proof.quote} step={14} className="t-quote max-w-[24ch] text-fg md:max-w-[30ch] lg:max-w-[34ch]" />
          </blockquote>
          <figcaption data-reveal className="mt-10 flex items-center gap-4" style={{ "--d": "400ms" } as CSSProperties}>
            <span className="h-px w-10 bg-accent" aria-hidden="true" />
            <span>
              <span className="block font-medium text-fg">{proof.name}</span>
              <span className="mono mt-1 block text-[11px] uppercase tracking-[0.12em] text-fg-2">
                {proof.role}, {proof.org}
              </span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
