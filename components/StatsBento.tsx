"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start * 10) / 10); }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="stat-num">
      {suffix === "%" ? count.toFixed(1) : Math.floor(count)}{suffix}
    </span>
  );
}

function Card({ children, index, colSpan = false }: { children: React.ReactNode; index: number; colSpan?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`rounded-[6px] p-8 cursor-default transition-all duration-200${colSpan ? " md:col-span-2" : ""}`}
      style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-2px)";
        el.style.borderColor = "rgba(249,115,22,0.4)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.borderColor = "rgba(0,0,0,0.08)";
      }}
    >
      {children}
    </motion.div>
  );
}

export default function StatsBento() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative z-10 w-full pt-8 pb-28 px-4 md:px-8" style={{ background: "#f2f2ef" }}>
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-xs font-semibold uppercase tracking-[0.18em] mb-8 text-center"
        style={{ color: "#999999" }}
      >
        By the Numbers
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[1440px] mx-auto">
        <Card index={0} colSpan>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="text-[clamp(4rem,10vw,7rem)] font-black leading-none mb-3 heading-tight"
                style={{ color: "#111111", fontVariantNumeric: "tabular-nums" }}>
                <CountUp target={95.3} suffix="%" />
              </div>
              <div className="text-xl font-bold mb-2 heading-tight" style={{ color: "#111111" }}>
                True Positive Detection Rate
              </div>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: "#666666" }}>
                Validated across 211 controlled field trials under real-world conditions , day, night,
                rain, and direct sun.
              </p>
            </div>
            <div className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(249,115,22,0.08)", border: "1.5px solid rgba(249,115,22,0.25)" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l6 6 14-14" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Card>

        <Card index={1}>
          <div className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-none mb-2 heading-tight"
            style={{ color: "#111111", fontVariantNumeric: "tabular-nums" }}>
            <CountUp target={211} />
          </div>
          <div className="text-base font-bold mb-1 heading-tight" style={{ color: "#111111" }}>Controlled Field Trials</div>
          <p className="text-sm" style={{ color: "#666666" }}>Rigorous testing across diverse lighting, weather, and road conditions.</p>
        </Card>

        <Card index={2}>
          <div className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-none mb-2 heading-tight"
            style={{ color: "#111111", fontVariantNumeric: "tabular-nums" }}>
            $<CountUp target={459} />
          </div>
          <div className="text-base font-bold mb-1 heading-tight" style={{ color: "#111111" }}>Per Unit</div>
          <p className="text-sm" style={{ color: "#666666" }}>Bulk pricing available for district-wide deployments.</p>
        </Card>

        <Card index={3} colSpan>
          <div className="text-[clamp(3rem,8vw,6rem)] font-black leading-none mb-2 heading-tight stat-num"
            style={{ color: "#111111" }}>
            &lt; 200ms
          </div>
          <div className="text-base font-bold mb-1 heading-tight" style={{ color: "#111111" }}>Alert Trigger Latency</div>
          <p className="text-sm" style={{ color: "#666666" }}>From violation detection to audible buzzer alert , faster than a human reaction.</p>
        </Card>
      </div>
    </section>
  );
}
