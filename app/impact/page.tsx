"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SocialProof from "@/components/SocialProof";

const stats = [
  { n: "211",    label: "Controlled Trials" },
  { n: "95.3%",  label: "True Positive Rate" },
  { n: "<2%",    label: "False Positive Rate" },
  { n: "<200ms", label: "Alert Latency" },
];

const timeline = [
  {
    year: "2022",
    event: "Project Inception",
    detail:
      "BusGuard was founded after a near-miss incident at a Henrico County bus stop. The founding team began designing the first prototype.",
  },
  {
    year: "2023",
    event: "First Prototype Built",
    detail:
      "A working prototype was assembled and tested in controlled environments over a 90-day period, establishing baseline detection data.",
  },
  {
    year: "2023",
    event: "Controlled Trial Program",
    detail:
      "211 controlled trials conducted across multiple routes and weather conditions, refining the model and achieving 95.3% accuracy.",
  },
  {
    year: "2024",
    event: "Production Hardware",
    detail:
      "BusGuard v1.0 hardware finalized with IP67 weatherproof enclosure, 256GB onboard storage, and 4G LTE connectivity.",
  },
  {
    year: "2025",
    event: "District Outreach",
    detail:
      "BusGuard enters active discussions with Virginia school districts, presenting trial data and seeking deployment partners.",
  },
];

export default function ImpactPage() {
  const statsRef    = useRef(null);
  const timelineRef = useRef(null);
  const statsIn     = useInView(statsRef,    { once: true, margin: "-80px" });
  const timelineIn  = useInView(timelineRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative pt-44 pb-28 px-6 overflow-hidden"
        style={{
          background: "#f2f2ef",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.11) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 55% 45% at 50% -5%, rgba(249,115,22,0.13) 0%, transparent 70%)",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-[860px] mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>Impact</span>
            <div className="flex-1 h-px" style={{ background: "rgba(249,115,22,0.25)" }} />
          </div>
          <h1
            className="font-black heading-tight mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#111111", lineHeight: 1.0 }}
          >
            Measurable Results,{" "}
            <span style={{ color: "#f97316" }}>Real Safety.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#555555" }}>
            From 211 controlled trials to active district discussions — here is the
            data behind BusGuard&apos;s safety impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative z-10 mt-14 max-w-[860px] mx-auto flex flex-wrap gap-3"
        >
          {stats.map(({ n, label }) => (
            <div
              key={n}
              className="flex items-center gap-3 px-5 py-3 rounded-full"
              style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(0,0,0,0.09)", backdropFilter: "blur(8px)" }}
            >
              <span className="text-base font-black heading-tight" style={{ color: "#f97316" }}>{n}</span>
              <span className="text-[11px] font-medium" style={{ color: "#888" }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="relative py-24 px-6 overflow-hidden"
        style={{ background: "#111111" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative z-10 max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={statsIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-14"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>By the Numbers</span>
            <h2
              className="font-black heading-tight mt-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ffffff" }}
            >
              The data speaks.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.07)" }}>
            {[
              { n: "211",    l: "Controlled\nTrials",       sub: "Real-world conditions" },
              { n: "95.3%",  l: "True\nPositive Rate",      sub: "Across all trial data" },
              { n: "<2%",    l: "False\nPositive Rate",      sub: "Industry-leading precision" },
              { n: "<200ms", l: "Alert\nLatency",            sub: "Start to buzzer fired" },
            ].map(({ n, l, sub }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 24 }}
                animate={statsIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col p-8"
                style={{ background: "#111111" }}
              >
                <span
                  className="font-black heading-tight mb-2"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", color: "#f97316", lineHeight: 1 }}
                >
                  {n}
                </span>
                <span className="text-sm font-semibold mb-1 whitespace-pre-line" style={{ color: "#ffffff" }}>{l}</span>
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────── */}
      <section
        ref={timelineRef}
        className="relative py-28 px-6"
        style={{ background: "#ffffff" }}
      >
        <div className="max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={timelineIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>Our Journey</span>
              <div className="flex-1 h-px" style={{ background: "rgba(249,115,22,0.25)" }} />
            </div>
            <h2
              className="font-black heading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111111" }}
            >
              From idea to impact.
            </h2>
          </motion.div>

          <div className="relative">
            {/* vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={timelineIn ? { scaleY: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[27px] top-0 bottom-0 w-px origin-top"
              style={{ background: "linear-gradient(to bottom, #f97316, rgba(249,115,22,0.08))" }}
            />

            <div className="flex flex-col gap-0">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year + item.event}
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineIn ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                  className="relative flex gap-8 pb-12 last:pb-0"
                >
                  {/* node */}
                  <div className="flex-shrink-0" style={{ width: 56 }}>
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{
                        background: i === timeline.length - 1 ? "#f97316" : "#ffffff",
                        border: `1.5px solid ${i === timeline.length - 1 ? "#f97316" : "rgba(249,115,22,0.35)"}`,
                        color: i === timeline.length - 1 ? "#ffffff" : "#f97316",
                        zIndex: 1,
                        position: "relative",
                      }}
                    >
                      {item.year}
                    </div>
                  </div>

                  {/* content */}
                  <div className="flex-1 pt-3">
                    <h3 className="text-lg font-bold heading-tight mb-1.5" style={{ color: "#111111" }}>
                      {item.event}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SocialProof />
    </>
  );
}
