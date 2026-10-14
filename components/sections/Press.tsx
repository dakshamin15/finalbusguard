"use client";

import Image from "next/image";
import { useCallback, useState, type CSSProperties } from "react";
import Words from "@/components/system/Words";
import Brackets from "@/components/system/Brackets";
import Lightbox from "@/components/system/Lightbox";
import { ArrowUpRight, Play } from "@/components/system/Icons";
import { press } from "@/lib/content";

export default function Press() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <section aria-labelledby="press-title" className="section relative">
      <div className="frame grid-12 items-center gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          <p className="eyebrow signal" data-reveal>
            {press.eyebrow} &middot; {press.date}
          </p>
          <Words as="h2" id="press-title" text={press.title} className="t-m mt-6 text-fg" />
          <p data-reveal className="t-body-l mt-6 max-w-[34rem] text-fg-2 text-pretty" style={{ "--d": "150ms" } as CSSProperties}>
            {press.body}
          </p>
          <div data-reveal className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ "--d": "250ms" } as CSSProperties}>
            <a href={press.watchUrl} target="_blank" rel="noopener noreferrer" className="link-u always inline-flex items-center gap-1.5 text-[15px] text-fg">
              Watch news broadcast <ArrowUpRight />
              <span className="sr-only">(opens YouTube in a new tab)</span>
            </a>
            <a href={press.articleUrl} target="_blank" rel="noopener noreferrer" className="link-u always inline-flex items-center gap-1.5 text-[15px] text-fg">
              Read article <ArrowUpRight />
              <span className="sr-only">(opens WRIC in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-7" data-reveal style={{ "--d": "100ms" } as CSSProperties}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lock group relative block w-full overflow-hidden rounded-[22px] text-left shadow-[inset_0_0_0_1px_var(--line)]"
            aria-label={`Play the ${press.outlet} broadcast: ${press.title}`}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[22px]">
              <Image
                src={press.thumb.src}
                alt={press.thumb.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--bg-rgb),0.65)] via-transparent to-transparent" />
            </div>
            <Brackets size={22} inset={16} />
            <span className="absolute bottom-5 left-5 flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-ink shadow-[0_10px_40px_-8px_var(--accent-glow)] transition-transform duration-500 ease-out group-hover:scale-110">
                <Play className="translate-x-[1px]" />
              </span>
              <span className="mono text-[11px] uppercase tracking-[0.14em] text-fg">Play broadcast</span>
            </span>
          </button>
        </div>
      </div>

      <Lightbox open={open} onClose={close} label={`${press.outlet}: ${press.title}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
          {open && (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${press.videoId}?autoplay=1&rel=0`}
              title={`${press.outlet}: ${press.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </Lightbox>
    </section>
  );
}
