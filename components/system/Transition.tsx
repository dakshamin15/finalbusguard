"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { animate } from "motion";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { bezier, motionOK } from "@/lib/motion";
import { nav } from "@/lib/content";

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });

const labelFor = (href: string) =>
  href === "/" ? "Home" : nav.find((n) => n.href === href)?.label ?? (href === "/contact" ? "Contact" : href.replace("/", ""));

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const lead = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const busy = useRef(false);
  const [label, setLabel] = useState("");
  const [announce, setAnnounce] = useState("");
  const first = useRef(true);

  const navigate = useCallback(
    async (href: string) => {
      const el = curtain.current;
      if (!el || !motionOK() || busy.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      setLabel(labelFor(href));
      el.style.visibility = "visible";
      if (lead.current) lead.current.style.visibility = "visible";
      window.__lenis?.stop();
      if (lead.current) animate(lead.current, { transform: ["translate3d(0,100%,0)", "translate3d(0,0%,0)"] }, { duration: 0.5, ease: bezier.inOut });
      await animate(el, { transform: ["translate3d(0,100%,0)", "translate3d(0,0%,0)"] }, { duration: 0.6, delay: 0.08, ease: bezier.inOut });
      if (lead.current) lead.current.style.transform = "translate3d(0,100%,0)";
      pending.current = true;
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const finish = async () => {
      const h1 = document.querySelector<HTMLElement>("main h1");
      h1?.focus({ preventScroll: true });
      setAnnounce(document.title);
      if (!pending.current) return;
      pending.current = false;
      const el = curtain.current;
      if (!el) return;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      window.__lenis?.start();
      await animate(el, { transform: ["translate3d(0,0%,0)", "translate3d(0,-100%,0)"] }, { duration: 0.7, ease: bezier.inOut });
      el.style.visibility = "hidden";
      el.style.transform = "translate3d(0,100%,0)";
      busy.current = false;
    };
    finish();
  }, [pathname]);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="fixed inset-0 z-[120] flex items-center justify-center bg-bg-2"
        style={{ transform: "translate3d(0,100%,0)", visibility: "hidden", willChange: "transform" }}
      >
        <div className="mono absolute bottom-8 left-[var(--gutter)] text-[11px] uppercase tracking-[0.14em] text-fg-3">BusGuard</div>
        <div className="absolute inset-x-0 top-0 h-px bg-accent" style={{ boxShadow: "0 0 24px 2px var(--accent)" }} />
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: "0 0 12px var(--accent)" }} />
          <span className="eyebrow text-fg">{label}</span>
        </div>
      </div>
      <div ref={lead} aria-hidden="true" className="fixed inset-0 z-[119] bg-accent" style={{ transform: "translate3d(0,100%,0)", visibility: "hidden", willChange: "transform" }} />
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </TransitionCtx.Provider>
  );
}

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & LinkProps & { href: string };

export const TransitionLink = forwardRef<HTMLAnchorElement, TLinkProps>(function TransitionLink(
  { href, onClick, children, ...rest },
  ref
) {
  const { navigate } = useContext(TransitionCtx);
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!href.startsWith("/") || href.includes("#")) return;
    e.preventDefault();
    if (href === pathname) {
      window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(href);
  };

  return (
    <Link ref={ref} href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
});
