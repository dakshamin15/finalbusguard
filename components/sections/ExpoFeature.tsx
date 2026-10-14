"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import Brackets from "@/components/system/Brackets";
import { ArrowUpRight } from "@/components/system/Icons";
import { expo } from "@/lib/content";
import { getGsap } from "@/lib/gsap";
import { motionOK } from "@/lib/motion";

/**
 * Full-bleed photograph from the USDOT Road Safety Innovation Expo.
 * Wording is "presented at" only; no endorsement or partnership is implied.
 */
export default function ExpoFeature({ as = "h2", priority = false }: { as?: "h1" | "h2"; priority?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const H = as;

  useEffect(() => {
    if (!motionOK()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -7 },
        { yPercent: 7, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="expo-title" className="relative bg-bg py-6 md:py-10">
      <div data-reveal="fade" className="expo-clip relative mx-auto aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-[min(88svh,58vw)]">
        <div className="expo-zoom absolute inset-0">
          <div ref={img} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
            <Image
              src={expo.image}
              alt={expo.alt}
              fill
              priority={priority}
              sizes="100vw"
              quality={80}
              className="object-cover"
              style={{ objectPosition: "48% 52%" }}
            />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(var(--bg-rgb),0.45), transparent 22%), linear-gradient(to bottom, rgba(var(--bg-rgb),0.5), transparent 18%)" }} />
        <div className="pointer-events-none absolute inset-4 hidden md:block md:inset-8">
          <Brackets size={26} />
        </div>

      </div>
      <Caption H={H} />
    </section>
  );
}

function Caption({ H }: { H: "h1" | "h2" }) {
  return (
    <div className="frame grid-12 gap-y-5 pb-2 pt-8 md:pt-12">
      <div className="col-span-4 md:col-span-8 lg:col-span-7">
        <p className="eyebrow signal" data-reveal>
          Presented at &middot; {expo.date}
        </p>
        <H id="expo-title" tabIndex={H === "h1" ? -1 : undefined} data-reveal className="t-m mt-5 max-w-[24ch] text-fg" style={{ "--d": "120ms" } as CSSProperties}>
          {expo.caption}
        </H>
      </div>
      <div className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end" data-reveal style={{ "--d": "240ms" } as CSSProperties}>
        <p className="mono text-[11px] uppercase tracking-[0.12em] text-fg-2">{expo.location}</p>
        <p className="mt-3 text-[12.5px] leading-relaxed text-fg-3">{expo.disclaimer}</p>
        <a href={expo.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-fg-2 underline decoration-[var(--line-2)] underline-offset-4 transition-colors hover:text-fg">
          About the Expo
          <ArrowUpRight />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
