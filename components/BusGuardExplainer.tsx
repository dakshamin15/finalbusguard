"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      </svg>
    ),
    label: "Real-Time Detection",
    stat: "95.3%",
    statLabel: "true positive rate",
    body: "A custom-trained computer vision model watches the stop arm and surrounding traffic on every trip — day, night, rain, or shine.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
    label: "Instant Alert",
    stat: "<200ms",
    statLabel: "start to buzzer fired",
    body: "The moment a violation is confirmed, a 100 dB onboard buzzer fires. No dispatcher. No delay. No human in the loop.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: "Automatic Logging",
    stat: "256 GB",
    statLabel: "onboard storage",
    body: "Every incident is automatically timestamped with GPS coordinates, image capture, and route ID — creating a legally defensible audit trail.",
  },
];

export default function BusGuardExplainer() {
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative px-6 py-24 overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      {/* Subtle top divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />

      <div className="max-w-[1000px] mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-[680px]"
        >
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.28em]"
              style={{ color: "#f97316" }}
            >
              The Product
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(249,115,22,0.2)" }} />
          </div>

          <h2
            className="font-black heading-tight mb-5"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              color: "#111111",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            A safety device built for{" "}
            <span style={{ color: "#f97316" }}>every school bus.</span>
          </h2>

          <p
            className="text-[17px] leading-relaxed"
            style={{ color: "#555555", maxWidth: "56ch" }}
          >
            BusGuard is a compact, weatherproof AI device that mounts inside any school bus
            and autonomously monitors for stop-arm violations — detecting, alerting, and
            logging every incident with no human intervention required.
          </p>
        </motion.div>

        {/* ── Feature row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(249,115,22,0.08)",
                  color: "#f97316",
                  border: "1px solid rgba(249,115,22,0.15)",
                }}
              >
                {f.icon}
              </div>

              {/* Stat */}
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  className="font-black heading-tight"
                  style={{ fontSize: "2rem", color: "#111111", lineHeight: 1 }}
                >
                  {f.stat}
                </span>
                <span
                  className="text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: "#aaaaaa" }}
                >
                  {f.statLabel}
                </span>
              </div>

              {/* Label */}
              <h3
                className="font-bold heading-tight mb-2"
                style={{ fontSize: "1.05rem", color: "#111111", lineHeight: 1.2 }}
              >
                {f.label}
              </h3>

              {/* Body */}
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "#777777" }}
              >
                {f.body}
              </p>

              {/* Bottom rule */}
              <div
                className="mt-6 h-px"
                style={{ background: "rgba(249,115,22,0.15)" }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Bottom tagline ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 text-sm font-medium"
          style={{ color: "#aaaaaa" }}
        >
          IP67 weatherproof · 4G LTE + WiFi · 12V bus power · 1080p wide-angle camera
        </motion.p>
      </div>
    </section>
  );
}
