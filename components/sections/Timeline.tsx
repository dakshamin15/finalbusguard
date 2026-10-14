"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Lightbox from "@/components/system/Lightbox";
import { awards, type Award } from "@/lib/content";
import { getGsap } from "@/lib/gsap";
import { motionOK } from "@/lib/motion";

function Photos({ award }: { award: Award }) {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const n = award.photos.length;
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? i : (i + 1) % n));
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? i : (i - 1 + n) % n));
    },
    [n]
  );
  if (!n) return null;
  const rot = [-5, 1.5, 6];
  const off = [6, -4, 8];

  return (
    <>
      <ul className="mt-8 flex items-start" aria-label={`${award.name} photos`}>
        {award.photos.map((p, i) => (
          <li key={p.src} className={i ? "-ml-6 md:-ml-8" : ""} style={{ zIndex: i === 1 ? 3 : 2 - i }}>
            <button
              type="button"
              onClick={() => setIdx(i)}
              className="group relative block w-28 overflow-hidden rounded-xl shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] ring-1 ring-[var(--line-2)] transition-transform duration-500 ease-out hover:z-10 hover:!rotate-0 hover:scale-105 md:w-36"
              style={{ transform: `rotate(${rot[i]}deg) translateY(${off[i]}px)` }}
              aria-label={`Open photo ${i + 1} of ${n}: ${p.alt}`}
            >
              <span className="relative block aspect-[4/3]">
                <Image src={p.src} alt="" fill sizes="144px" className="object-cover" />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        open={idx !== null}
        onClose={close}
        onKey={onKey}
        label={idx !== null ? `${award.name} · ${idx + 1} / ${n}` : award.name}
        controls={
          n > 1 ? (
            <>
              <button type="button" onClick={() => setIdx((i) => (i === null ? i : (i - 1 + n) % n))} aria-label="Previous photo" className="mono grid h-10 place-items-center rounded-full px-4 text-[11px] uppercase tracking-[0.12em] text-fg shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-[rgba(var(--fg-rgb),0.06)]">
                Prev
              </button>
              <button type="button" onClick={() => setIdx((i) => (i === null ? i : (i + 1) % n))} aria-label="Next photo" className="mono grid h-10 place-items-center rounded-full px-4 text-[11px] uppercase tracking-[0.12em] text-fg shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-[rgba(var(--fg-rgb),0.06)]">
                Next
              </button>
            </>
          ) : null
        }
      >
        {idx !== null && (
          <div className="relative mx-auto h-[min(78svh,900px)] w-full">
            <Image key={award.photos[idx].src} src={award.photos[idx].src} alt={award.photos[idx].alt} fill sizes="90vw" className="rounded-2xl object-contain" />
          </div>
        )}
      </Lightbox>
    </>
  );
}

export default function Timeline() {
  const root = useRef<HTMLOListElement>(null);
  const spine = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!motionOK()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(spine.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <ol ref={root} className="relative">
      <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-[calc(25%-0.5px)]" />
      <span ref={spine} aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent md:left-[calc(25%-0.5px)]" />
      {awards.map((a) => (
        <li key={a.id} className="relative grid grid-cols-1 gap-6 pb-20 pl-10 md:grid-cols-4 md:gap-0 md:pb-28 md:pl-0">
          <span aria-hidden="true" className="absolute left-0 top-1.5 block h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg md:left-[calc(25%-7.5px)]" style={{ boxShadow: "0 0 14px var(--accent-glow)" }} />
          <div className="md:pr-12 md:text-right" data-reveal>
            <p className="mono text-[11px] uppercase tracking-[0.14em] text-fg-2">{a.date}</p>
          </div>
          <article className="md:col-span-3 md:pl-12 lg:pr-[12%]" data-reveal style={{ "--d": "100ms" } as CSSProperties}>
            <div className="flex flex-wrap items-center gap-5">
              {a.logo && (
                <div className="grid h-14 w-32 place-items-center rounded-xl bg-white shadow-[inset_0_0_0_1px_var(--line)] px-3">
                  <Image src={a.logo.src} alt={`${a.name} logo`} width={a.logo.w} height={a.logo.h} sizes="128px" className="max-h-10 w-auto object-contain" />
                </div>
              )}
            </div>
            <p className="font-display mt-6 text-[clamp(2rem,1.4rem+2.4vw,3.75rem)] font-bold leading-none tracking-[-0.04em] text-accent">{a.badge}</p>
            <h3 className="t-title mt-3 text-fg">{a.name}</h3>
            <p className="mt-4 max-w-[40rem] text-fg-2 text-pretty">{a.description}</p>
            <Photos award={a} />
          </article>
        </li>
      ))}
    </ol>
  );
}
