"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Words from "@/components/system/Words";
import { problem } from "@/lib/content";
import { getGsap } from "@/lib/gsap";
import { DESKTOP_QUERY, pinMode } from "@/lib/motion";

/*
 * The three reasons watching isn't enough, as a pinned horizontal gallery.
 * Each panel's illustration is driven by its own progress (--p, 0..1) so every
 * motion is a transform/opacity derived from scroll.
 */

function Ticket() {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute left-1/2 top-1/2 w-[78%]"
        style={{ transform: "translate(-50%,-50%) translateX(calc((1 - var(--p)) * 46%)) rotate(calc((1 - var(--p)) * -14deg))" }}
      >
        <svg viewBox="0 0 320 210" className="w-full drop-shadow-[0_30px_40px_rgba(24,19,15,0.18)]">
          <rect x="4" y="4" width="312" height="202" rx="10" fill="#fffdf9" stroke="rgba(24,19,15,0.18)" strokeWidth="2" />
          <path d="M6 10 L160 118 L314 10" fill="none" stroke="rgba(24,19,15,0.2)" strokeWidth="2" />
          <rect x="24" y="140" width="120" height="8" rx="4" fill="rgba(24,19,15,0.15)" />
          <rect x="24" y="158" width="86" height="8" rx="4" fill="rgba(24,19,15,0.1)" />
          <text x="24" y="122" fontSize="13" fill="rgba(24,19,15,0.55)" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
            NOTICE OF VIOLATION
          </text>
          <rect x="248" y="22" width="46" height="54" rx="4" fill="none" stroke="rgba(24,19,15,0.25)" strokeDasharray="4 3" />
        </svg>
        <div
          className="mono absolute right-[4%] top-[18%] rounded-md border-[3px] border-[#c8372d] px-3 py-1 text-[clamp(13px,1.3vw,18px)] font-medium uppercase tracking-[0.1em] text-[#c8372d]"
          style={{ opacity: "calc((var(--p) - 0.62) * 4)", transform: "rotate(-12deg) scale(calc(1.6 - min(1, max(0, (var(--p) - 0.62) * 4)) * 0.6))" }}
        >
          Weeks later
        </div>
      </div>
    </div>
  );
}

function WindowDial() {
  const R = 120;
  const C = 2 * Math.PI * R;
  // 0 to 4 seconds around the dial; 2 to 4 s is the crossing window.
  return (
    <div className="relative grid h-full w-full place-items-center">
      <svg viewBox="0 0 300 300" className="h-[86%] w-[86%] -rotate-90">
        <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(24,19,15,0.08)" strokeWidth="18" />
        <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(220,100,32,0.22)" strokeWidth="18" strokeDasharray={`${C / 2} ${C}`} strokeDashoffset={-C / 2} />
        <circle
          cx="150"
          cy="150"
          r={R}
          fill="none"
          stroke="var(--fg)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          style={{ strokeDashoffset: `calc(${C}px * (1 - var(--p)))` } as CSSProperties}
        />
        {[0, 1, 2, 3].map((s) => (
          <line key={s} x1="150" y1="18" x2="150" y2="40" stroke="rgba(24,19,15,0.35)" strokeWidth="2" transform={`rotate(${s * 90} 150 150)`} />
        ))}
      </svg>
      <div className="absolute text-center">
        <p data-dial className="font-display text-[clamp(3rem,2rem+3vw,5.5rem)] font-bold leading-none tracking-[-0.05em] text-fg tnum" style={{ fontStretch: "80%" }}>
          4.0s
        </p>
        <p className="mono mt-2 text-[10.5px] uppercase tracking-[0.14em] text-accent-ink">2–4 s · decision window</p>
      </div>
    </div>
  );
}

function Gauge() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 py-6">
      <svg viewBox="0 0 300 190" className="w-[78%]">
        <path d="M30 170 A120 120 0 0 1 270 170" fill="none" stroke="rgba(24,19,15,0.1)" strokeWidth="16" strokeLinecap="round" />
        <path d="M70 80 A120 120 0 0 1 230 80" fill="none" stroke="rgba(220,100,32,0.3)" strokeWidth="16" />
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={i} x1="150" y1="58" x2="150" y2={i % 5 === 0 ? 76 : 68} stroke="rgba(24,19,15,0.35)" strokeWidth="2" transform={`rotate(${-90 + i * 18} 150 170)`} />
        ))}
        <g className="gauge-needle" style={{ transformOrigin: "150px 170px" }}>
          <line x1="150" y1="170" x2="150" y2="66" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
        </g>
        <circle cx="150" cy="170" r="11" fill="var(--fg)" />
        <text x="150" y="128" textAnchor="middle" fontSize="15" fill="rgba(24,19,15,0.55)" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em" }}>
          SPEED: ?
        </text>
      </svg>
      <p className="font-display whitespace-nowrap text-[clamp(2.4rem,1.6rem+2.4vw,4.2rem)] font-bold leading-none tracking-[-0.05em] text-fg" style={{ fontStretch: "80%" }}>
        Ages 5–8
      </p>
    </div>
  );
}

const visuals: ReactNode[] = [<Ticket key="t" />, <WindowDial key="w" />, <Gauge key="g" />];

export default function FailurePanels() {
  const track = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_QUERY, () => {
      if (!pinMode() || !rail.current) return;
      const r = rail.current;
      const dist = () => Math.max(0, r.scrollWidth - window.innerWidth);
      panels.current.forEach((p) => p?.style.setProperty("--p", "0"));
      const tween = gsap.to(r, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: track.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            const n = panels.current.length;
            panels.current.forEach((p, i) => {
              if (!p) return;
              // Each panel animates while it travels from the right edge to its resting spot.
              const local = Math.min(1, Math.max(0, (s.progress * (n - 1) - (i - 1)) / 1));
              const v = i === 0 ? Math.min(1, 0.35 + s.progress * 3) : local;
              p.style.setProperty("--p", v.toFixed(3));
              const dial = p.querySelector<HTMLElement>("[data-dial]");
              if (dial) dial.textContent = `${(v * 4).toFixed(1)}s`;
            });
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        ScrollTrigger.refresh();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={track} aria-labelledby="fail-title" className="track relative" style={{ "--track": "320svh" } as CSSProperties}>
      <div className="stick relative flex flex-col justify-center py-16 md:py-0">
        <div className="frame">
          <p className="eyebrow signal">Why watching isn&rsquo;t enough</p>
          <Words as="h2" id="fail-title" text="Three reasons the status quo fails." className="t-m mt-5 max-w-[20ch] text-fg" />
        </div>
        <div className="mt-10 md:mt-12 md:overflow-visible">
          <div ref={rail} className="frame flex flex-col gap-4 will-change-transform md:w-max md:max-w-none md:flex-row md:gap-6 md:pr-[var(--gutter)]">
            {problem.cards.map((c, i) => (
              <article
                key={c.title}
                ref={(el) => {
                  panels.current[i] = el;
                }}
                className="card grid overflow-hidden md:h-[min(58svh,540px)] md:w-[min(76vw,980px)] md:grid-cols-2"
                style={{ "--p": 1 } as CSSProperties}
              >
                <div className="flex flex-col justify-between p-7 md:p-10">
                  <p className="mono text-[11px] tracking-[0.14em] text-accent-ink">0{i + 1} / 03</p>
                  <div className="mt-10 md:mt-0">
                    <h3 className="t-m text-fg">{c.title}</h3>
                    <p className="t-body-l mt-4 max-w-[30ch] text-fg-2 text-pretty">{c.body}</p>
                  </div>
                </div>
                <div className="relative aspect-[4/3] border-t border-line bg-[rgba(var(--fg-rgb),0.025)] md:aspect-auto md:border-l md:border-t-0" aria-hidden="true">
                  {visuals[i]}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
