"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

/* ── Data ─────────────────────────────────────────────────────────────── */

const timelineSteps = [
  {
    ms: "0 ms",
    label: "DETECTION",
    title: "Camera Detects Violation",
    description:
      "Computer vision continuously monitors the stop arm and surrounding traffic. The moment the arm extends and a vehicle crosses the threshold, analysis begins.",
    lines: [
      { k: "Stop Arm",    v: "EXTENDED",   hot: true  },
      { k: "Frame Index", v: "00:00:000",  hot: false },
      { k: "Trigger",     v: "ACTIVE",     hot: true  },
    ],
  },
  {
    ms: "~80 ms",
    label: "ANALYSIS",
    title: "ML Model Validates Threat",
    description:
      "The on-device CNN scores the frame, filtering parked cars, cyclists, and shadows. Only confirmed violations pass the 94% confidence threshold.",
    lines: [
      { k: "Model",      v: "Custom CNN", hot: false },
      { k: "Confidence", v: "98.2%",      hot: true  },
      { k: "False Pos.", v: "REJECTED",   hot: false },
    ],
  },
  {
    ms: "<200 ms",
    label: "ALERT",
    title: "Buzzer Fires. Log Written.",
    description:
      "An audible 100 dB alert fires through the onboard buzzers. Simultaneously, a timestamped record with GPS, image capture, and route ID is written to storage.",
    lines: [
      { k: "Buzzer",    v: "100 dB",  hot: true  },
      { k: "GPS",       v: "LOCKED",  hot: false },
      { k: "Log Entry", v: "WRITTEN", hot: true  },
    ],
  },
];

const features = [
  {
    eyebrow: "Core Intelligence",
    title: "Computer Vision",
    body:
      "Our proprietary CNN is trained specifically on stop-arm violation scenarios — accounting for bus geometry, arm extension angles, vehicle trajectories, and lighting variation. 95.3% true positive rate across 211 field trials.",
    tags: ["95.3% accuracy", "Custom dataset", "Day & night", "Multi-angle"],
    terminal: {
      label: "Live Detection Feed",
      rows: [
        { k: "Stop Arm",   v: "EXTENDED",       c: "#f97316" },
        { k: "Vehicle",    v: "DETECTED",        c: "#f97316" },
        { k: "Confidence", v: "98.2%",           c: "#22c55e" },
        { k: "Action",     v: "ALERT TRIGGERED", c: "#f97316" },
      ],
    },
  },
  {
    eyebrow: "Audit Trail",
    title: "Incident Logging",
    body:
      "Every detected violation is timestamped and stored with full metadata — GPS coordinates, image capture, vehicle speed estimate, and route ID — creating a legally defensible audit trail for district reporting.",
    tags: ["GPS timestamps", "Image capture", "Fleet dashboard", "Export-ready"],
    terminal: {
      label: "Incident Log",
      rows: [
        { k: "Today",       v: "3 violations",   c: "#f97316" },
        { k: "This Week",   v: "12 violations",  c: "#999"    },
        { k: "Last Export", v: "2 h ago",         c: "#999"    },
        { k: "Storage",     v: "256 GB onboard", c: "#22c55e" },
      ],
    },
  },
];

const specs = [
  { spec: "Detection Model",     value: "Custom CNN, proprietary dataset", hi: false },
  { spec: "True Positive Rate",  value: "95.3%  (211 trials)",             hi: true  },
  { spec: "False Positive Rate", value: "< 2%",                            hi: false },
  { spec: "Alert Latency",       value: "< 200 ms",                        hi: true  },
  { spec: "Operating Temp",      value: "−20°C to 60°C",                   hi: false },
  { spec: "Enclosure",           value: "IP67 weatherproof",               hi: false },
  { spec: "Power",               value: "12 V bus electrical",             hi: false },
  { spec: "Storage",             value: "256 GB onboard (expandable)",     hi: false },
  { spec: "Connectivity",        value: "4G LTE + WiFi sync",              hi: false },
  { spec: "Camera",              value: "1080p wide-angle, WDR",           hi: false },
];

/* ── Helpers ──────────────────────────────────────────────────────────── */

function Terminal({ label, rows }: { label: string; rows: { k: string; v: string; c: string }[] }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rounded-[10px] overflow-hidden w-full max-w-sm"
      style={{ background: "#0d0d10", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-1.5 px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-auto text-[10px] font-mono uppercase tracking-widest" style={{ color: "#666" }}>{label}</span>
      </div>
      <div className="p-5 flex flex-col gap-3.5">
        {rows.map((r, i) => (
          <div key={r.k} className="flex items-center justify-between">
            <span className="text-[11px] font-mono" style={{ color: "#888" }}>{r.k}</span>
            <span className="text-[11px] font-mono font-bold" style={{ color: r.c }}>
              {r.v}
              {i === rows.length - 1 && (
                <span style={{ opacity: tick % 2 === 0 ? 1 : 0, transition: "opacity 0.15s" }}>▌</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sticky scroll timeline ───────────────────────────────────────────── */

function StickyTimeline() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Map 0→1 scroll progress across 3 steps
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveStep(v < 0.34 ? 0 : v < 0.67 ? 1 : 2);
  });

  // Orange progress bar width
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const step = timelineSteps[activeStep];

  return (
    /* Outer: tall enough to scroll through 3 steps */
    <div ref={outerRef} style={{ height: "300vh" }}>
      {/* Inner: sticks to viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: "#111111",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col h-full max-w-[1000px] mx-auto w-full px-6 md:px-10"
          style={{ paddingTop: "72px", paddingBottom: "28px" }}>

          {/* Header row */}
          <div className="flex items-center justify-between mb-8 md:mb-10 flex-shrink-0">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>
                Violation → Alert
              </span>
              <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                No human intervention. Under 200 milliseconds.
              </p>
            </div>
            {/* Step counter */}
            <div className="flex items-center gap-3">
              {timelineSteps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === activeStep ? 32 : 8,
                    height: 8,
                    background: i === activeStep ? "#f97316" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main animated content */}
          <div className="flex-1 flex items-start min-h-0 pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 50, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
              >
                {/* Left: text */}
                <div>
                  {/* Big step number — flashes orange on enter */}
                  <motion.div
                    initial={{ color: "#f97316", opacity: 0.9 }}
                    animate={{ color: "rgba(249,115,22,0.18)", opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="font-black heading-tight mb-3 select-none"
                    style={{
                      fontSize: "clamp(4.5rem, 11vw, 8rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    0{activeStep + 1}
                  </motion.div>

                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.28em] px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(249,115,22,0.18)", color: "#f97316", border: "1px solid rgba(249,115,22,0.35)" }}
                    >
                      {step.label}
                    </span>
                    <span
                      className="text-[11px] font-mono font-bold"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {step.ms}
                    </span>
                  </div>

                  <h2
                    className="font-black heading-tight mb-4"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", color: "#ffffff", lineHeight: 1.08 }}
                  >
                    {step.title}
                  </h2>
                  <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.62)", maxWidth: "44ch", lineHeight: 1.65 }}>
                    {step.description}
                  </p>
                </div>

                {/* Right: terminal */}
                <div className="flex justify-center md:justify-end">
                  <Terminal label={step.label} rows={step.lines.map(l => ({ k: l.k, v: l.v, c: l.hot ? "#f97316" : "#aaa" }))} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom progress bar */}
          <div className="flex-shrink-0 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between mb-2.5">
              {timelineSteps.map((s, i) => (
                <span
                  key={s.label}
                  className="text-[10px] font-mono uppercase tracking-widest transition-colors duration-300"
                  style={{ color: i === activeStep ? "#f97316" : "rgba(255,255,255,0.28)" }}
                >
                  {s.label}
                </span>
              ))}
            </div>
            <div className="w-full rounded-full" style={{ height: 2, background: "rgba(255,255,255,0.1)" }}>
              <motion.div className="h-full rounded-full" style={{ width: barWidth, background: "#f97316" }} />
            </div>
            <p className="text-[10px] font-mono mt-3 text-center" style={{ color: "rgba(255,255,255,0.28)" }}>
              scroll to advance ↓
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function TechnologyPage() {
  const featuresRef = useRef(null);
  const specsRef    = useRef(null);
  const featuresIn  = useInView(featuresRef, { once: true, margin: "-80px" });
  const specsIn     = useInView(specsRef,    { once: true, margin: "-80px" });

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────── */}
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
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>Technology</span>
            <div className="flex-1 h-px" style={{ background: "rgba(249,115,22,0.25)" }} />
          </div>
          <h1
            className="font-black heading-tight mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#111111", lineHeight: 1.0 }}
          >
            Engineering<br />
            <span style={{ color: "#f97316" }}>Student Safety.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#555555" }}>
            A deep look at the computer vision, hardware, and software systems
            that power BusGuard&apos;s real-time detection capabilities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative z-10 mt-14 max-w-[860px] mx-auto flex flex-wrap gap-3"
        >
          {[
            { n: "95.3%",  l: "True Positive Rate" },
            { n: "<200ms", l: "Alert Latency"       },
            { n: "IP67",   l: "Weatherproof"        },
            { n: "100 dB", l: "Onboard Buzzer"      },
          ].map(({ n, l }) => (
            <div
              key={n}
              className="flex items-center gap-3 px-5 py-3 rounded-full"
              style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(0,0,0,0.09)", backdropFilter: "blur(8px)" }}
            >
              <span className="text-base font-black heading-tight" style={{ color: "#f97316" }}>{n}</span>
              <span className="text-[11px] font-medium" style={{ color: "#888" }}>{l}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── STICKY SCROLL TIMELINE ──────────────────────────────────── */}
      <StickyTimeline />

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section ref={featuresRef} className="relative py-28 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col gap-28">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              animate={featuresIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: "#f97316" }}>
                  {f.eyebrow}
                </span>
                <h2
                  className="font-black heading-tight mt-3 mb-5"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111111", lineHeight: 1.05 }}
                >
                  {f.title}
                </h2>
                <p className="text-[15px] leading-relaxed mb-8" style={{ color: "#666666", maxWidth: "42ch" }}>
                  {f.body}
                </p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] px-3.5 py-1.5 rounded-full font-medium"
                      style={{ background: "rgba(249,115,22,0.07)", color: "#f97316", border: "1px solid rgba(249,115,22,0.18)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <Terminal label={f.terminal.label} rows={f.terminal.rows} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SPEC TABLE ──────────────────────────────────────────────── */}
      <section
        ref={specsRef}
        className="relative py-28 px-6 overflow-hidden"
        style={{
          background: "#f2f2ef",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        <div className="relative z-10 max-w-[860px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={specsIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-12"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>
              Specifications
            </span>
            <h2
              className="font-black heading-tight mt-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111111" }}
            >
              Under the hood.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={specsIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-[12px] overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.09)", background: "#fff" }}
          >
            {specs.map((row, i) => (
              <div
                key={row.spec}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-7 py-4 gap-2"
                style={{
                  borderBottom: i < specs.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  background: row.hi ? "rgba(249,115,22,0.04)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  {row.hi && <span className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: "#f97316" }} />}
                  <span className="text-sm font-medium" style={{ color: "#666", paddingLeft: row.hi ? 0 : 16 }}>
                    {row.spec}
                  </span>
                </div>
                <span className="text-sm font-mono font-semibold" style={{ color: row.hi ? "#f97316" : "#111" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
