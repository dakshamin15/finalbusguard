import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageHero from "@/components/sections/PageHero";
import ViolationScene from "@/components/scenes/ViolationScene";
import ClosingCta from "@/components/sections/ClosingCta";
import Words from "@/components/system/Words";
import Brackets from "@/components/system/Brackets";
import { specs, techSteps, technology } from "@/lib/content";

export const metadata: Metadata = {
  title: "Technology",
  description: "On-device computer vision, a 100 dB onboard alert, and automatic incident logging. Violation to alert in under 200 ms.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyPage() {
  return (
    <>
      <PageHero eyebrow={technology.eyebrow} title={technology.title} sub={technology.sub} accent={["safety"]}>
        <dl className="col-span-4 mt-10 grid grid-cols-2 border-t border-line md:col-span-8 md:grid-cols-4 lg:col-span-12">
          {technology.quick.map((q, i) => (
            <div key={q.label} className="fade-load border-b border-line py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0" style={{ "--d": `${700 + i * 80}ms` } as CSSProperties}>
              <dt className="mono text-[11px] uppercase tracking-[0.14em] text-fg-3">{q.label}</dt>
              <dd className="font-display mt-2 text-[clamp(2rem,1.4rem+2vw,3.25rem)] font-bold tracking-[-0.04em] text-fg" style={{ fontStretch: "85%" }}>
                {q.value}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <ViolationScene steps={techSteps} activeAt={[0.2, 0.4, 0.52]} eyebrow="Violation → alert" title="No human intervention. Under 200 ms." id="sequence" />

      {/* Feature blocks */}
      <section aria-label="Core systems" className="section relative">
        <div className="frame flex flex-col gap-28 md:gap-40">
          {technology.features.map((f, i) => (
            <article key={f.title} className="grid-12 items-center gap-y-10">
              <div className={`col-span-4 md:col-span-8 lg:col-span-5 ${i % 2 ? "lg:order-2 lg:col-start-8" : ""}`}>
                <p className="eyebrow signal" data-reveal>
                  {f.eyebrow}
                </p>
                <Words as="h2" text={f.title} className="t-l mt-6 text-fg" />
                <p data-reveal className="t-body-l mt-8 text-fg-2 text-pretty" style={{ "--d": "150ms" } as CSSProperties}>
                  {f.body}
                </p>
                <ul data-reveal="stagger" className="mt-8 flex flex-wrap gap-2">
                  {f.tags.map((t, k) => (
                    <li key={t} className="chip" style={{ "--i": k } as CSSProperties}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`col-span-4 md:col-span-8 lg:col-span-6 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                <div data-reveal className="lock card relative overflow-hidden p-0" style={{ background: "var(--surface-2)" }}>
                  <Brackets inset={12} />
                  <div className="flex items-center justify-between border-b border-line px-6 py-4">
                    <p className="mono flex items-center gap-2.5 text-[11px] uppercase tracking-[0.14em] text-fg-2">
                      <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                      {f.terminal.label}
                    </p>
                    <span className="mono rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-fg-3 shadow-[inset_0_0_0_1px_var(--line-2)]">Illustrative</span>
                  </div>
                  <dl data-reveal="stagger" className="px-6 py-3">
                    {f.terminal.rows.map((r, k) => (
                      <div key={r.k} className="flex items-center justify-between border-b border-line py-4 last:border-b-0" style={{ "--i": k, "--d": "300ms" } as CSSProperties}>
                        <dt className="mono text-[12.5px] text-fg-3">{r.k}</dt>
                        <dd
                          className={`mono text-[12.5px] font-medium ${"hot" in r && r.hot ? "text-accent-ink" : "ok" in r && r.ok ? "text-[#1f7a46]" : "text-fg-2"} ${k === f.terminal.rows.length - 1 ? "caret" : ""}`}
                        >
                          {r.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>


      {/* Spec table */}
      <section aria-labelledby="table-title" className="section relative">
        <div className="frame grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <p className="eyebrow signal" data-reveal>
              Specifications
            </p>
            <Words as="h2" id="table-title" text="Under the hood." className="t-l mt-6 text-fg" />
          </div>
          <dl data-reveal="stagger" className="col-span-4 border-t border-line md:col-span-8 lg:col-span-8">
            {specs.table.map((row, i) => (
              <div
                key={row.spec}
                className="group flex flex-col justify-between gap-1 border-b border-line py-5 transition-colors duration-300 hover:bg-[rgba(var(--fg-rgb),0.025)] sm:flex-row sm:items-center sm:px-3"
                style={{ "--i": i } as CSSProperties}
              >
                <dt className="text-[15px] text-fg-2">{row.spec}</dt>
                <dd className={`mono text-[14px] ${row.hi ? "text-accent-ink" : "text-fg"}`}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
