import Image from "next/image";
import { TransitionLink } from "@/components/system/Transition";
import { ArrowUpRight } from "@/components/system/Icons";
import { MotionToggle } from "@/components/system/MotionPrefs";
import { nav, site, press } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg">
      <div className="frame pb-8 pt-20 md:pt-28">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <div className="flex items-center gap-3">
              <Image src="/brand/mark.png" alt="" width={30} height={36} className="h-9 w-[30px]" />
              <span className="font-display text-2xl font-bold tracking-[-0.03em]">BusGuard</span>
            </div>
            <p className="mt-6 max-w-sm text-fg-2 text-pretty">{site.footerLine}</p>
            <p className="font-display mt-8 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-fg">
              {site.tagline[0]}
              <br />
              <span className="text-accent">{site.tagline[1]}</span>
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-2 md:col-span-3 lg:col-span-2 lg:col-start-7">
            <p className="eyebrow mb-5">Pages</p>
            <ul className="flex flex-col gap-3 text-[15px]">
              {[...nav, { href: "/contact", label: "Contact" }].map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="link-u text-fg-2 transition-colors hover:text-fg">
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <p className="eyebrow mb-5">Contact</p>
            <ul className="flex flex-col gap-3 text-[15px] text-fg-2">
              <li>
                <a href={`mailto:${site.email}`} className="link-u transition-colors hover:text-fg">
                  {site.email}
                </a>
              </li>
              <li>{site.locationShort}</li>
              <li>
                <TransitionLink href="/contact" className="link-u transition-colors hover:text-fg">
                  Contact Sales
                </TransitionLink>
              </li>
            </ul>
          </div>

          <div className="col-span-4 md:col-span-2 lg:col-span-2">
            <p className="eyebrow mb-5">Press</p>
            <a href={press.articleUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-1.5 text-[15px] text-fg-2 transition-colors hover:text-fg">
              <span className="link-u">{press.outlet}</span>
              <ArrowUpRight className="mt-1.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the viewport edge */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p
          className="font-display whitespace-nowrap text-center font-extrabold leading-[0.76] tracking-[-0.06em]"
          style={{
            fontSize: "clamp(4rem, 21vw, 24rem)",
            fontStretch: "80%",
            color: "transparent",
            WebkitTextStroke: "1px rgba(var(--fg-rgb),0.12)",
            marginBottom: "-0.12em",
          }}
        >
          BusGuard
        </p>
      </div>

      <div className="frame relative flex flex-col gap-3 border-t border-line py-6 text-[13px] text-fg-3 md:flex-row md:items-center md:justify-between">
        <p>&copy; 2026 BusGuard. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <MotionToggle />
          <p className="mono text-[11px] tracking-[0.1em]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" aria-hidden="true" />
            {site.locationShort.toUpperCase()}
          </p>
        </div>
      </div>
    </footer>
  );
}
