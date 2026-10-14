"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Words from "@/components/system/Words";
import GridLines from "@/components/system/GridLines";
import { problem } from "@/lib/content";
import { getGsap } from "@/lib/gsap";
import { DESKTOP_QUERY, pinMode } from "@/lib/motion";

/*
 * When intervention happens, on a log-time axis from 100 ms to 4 weeks.
 * Documentation-only systems act weeks later; BusGuard alerts in under 200 ms,
 * before the 2-4 second window in which a child decides to cross.
 */
const MIN = Math.log10(100); // 100 ms
const MAX = Math.log10(28 * 24 * 3600 * 1000); // 4 weeks
const at = (ms: number) => `${(((Math.log10(ms) - MIN) / (MAX - MIN)) * 100).toFixed(3)}%`;

const TICKS = [
  { ms: 100, long: "100 ms", short: "0.1s" },
  { ms: 1000, long: "1 second", short: "1s" },
  { ms: 10_000, long: "10 seconds", short: "10s" },
  { ms: 60_000, long: "1 minute", short: "1m" },
  { ms: 3_600_000, long: "1 hour", short: "1h" },
  { ms: 86_400_000, long: "1 day", short: "1d" },
  { ms: 604_800_000, long: "1 week", short: "1w" },
  { ms: 2_419_200_000, long: "4 weeks", short: "4w" },
];
const ALERT = 200;
const WIN = [2000, 4000];
const MAIL = [604_800_000, 2_419_200_000];

export default function InterventionGap() {
  const root = useRef<HTMLElement>(null);
  const q = (k: string) => root.current?.querySelector<HTMLElement>(`[data-g="${k}"]`) ?? null;
  const qa = (k: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(`[data-g="${k}"]`) ?? []);

  useEffect(() => {
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_QUERY, () => {
      if (!pinMode()) return;
      gsap.set(q("axis"), { scaleX: 0 });
      gsap.set(qa("tick"), { autoAlpha: 0, y: 8 });
      gsap.set(q("window"), { autoAlpha: 0, scaleY: 0.4 });
      gsap.set(q("winlabel"), { autoAlpha: 0, y: 10 });
      gsap.set(q("doc"), { scaleX: 0 });
      gsap.set(q("doclabel"), { autoAlpha: 0, x: -16 });
      gsap.set(q("mail"), { autoAlpha: 0, scale: 0.6 });
      gsap.set(q("bg"), { scaleX: 0 });
      gsap.set(q("bglabel"), { autoAlpha: 0, y: -10 });
      gsap.set(q("ping"), { autoAlpha: 0, scale: 0.4 });
      gsap.set(q("callout"), { autoAlpha: 0, y: 24 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.5 },
        })
        .to(q("axis"), { scaleX: 1, duration: 0.2, ease: "bg.inOut" }, 0.02)
        .to(qa("tick"), { autoAlpha: 1, y: 0, stagger: 0.015, duration: 0.06 }, 0.08)
        .to(q("window"), { autoAlpha: 1, scaleY: 1, duration: 0.08, ease: "bg.snap" }, 0.26)
        .to(q("winlabel"), { autoAlpha: 1, y: 0, duration: 0.06 }, 0.3)
        .to(q("doc"), { scaleX: 1, duration: 0.24, ease: "power1.inOut" }, 0.4)
        .to(q("doclabel"), { autoAlpha: 1, x: 0, duration: 0.06 }, 0.44)
        .to(q("mail"), { autoAlpha: 1, scale: 1, duration: 0.05, ease: "back.out(2)" }, 0.62)
        .to(q("bg"), { scaleX: 1, duration: 0.08, ease: "bg.snap" }, 0.7)
        .to(q("bglabel"), { autoAlpha: 1, y: 0, duration: 0.06 }, 0.74)
        .to(q("ping"), { autoAlpha: 1, scale: 1, duration: 0.05, ease: "back.out(2.5)" }, 0.76)
        .to(q("callout"), { autoAlpha: 1, y: 0, duration: 0.08 }, 0.84)
        .to({}, { duration: 0.06 }, 0.94);
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={root} aria-labelledby="gap-title" className="track relative" style={{ "--track": "380svh" } as CSSProperties}>
      <div className="stick relative">
        <GridLines className="opacity-60" />
        <div className="frame relative flex min-h-full flex-col py-20 md:h-full md:pb-12 md:pt-[calc(var(--nav-h)+36px)]">
          <div className="grid-12 gap-y-6">
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <p className="eyebrow signal">When intervention happens</p>
              <Words as="h2" id="gap-title" text={problem.failureTitle} className="t-m mt-5 text-fg" />
            </div>
            <div className="relative col-span-4 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:self-end">
              <p className="text-fg-2 text-pretty">{problem.failureBody}</p>
              <blockquote data-g="callout" className="mt-6 border-l-2 border-accent pl-5">
                <p className="t-quote text-fg" style={{ fontSize: "clamp(1.35rem, 1rem + 1vw, 2rem)" }}>
                  {problem.failureCallout}
                </p>
              </blockquote>
            </div>
          </div>

          {/* Chart */}
          <div className="relative mt-14 flex-1 md:mt-8" role="img" aria-label="Timeline on a logarithmic scale from 100 milliseconds to 4 weeks. BusGuard alerts in under 200 milliseconds. A child decides to cross in a critical 2 to 4 second window. Documentation-only systems mail a citation weeks later.">
            <div className="relative mx-auto h-[320px] md:h-full md:max-h-[460px] md:min-h-[300px]" aria-hidden="true">
              <span className="mono absolute right-0 top-0 hidden text-[10px] uppercase tracking-[0.12em] text-fg-3 md:block">Time after a violation begins · log scale</span>
              {/* Critical window band */}
              <div data-g="window" className="absolute bottom-[56px] top-0 origin-bottom rounded-md" style={{ left: at(WIN[0]), width: `calc(${at(WIN[1])} - ${at(WIN[0])})`, background: "linear-gradient(to top, rgba(220,100,32,0.22), rgba(220,100,32,0.04))", boxShadow: "inset 0 0 0 1px rgba(220,100,32,0.35)" }} />
              <div data-g="winlabel" className="absolute top-0 whitespace-nowrap" style={{ left: at(WIN[0]) }}>
                <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-accent-ink">Critical window · 2–4 s</p>
                <p className="mt-1 hidden text-[13px] text-fg-2 md:block">A child decides to cross</p>
              </div>

              {/* Lanes */}
              <div className="absolute inset-x-0 bottom-[56px] top-[64px]">
                {/* Documentation-only */}
                <div className="absolute inset-x-0 top-[22%]">
                  <div data-g="doc" className="absolute left-0 top-0 h-[3px] origin-left rounded-full bg-[rgba(var(--fg-rgb),0.28)]" style={{ width: `calc(${at((MAIL[0] + MAIL[1]) / 2.4)})` }} />
                  <div data-g="doclabel" className="absolute left-0 top-3">
                    <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-fg-3">Documentation-only systems</p>
                  </div>
                  <div data-g="mail" className="absolute -top-[13px] -translate-x-1/2" style={{ left: at((MAIL[0] + MAIL[1]) / 2.4) }}>
                    <div className="grid h-[28px] w-[28px] place-items-center rounded-full bg-fg text-bg">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="3" width="11" height="8" rx="1.5" /><path d="M2 3.5l5 4 5-4" /></svg>
                    </div>
                    <div className="absolute right-0 top-9 w-[180px] text-right md:w-[220px]">
                      <p className="font-display text-[15px] font-semibold text-fg md:text-[17px]">Citation mailed</p>
                      <p className="text-[12.5px] text-fg-2 md:text-[13px]">Weeks after the child was already in danger</p>
                    </div>
                  </div>
                </div>

                {/* BusGuard */}
                <div className="absolute inset-x-0 top-[64%]">
                  <div data-g="bg" className="absolute left-0 top-0 h-[4px] origin-left rounded-full bg-accent" style={{ width: at(ALERT), boxShadow: "0 0 18px var(--accent-glow)" }} />
                  <div data-g="ping" className="absolute -top-[12px] -translate-x-1/2" style={{ left: at(ALERT) }}>
                    <span className="pulse-dot block h-[28px] w-[28px] rounded-full bg-accent" />
                  </div>
                  <div data-g="bglabel" className="absolute left-0 top-6 md:top-7">
                    <p className="font-display text-[15px] font-semibold text-fg md:text-[17px]">BusGuard alert · &lt;200 ms</p>
                    <p className="text-[12.5px] text-fg-2 md:text-[13px]">Fires before the child steps out</p>
                  </div>
                </div>
              </div>

              {/* Axis */}
              <div className="absolute inset-x-0 bottom-[40px]">
                <div data-g="axis" className="h-px origin-left bg-[rgba(var(--fg-rgb),0.35)]" />
                {TICKS.map((t, i) => (
                  <div key={t.ms} data-g="tick" className={`absolute top-0 ${i === 0 ? "" : i === TICKS.length - 1 ? "-translate-x-full text-right" : "-translate-x-1/2 text-center"}`} style={{ left: at(t.ms) }}>
                    <span className={`block h-2 w-px bg-[rgba(var(--fg-rgb),0.35)] ${i === 0 ? "" : i === TICKS.length - 1 ? "ml-auto" : "mx-auto"}`} />
                    <span className="mono mt-2 block whitespace-nowrap text-[10px] uppercase tracking-[0.1em] text-fg-3">
                      <span className="md:hidden">{t.short}</span>
                      <span className="hidden md:inline">{t.long}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
