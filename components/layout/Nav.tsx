"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/system/Transition";
import { ArrowUpRight } from "@/components/system/Icons";
import { nav } from "@/lib/content";
import { bezier } from "@/lib/motion";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const rail = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 480 && y > last + 2);
        if (y < last - 2) setHidden(false);
        last = y;
        if (rail.current) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const ms = Math.round(Math.min(1, Math.max(0, y / Math.max(1, max))) * 200);
          rail.current.textContent = `T+${String(ms).padStart(3, "0")} ms`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    menuBtn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !sheet.current) return;
      const f = [menuBtn.current!, ...Array.from(sheet.current.querySelectorAll<HTMLElement>("a"))];
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault();
        f[0].focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open, close]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[80] transition-transform duration-500 ease-out"
        style={{ transform: hidden && !open ? "translate3d(0,-110%,0)" : "none" }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: scrolled || open ? 1 : 0,
            background: "rgba(var(--bg-rgb),0.74)",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
            borderBottom: "1px solid var(--line)",
          }}
        />
        <div className="frame relative flex h-[var(--nav-h)] items-center justify-between gap-6">
          <TransitionLink href="/" className="group flex items-center gap-2.5 rounded-md" aria-label="BusGuard home">
            <Image src="/brand/mark.png" alt="" width={26} height={31} className="h-[31px] w-[26px] transition-transform duration-500 ease-out group-hover:-rotate-6" />
            <span className="font-display text-[19px] font-bold tracking-[-0.03em] text-fg">BusGuard</span>
          </TransitionLink>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-full p-1 shadow-[inset_0_0_0_1px_var(--line)]" style={{ background: "rgba(var(--fg-rgb),0.02)" }}>
              {nav.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <TransitionLink
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors duration-200 lg:px-4 ${active ? "text-fg" : "text-fg-2 hover:text-fg"}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full"
                          style={{ background: "rgba(var(--fg-rgb),0.07)", boxShadow: "inset 0 0 0 1px var(--line)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                      <span className="relative">{l.label}</span>
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <span ref={rail} aria-hidden="true" className="mono hidden w-[84px] text-right text-[11px] tracking-[0.08em] text-fg-3 xl:inline-block">
              T+000 ms
            </span>
            <TransitionLink href="/contact" className="btn btn-primary btn-sm hidden md:inline-flex">
              Contact Sales
              <ArrowUpRight />
            </TransitionLink>
            <button
              ref={menuBtn}
              type="button"
              className="relative grid h-11 w-11 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--line-2)] md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="absolute h-px w-[18px] bg-fg transition-transform duration-500 ease-out" style={{ transform: open ? "rotate(45deg)" : "translateY(-3.5px)" }} />
              <span className="absolute h-px w-[18px] bg-fg transition-transform duration-500 ease-out" style={{ transform: open ? "rotate(-45deg)" : "translateY(3.5px)" }} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col bg-bg pt-[calc(var(--nav-h)+24px)] md:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: bezier.out }}
          >
            <nav aria-label="Mobile" className="frame flex flex-1 flex-col">
              <ul className="flex flex-col">
                {[...nav, { href: "/contact", label: "Contact" }].map((l, i) => (
                  <motion.li
                    key={l.href}
                    className="border-b border-line"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: bezier.out }}
                  >
                    <TransitionLink
                      href={l.href}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className="flex items-baseline justify-between py-4"
                      onClick={() => setOpen(false)}
                    >
                      <span className={`t-m ${isActive(l.href) ? "text-accent" : "text-fg"}`}>{l.label}</span>
                      <span className="mono text-[11px] text-fg-3">0{i + 1}</span>
                    </TransitionLink>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto pb-10 pt-8">
                <a href="mailto:info@busguard.net" className="mono text-sm text-fg-2">
                  info@busguard.net
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
