"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    title: "Computer Vision Core",
    subtitle: "Custom-trained detection model",
    description:
      "Our proprietary computer vision model is trained specifically for stop-arm violation scenarios — accounting for bus geometry, arm extension angles, and vehicle trajectories. Achieves 95.3% true positive rate under real-world field conditions.",
    tags: ["95.3% accuracy", "Custom dataset", "Day & night", "Multi-angle"],
    mockLabel: "Live Detection Feed",
    mockLines: [
      { label: "Stop Arm", value: "EXTENDED", color: "#f97316" },
      { label: "Vehicle Detected", value: "YES", color: "#f97316" },
      { label: "Confidence", value: "98.2%", color: "#15803d" },
      { label: "Action", value: "ALERT TRIGGERED", color: "#f97316" },
    ],
  },
  {
    title: "Hardened Hardware",
    subtitle: "Built for bus environments",
    description:
      "The BusGuard unit is housed in a weatherproof enclosure rated for school bus mounting conditions — temperature extremes, vibration, and moisture. Designed to keep running through every route, every season.",
    tags: ["IP67 weatherproof", "Vibration-resistant", "-20°C to 60°C", "Tamper-resistant"],
    mockLabel: "Hardware Status",
    mockLines: [
      { label: "Enclosure", value: "SEALED / IP67", color: "#15803d" },
      { label: "Temperature", value: "24°C", color: "#15803d" },
      { label: "Vibration", value: "NOMINAL", color: "#15803d" },
      { label: "Battery", value: "BUS-POWERED", color: "#999999" },
    ],
  },
  {
    title: "Incident Logging",
    subtitle: "Every violation on record",
    description:
      "BusGuard timestamps and stores every detected incident with full metadata — GPS location, image capture, vehicle speed estimate, and route ID — creating an audit trail for district reporting and legal compliance.",
    tags: ["GPS timestamps", "Image capture", "Fleet dashboard", "Export-ready"],
    mockLabel: "Incident Log",
    mockLines: [
      { label: "Today", value: "3 incidents", color: "#f97316" },
      { label: "This Week", value: "12 incidents", color: "#666666" },
      { label: "Last Export", value: "2h ago", color: "#666666" },
      { label: "Storage", value: "256GB onboard", color: "#15803d" },
    ],
  },
];

function MockUI({ label, lines }: { label: string; lines: { label: string; value: string; color: string }[] }) {
  return (
    <div className="rounded-[6px] p-6 min-h-[220px]"
      style={{ background: "#f2f2ef", border: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f97316" }} />
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#999999" }}>{label}</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {lines.map((line) => (
          <div key={line.label} className="flex items-center justify-between">
            <span className="text-xs font-mono" style={{ color: "#999999" }}>{line.label}</span>
            <span className="text-xs font-mono font-semibold" style={{ color: line.color }}>{line.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechnologySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative z-10 pt-16 pb-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-5 mb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#999999" }}>Technology</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.07)" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black heading-tight" style={{ color: "#111111" }}>
            The stack behind the safety.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="grid grid-cols-1 gap-10 items-start"
              style={{ gridTemplateColumns: i % 2 === 0 ? "65fr 35fr" : "35fr 65fr" }}
            >
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "#999999" }}>
                  {feature.subtitle}
                </p>
                <h3 className="text-2xl md:text-3xl font-black mb-4 heading-tight" style={{ color: "#111111" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed mb-7" style={{ color: "#666666", maxWidth: "44ch" }}>
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(249,115,22,0.08)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <MockUI label={feature.mockLabel} lines={feature.mockLines} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
