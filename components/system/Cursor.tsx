"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motionOK } from "@/lib/motion";

/** A trailing ring + dot that swell over interactive elements. Mouse only; the native cursor stays. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!motionOK() || !window.matchMedia("(pointer: fine)").matches) return;
    const r = ring.current!;
    const d = dot.current!;
    r.style.opacity = "0";
    d.style.opacity = "0";
    let mx = -100, my = -100, rx = -100, ry = -100, scale = 1, target = 1, raf = 0;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      r.style.opacity = "1";
      d.style.opacity = "1";
      const hot = (e.target as Element | null)?.closest?.("a, button, [role='button'], input, select, textarea, label");
      target = hot ? 1.9 : 1;
      r.dataset.hot = hot ? "1" : "0";
      d.style.opacity = hot ? "0" : "1";
    };
    const leave = () => {
      r.style.opacity = "0";
      d.style.opacity = "0";
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      scale += (target - scale) * 0.2;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale.toFixed(3)})`;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Reset the hover state when the page changes under a still cursor.
  useEffect(() => {
    if (ring.current) ring.current.dataset.hot = "0";
  }, [pathname]);

  return (
    <>
      <div ref={ring} className="cursor-ring hidden [@media(pointer:fine)]:block" aria-hidden="true" style={{ opacity: 0 }} />
      <div ref={dot} className="cursor-dot hidden [@media(pointer:fine)]:block" aria-hidden="true" style={{ opacity: 0 }} />
    </>
  );
}
