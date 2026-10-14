"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import CountUp from "@/components/system/CountUp";
import GridLines from "@/components/system/GridLines";
import { ArrowUpRight } from "@/components/system/Icons";
import { problem } from "@/lib/content";
import { getGsap } from "@/lib/gsap";
import { DESKTOP_QUERY, pinMode } from "@/lib/motion";

/**
 * Three full-viewport statistics. Desktop with motion: one sticky frame, panels hand off
 * through masks as you scroll and each counts up once when it becomes active.
 * Mobile / reduced motion: the same panels stacked, counting on entry.
 */
export default function ProblemStats() {
  const track = useRef<HTMLElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_QUERY, () => {
      if (!pinMode()) return;
      const ps = panels.current.filter(Boolean) as HTMLDivElement[];
      const parts = (p: HTMLElement) => ({
        num: p.querySelector("[data-num]"),
        meta: p.querySelectorAll("[data-meta]"),
        idx: p.querySelector("[data-idx]"),
      });
      ps.forEach((p, i) => {
        if (i === 0) return;
        const q = parts(p);
        gsap.set(p, { autoAlpha: 1 });
        gsap.set(q.num, { yPercent: 105 });
        gsap.set(q.meta, { y: 40, autoAlpha: 0 });
        gsap.set(q.idx, { autoAlpha: 0 });
      });

      const tl = gsap.timeline({
        defaults: { ease: "bg.inOut" },
        scrollTrigger: { trigger: track.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      for (let i = 1; i < ps.length; i++) {
        const a = parts(ps[i - 1]);
        const b = parts(ps[i]);
        const at = i - 0.5;
        tl.to(a.num, { yPercent: -105, duration: 0.5 }, at)
          .to(a.meta, { y: -30, autoAlpha: 0, duration: 0.35, stagger: 0.04 }, at)
          .to(a.idx, { autoAlpha: 0, duration: 0.3 }, at)
          .to(b.num, { yPercent: 0, duration: 0.5 }, at + 0.12)
          .to(b.meta, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.05 }, at + 0.22)
          .to(b.idx, { autoAlpha: 1, duration: 0.3 }, at + 0.2);
      }
      tl.to({}, { duration: 0.5 }, ps.length - 0.5);

      // Count each panel once when it becomes the active one; update counter + bars.
      const fired = new Set<number>();
      const fire = (i: number) => {
        if (fired.has(i)) return;
        fired.add(i);
        ps[i].querySelector("[data-count]")?.dispatchEvent(new Event("bg:count"));
      };
      ScrollTrigger.create({ trigger: track.current, start: "top 65%", onEnter: () => fire(0) });
      ScrollTrigger.create({
        trigger: track.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => {
          const raw = s.progress;
          const active = Math.min(ps.length - 1, Math.floor(raw * ps.length + 0.15));
          if (counter.current) counter.current.textContent = `0${active + 1}`;
          bars.current.forEach((b, i) => {
            if (b) b.style.transform = `scaleX(${Math.max(0, Math.min(1, raw * ps.length - i))})`;
          });
          fire(active);
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={track} aria-label="The scale of the problem" className="track relative" style={{ "--track": "340svh" } as CSSProperties}>
      <div className="stick relative">
        <GridLines className="opacity-60" />
        <div aria-hidden="true" className="pin-only pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+20px)] z-10">
          <div className="frame flex items-center justify-between">
            <p className="eyebrow signal">The scale of the problem</p>
            <p className="mono text-[12px] tracking-[0.12em] text-fg-3">
              <span ref={counter} className="text-fg">01</span> / 03
            </p>
          </div>
          <div className="frame mt-4 grid grid-cols-3 gap-2">
            {problem.stats.map((_, i) => (
              <span key={i} className="relative block h-px overflow-hidden bg-line-2">
                <span
                  ref={(el) => {
                    bars.current[i] = el;
                  }}
                  className="absolute inset-0 origin-left scale-x-0 bg-accent"
                />
              </span>
            ))}
          </div>
        </div>

        <div className="relative md:h-full">
          {problem.stats.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => {
                panels.current[i] = el;
              }}
              className={`relative flex min-h-[78svh] flex-col justify-center border-t border-line py-16 first:border-t-0 md:min-h-[100svh] [.motion-ok_&]:md:absolute [.motion-ok_&]:md:inset-0 [.motion-ok_&]:md:border-t-0 ${i > 0 ? "[.motion-ok_&]:md:invisible" : ""}`}
            >
              <div className="frame relative w-full">
                <span data-idx aria-hidden="true" className="mono absolute right-[var(--gutter)] top-0 text-[11px] tracking-[0.14em] text-fg-3 md:hidden">
                  0{i + 1} / 03
                </span>
                <div className="overflow-hidden pb-[0.04em]">
                  <p data-num className="t-stat text-fg will-change-transform">
                    <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} manual duration={1600} />
                  </p>
                </div>
                <div className="grid-12 mt-8 items-end gap-y-6 md:mt-10">
                  <p data-meta className="eyebrow col-span-4 !text-accent-ink md:col-span-3">
                    {s.label}
                  </p>
                  <p data-meta className="t-title col-span-4 text-fg text-pretty md:col-span-5 lg:col-span-6">
                    {s.body}
                  </p>
                  <p data-meta className="col-span-4 text-[13px] leading-snug text-fg-3 md:col-span-8 lg:col-span-3 lg:text-right">
                    <span className="mono mb-1.5 block text-[10.5px] uppercase tracking-[0.14em]">Source</span>
                    {s.sourceUrl ? (
                      <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-fg-2 underline decoration-[var(--line-2)] underline-offset-4 transition-colors hover:text-fg hover:decoration-current">
                        {s.source}
                        <ArrowUpRight className="ml-1 inline-block align-[-1px]" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="text-fg-2">{s.source}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
