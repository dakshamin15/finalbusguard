import type { CSSProperties } from "react";
import Words from "@/components/system/Words";
import { proof } from "@/lib/content";

/** The Jim Ellis testimonial, set large in editorial type. Appears only on the home page. */
export default function Testimonial() {
  return (
    <section aria-labelledby="quote-title" className="section relative overflow-hidden">
      <div className="frame">
        <h2 id="quote-title" className="sr-only">
          What districts say
        </h2>
        <figure className="relative">
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
