import type { Metadata } from "next";
import DepthPortrait from "@/components/system/DepthPortrait";
import type { CSSProperties } from "react";
import PageHero from "@/components/sections/PageHero";
import ClosingCta from "@/components/sections/ClosingCta";
import Words from "@/components/system/Words";
import Brackets from "@/components/system/Brackets";
import { about, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "BusGuard is a student-founded company from Henrico County, Virginia, building real-time stop-arm violation detection for school buses.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={about.eyebrow} title={about.title} sub={about.sub} accent={["BusGuard"]} />

      {/* Mission */}
      <section aria-label="Mission" className="section relative overflow-hidden">
        <div aria-hidden="true" className="glow left-[10%] top-1/2 h-[50vmin] w-[70vmin] -translate-y-1/2 opacity-30" />
        <figure className="frame relative grid-12">
          <blockquote className="col-span-4 md:col-span-8 lg:col-span-10">
            <Words as="p" text={about.mission} step={22} className="t-quote text-fg" />
          </blockquote>
          <figcaption data-reveal className="col-span-4 mt-10 flex items-center gap-4 md:col-span-8" style={{ "--d": "300ms" } as CSSProperties}>
            <span className="h-px w-10 bg-accent" aria-hidden="true" />
            <span className="mono text-[11px] uppercase tracking-[0.14em] text-fg-2">{about.missionBy}</span>
          </figcaption>
        </figure>
      </section>

      {/* Founders */}
      <section aria-labelledby="team-title" className="section relative">
        <div className="frame">
          <div className="grid-12 mb-14 gap-y-6 md:mb-20">
            <div className="col-span-4 md:col-span-6">
              <p className="eyebrow signal" data-reveal>
                The team
              </p>
              <Words as="h2" id="team-title" text="The founders." className="t-l mt-6 text-fg" />
            </div>
            <p data-reveal className="col-span-4 text-fg-2 text-pretty md:col-span-2 md:self-end lg:col-span-4 lg:col-start-9" style={{ "--d": "150ms" } as CSSProperties}>
              Three students from {site.location}, building the safety system they wanted to see on every bus.
            </p>
          </div>

          <ul data-reveal="stagger" className="grid gap-3 md:grid-cols-3 md:gap-4">
            {about.founders.map((f, i) => (
              <li key={f.name} style={{ "--i": i } as CSSProperties}>
                <article className="lock card group relative h-full overflow-hidden p-6 md:p-7">
                  <Brackets inset={10} />
                  <div className="relative mx-auto aspect-square w-[84%] max-w-[320px]">
                    <div aria-hidden="true" className="absolute inset-[-6%] rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100" style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent)" }} />
                    <div className="relative h-full w-full overflow-hidden rounded-full ring-1 ring-[var(--line-2)] transition-[box-shadow] duration-500 group-hover:ring-accent">
                      <DepthPortrait src={f.photo} depth={f.depth} alt={`Portrait of ${f.name}`} sizes="(min-width: 700px) 26vw, 80vw" />
                    </div>
                  </div>
                  <p className="mono mt-10 text-[11px] uppercase tracking-[0.14em] text-accent-ink">
                    {f.role} ({f.short})
                  </p>
                  <h3 className="t-title mt-3 text-fg">{f.name}</h3>
                  <p className="mt-3 text-fg-2 text-pretty">{f.bio}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
