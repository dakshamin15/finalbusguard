"use client";

import { useEffect, useRef } from "react";
import { motionOK, pinMode } from "@/lib/motion";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** In pin mode, counting is driven externally (a pinned scene) via a `bg:count` event on the element. */
  manual?: boolean;
  /** Thousands separators (off for things like "1080p"). */
  grouping?: boolean;
};

const fmt = (n: number, d: number, g = true) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: g });

/**
 * Renders the final value on the server (real number for screen readers and no-JS),
 * then animates only the visible digits once in view.
 */
export default function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1400, className = "", manual = false, grouping = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionOK()) return;
    const out = el.querySelector<HTMLSpanElement>("[data-n]");
    if (!out) return;
    let raf = 0;
    let done = false;

    const run = () => {
      if (done) return;
      done = true;
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        const e = 1 - Math.pow(1 - p, 4);
        out.textContent = fmt(value * e, decimals, grouping);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      out.textContent = fmt(0, decimals, grouping);
      raf = requestAnimationFrame(step);
    };

    if (manual && pinMode()) {
      out.textContent = fmt(0, decimals, grouping);
      const h = () => run();
      el.addEventListener("bg:count", h);
      return () => {
        el.removeEventListener("bg:count", h);
        cancelAnimationFrame(raf);
      };
    }

    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      // Already visible on mount: count immediately.
      run();
      return () => cancelAnimationFrame(raf);
    }
    out.textContent = fmt(0, decimals, grouping);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals, duration, manual, grouping]);

  const final = fmt(value, decimals, grouping);
  return (
    <span ref={ref} className={`tnum ${className}`} data-count>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
      <span aria-hidden="true">
        {prefix}
        <span data-n>{final}</span>
        {suffix}
      </span>
    </span>
  );
}
