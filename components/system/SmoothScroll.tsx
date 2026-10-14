"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getGsap } from "@/lib/gsap";
import { motionOK, osReduce } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    if (!motionOK() || osReduce()) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, anchors: { offset: -72 } });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // New route: jump to top and re-measure triggers after layout settles.
  useEffect(() => {
    const { ScrollTrigger } = getGsap();
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
