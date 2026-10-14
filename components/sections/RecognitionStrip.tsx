"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import Words from "@/components/system/Words";
import Brackets from "@/components/system/Brackets";
import { TransitionLink } from "@/components/system/Transition";
import { Arrow } from "@/components/system/Icons";
import { awards, expo, recognition } from "@/lib/content";

const items = [
  ...awards.map((a) => ({ id: a.id, date: a.date, name: a.name, badge: a.badge, logo: a.logo })),
  { id: "expo", date: "September 2026", name: expo.shortName, badge: "Presented", logo: undefined },
];

export default function RecognitionStrip() {
  const [paused, setPaused] = useState(false);
  const ticker = items.map((i) => `${i.badge} · ${i.name}`);

  return (
    <section aria-labelledby="recog-title" className="section relative overflow-hidden">
      <div className="frame grid-12 gap-y-6">
        <div className="col-span-4 md:col-span-6 lg:col-span-7">
          <p className="eyebrow signal" data-reveal>
            Recognition
          </p>
          <Words as="h2" id="recog-title" text={recognition.title} className="t-l mt-6 text-fg" />
        </div>
        <div className="col-span-4 flex flex-col items-start gap-6 md:col-span-2 md:self-end lg:col-span-4 lg:col-start-9">
          <p data-reveal className="text-fg-2 text-pretty" style={{ "--d": "150ms" } as CSSProperties}>
            {recognition.sub}
          </p>
          <TransitionLink href="/recognition" className="btn btn-ghost btn-sm" data-reveal style={{ "--d": "250ms" } as CSSProperties}>
            See the full journey
            <Arrow />
          </TransitionLink>
        </div>
      </div>

      {/* Decorative ticker. Hidden from assistive tech: the same content is in the list below. */}
      <div className="marquee-wrap relative mt-16 border-y border-line py-5 md:mt-20">
        <div aria-hidden="true" className="overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)" }}>
          <div className="marquee" data-paused={paused}>
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {ticker.map((t) => (
                  <span key={t + k} className="font-display flex items-center whitespace-nowrap px-8 text-[clamp(1.25rem,1rem+1vw,2rem)] font-semibold tracking-[-0.02em] text-fg-2">
                    {t}
                    <span className="ml-16 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="mono absolute -bottom-px right-[var(--gutter)] translate-y-full rounded-b-lg bg-bg px-3 py-1.5 text-[10.5px] uppercase tracking-[0.14em] text-fg-3 shadow-[inset_0_-1px_0_0_var(--line),inset_1px_0_0_0_var(--line),inset_-1px_0_0_0_var(--line)] transition-colors hover:text-fg"
        >
          {paused ? "Play ticker" : "Pause ticker"}
        </button>
      </div>

      <ul data-reveal="stagger" className="frame mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-4">
        {items.map((a, i) => (
          <li key={a.id} style={{ "--i": i } as CSSProperties}>
            <article className="lock card group relative flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[rgba(var(--fg-rgb),0.04)] md:p-7">
              <Brackets inset={10} />
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-14 w-28 place-items-center rounded-xl bg-white shadow-[inset_0_0_0_1px_var(--line)] px-3">
                  {a.logo ? (
                    <Image src={a.logo.src} alt={`${a.name} logo`} width={a.logo.w} height={a.logo.h} sizes="112px" className="max-h-10 w-auto object-contain" />
                  ) : (
                    <span className="mono text-center text-[9px] font-medium uppercase leading-tight tracking-[0.08em] text-ink">Road Safety Innovation Expo</span>
                  )}
                </div>
                <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-fg-3">{a.date}</p>
              </div>
              <p className="font-display mt-10 text-[clamp(1.6rem,1.2rem+1.2vw,2.25rem)] font-bold leading-none tracking-[-0.035em] text-accent">{a.badge}</p>
              <h3 className="mt-3 text-[15px] text-fg">{a.name}</h3>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
