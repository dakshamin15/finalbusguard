import type { CSSProperties } from "react";
import Words from "@/components/system/Words";
import Magnetic from "@/components/system/Magnetic";
import GridLines from "@/components/system/GridLines";
import { TransitionLink } from "@/components/system/Transition";
import { Arrow } from "@/components/system/Icons";
import { site } from "@/lib/content";

export default function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-accent py-[clamp(120px,16vw,240px)] text-ink">
      <GridLines className="opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 80% at 85% 110%, rgba(255,214,170,0.45), transparent 60%)" }} />
      <div className="frame relative">
        <p className="eyebrow !text-ink" data-reveal>
          T+200 ms &middot; Alert fired
        </p>
        <h2 id="cta-title" className="sr-only">
          {site.tagline.join(" ")}
        </h2>
        <div aria-hidden="true">
          <Words as="p" text={site.tagline[0]} className="t-xl mt-8 text-ink" />
          <Words as="p" text={site.tagline[1]} className="t-xl text-[#fff7ee]" delay={180} />
        </div>
        <div data-reveal className="mt-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between" style={{ "--d": "300ms" } as CSSProperties}>
          <div className="flex flex-wrap items-center gap-6">
            <Magnetic>
              <TransitionLink href="/contact" className="btn btn-dark">
                Contact Sales
                <span className="btn-arrow">
                  <Arrow />
                </span>
              </TransitionLink>
            </Magnetic>
            <p className="max-w-[22rem] text-ink opacity-80">Contact sales, ask about pricing, or discuss a district deployment. We respond within one business day.</p>
          </div>
          <a href={`mailto:${site.email}`} className="link-u always font-display text-[clamp(1.5rem,1rem+2.2vw,3rem)] font-semibold tracking-[-0.03em] text-ink">
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
