import type { CSSProperties } from "react";
import Words from "@/components/system/Words";
import Brackets from "@/components/system/Brackets";
import { TransitionLink } from "@/components/system/Transition";
import { Arrow } from "@/components/system/Icons";

const pages = [
  { href: "/problem", title: "The problem", line: "Why documenting violations after the fact isn’t enough." },
  { href: "/technology", title: "Technology", line: "How BusGuard detects, alerts, and logs in under 200 ms." },
  { href: "/recognition", title: "Recognition", line: "Competitions, press, and the USDOT Road Safety Innovation Expo." },
  { href: "/about", title: "About", line: "The three founders from Henrico County behind BusGuard." },
];

/** A short index into the rest of the site, so the landing page stays succinct. */
export default function Explore() {
  return (
    <section aria-labelledby="explore-title" className="section relative pt-0 md:pt-0">
      <div className="frame">
        <p className="eyebrow signal" data-reveal>
          Explore
        </p>
        <Words as="h2" id="explore-title" text="Go deeper." className="t-l mt-6 text-fg" />
        <ul data-reveal="stagger" className="mt-12 grid gap-3 md:mt-16 md:grid-cols-2 md:gap-4">
          {pages.map((p, i) => (
            <li key={p.href} style={{ "--i": i } as CSSProperties}>
              <TransitionLink href={p.href} className="lock card group relative flex h-full flex-col p-7 transition-colors duration-300 hover:bg-white md:p-9">
                <Brackets inset={12} />
                <span className="mono text-[11px] tracking-[0.14em] text-accent-ink">0{i + 1}</span>
                <span className="mt-12 flex items-end justify-between gap-6 md:mt-20">
                  <span>
                    <span className="t-m block text-fg">{p.title}</span>
                    <span className="mt-3 block max-w-[30ch] text-fg-2 text-pretty">{p.line}</span>
                  </span>
                  <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-fg shadow-[inset_0_0_0_1px_var(--line-2)] transition-all duration-500 ease-out group-hover:bg-accent group-hover:text-ink group-hover:shadow-none">
                    <Arrow className="transition-transform duration-500 ease-out group-hover:-rotate-45" />
                  </span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
