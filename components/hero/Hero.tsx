"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Words from "@/components/system/Words";
import Magnetic from "@/components/system/Magnetic";
import GridLines from "@/components/system/GridLines";
import { TransitionLink } from "@/components/system/Transition";
import { Arrow } from "@/components/system/Icons";
import { callouts, hero, specLine } from "@/lib/content";
import { getGsap } from "@/lib/gsap";
import { DESKTOP_QUERY, pinMode } from "@/lib/motion";
import type { CalloutKey } from "./HeroCanvas";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

// Each callout fans out from its anchor along its own leader line (px), so labels never stack.
const ORDER: { key: CalloutKey; side: "l" | "r"; dx: number; dy: number }[] = [
  { key: "housing", side: "l", dx: -190, dy: 70 },
  { key: "pcb", side: "r", dx: 200, dy: 90 },
  { key: "edgeProc", side: "l", dx: -210, dy: -40 },
  { key: "wifi", side: "r", dx: 300, dy: -30 },
  { key: "varifocal", side: "l", dx: -260, dy: 170 },
];

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Hero() {
  const track = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const labels = useRef<Partial<Record<CalloutKey, HTMLElement | null>>>({});
  const [load3d, setLoad3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  // Decide whether to load WebGL at all: desktop/tablet, motion allowed, not on data saver.
  useEffect(() => {
        const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!pinMode() || conn?.saveData || !canUseWebGL()) return;
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => setLoad3d(true), { timeout: 1200 });
    else setTimeout(() => setLoad3d(true), 300);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_QUERY, () => {
      if (!pinMode()) return;
      ScrollTrigger.create({
        trigger: track.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => {
          progress.current = s.progress;
          if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
        },
      });
      gsap.to(copy.current, {
        opacity: 0,
        y: -90,
        ease: "none",
        scrollTrigger: { trigger: track.current, start: "top top", end: "18% top", scrub: true },
      });
      gsap.to(hint.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: track.current, start: "70% bottom", end: "85% bottom", scrub: true },
      });
      gsap.fromTo(
        outro.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: track.current, start: "78% bottom", end: "96% bottom", scrub: true } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={track} aria-labelledby="hero-title" className="track relative" style={{ "--track": "290svh" } as CSSProperties}>
      <div className="stick relative min-h-[100svh] overflow-hidden">
        {/* Atmosphere */}
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 68% 58%, rgba(236,124,52,0.10), transparent 70%), radial-gradient(40% 40% at 20% 10%, rgba(var(--fg-rgb),0.04), transparent 70%)" }} />
          <GridLines />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
        </div>

        {/* Poster first (desktop: exploded, mobile: assembled). The canvas crossfades over it. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden transition-opacity duration-700 md:block" style={{ opacity: ready ? 0 : 1 }}>
          <Image src="/hero/poster-exploded.png" alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        {load3d && (
          <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
            <HeroCanvas progress={progress} labels={labels} onReady={() => setReady(true)} active={active} />
          </div>
        )}

        {/* Callouts, positioned each frame by the canvas (transform only) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          {ORDER.map(({ key, side, dx, dy }) => (
            <div
              key={key}
              ref={(el) => {
                labels.current[key] = el;
              }}
              data-on="0"
              className="group absolute left-0 top-0 will-change-transform"
            >
              <span className="absolute -left-1 -top-1 block h-2 w-2 rounded-full border border-accent bg-bg opacity-0 transition-opacity duration-500 group-data-[on='1']:opacity-100" style={{ boxShadow: "0 0 10px var(--accent)" }} />
              <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
                <line
                  x1="0"
                  y1="0"
                  x2={dx}
                  y2={dy}
                  stroke="rgba(var(--fg-rgb),0.32)"
                  strokeWidth="1"
                  className="opacity-0 transition-opacity duration-700 group-data-[on='1']:opacity-100"
                />
              </svg>
              <div
                className="absolute opacity-0 transition-all duration-700 ease-out group-data-[on='1']:opacity-100"
                style={{
                  left: dx,
                  top: dy,
                  transform: `translate(${side === "l" ? "calc(-100% - 10px)" : "10px"}, -50%)`,
                }}
              >
                <span className={`block whitespace-nowrap ${side === "l" ? "text-right" : ""}`}>
                  <span className="mono block text-[10.5px] uppercase tracking-[0.14em] text-fg-3">{callouts[key as keyof typeof callouts].title}</span>
                  <span className="font-display block text-[15px] font-semibold tracking-[-0.01em] text-fg">{callouts[key as keyof typeof callouts].spec}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Copy */}
        <div className="frame relative flex min-h-[100svh] flex-col justify-end pb-10 pt-[calc(var(--nav-h)+28px)] md:pb-[11vh]">
          <div ref={copy} className="grid-12 relative z-10">
            <div className="col-span-4 md:col-span-7 lg:col-span-7">
              <p className="eyebrow signal fade-load" style={{ "--d": "0ms" } as CSSProperties}>
                {hero.eyebrow}
              </p>
              <Words as="h1" id="hero-title" text={hero.title} mode="load" delay={120} className="t-xl mt-6 text-fg" accent={["reimagined"]} />
              <div className="fade-load mt-8 max-w-[34rem]" style={{ "--d": "650ms" } as CSSProperties}>
                <p className="t-body-l text-fg">{hero.lede}</p>
                <p className="mt-3 text-fg-2 text-pretty">{hero.body}</p>
              </div>
              <div className="fade-load mt-10 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ "--d": "800ms" } as CSSProperties}>
                <Magnetic>
                  <TransitionLink href="/contact" className="btn btn-primary">
                    Contact Sales
                    <span className="btn-arrow">
                      <Arrow />
                    </span>
                  </TransitionLink>
                </Magnetic>
                <TransitionLink href="/technology" className="link-u text-[15px] text-fg-2 transition-colors hover:text-fg">
                  See how it works
                </TransitionLink>
              </div>
            </div>
          </div>

          {/* Mobile visual: assembled poster + spec list (no WebGL on small screens) */}
          <div className="relative mt-12 md:hidden">
            <div className="relative aspect-[4/3] w-full">
              <Image src="/hero/poster-assembled.png" alt="The BusGuard unit: a weatherproof enclosure housing the camera, antenna, and onboard compute." fill sizes="100vw" className="object-contain" />
            </div>
            <ul data-reveal="stagger" className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--line)]">
              {ORDER.map(({ key }, i) => (
                <li key={key} className="bg-bg p-4" style={{ "--i": i } as CSSProperties}>
                  <span className="mono block text-[10.5px] uppercase tracking-[0.14em] text-fg-3">{callouts[key as keyof typeof callouts].title}</span>
                  <span className="font-display mt-1 block text-[15px] font-semibold text-fg">{callouts[key as keyof typeof callouts].spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outro caption once assembled */}
        <div ref={outro} className="pointer-events-none absolute inset-x-0 bottom-[7vh] hidden opacity-0 md:block">
          <div className="frame flex flex-col items-center text-center">
            <p className="eyebrow signal">Assembled</p>
            <p className="font-display mt-4 text-[clamp(1.4rem,1rem+1.2vw,2.2rem)] font-semibold tracking-[-0.025em] text-fg">One device. Every stop.</p>
            <p className="mono mt-4 text-[11.5px] uppercase tracking-[0.12em] text-fg-2">{specLine.join("  ·  ")}</p>
          </div>
        </div>

        {/* Scroll hint with progress */}
        <div ref={hint} aria-hidden="true" className="pointer-events-none absolute bottom-8 right-[var(--gutter)] hidden items-center gap-4 md:flex">
          <span className="mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3">Scroll to assemble</span>
          <span className="relative block h-px w-24 overflow-hidden bg-line-2">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          </span>
        </div>
      </div>
    </section>
  );
}
