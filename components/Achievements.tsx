"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const achievements = [
  {
    title: "INNOSpark Pitch Competition",
    tag: "Top 10 of 875 · April 2026",
    description:
      "Placed top 10 internationally out of 875 competing teams. Selected for virtual finals, competing against submissions from across the globe.",
  },
  {
    title: "Blue Ocean Strategy Competition",
    tag: "Top 250 · Global",
    description:
      "BusGuard's market strategy recognized among the top 250 submissions globally, validating the go-to-market approach and uncontested market positioning.",
  },
  {
    title: "Diamond Challenge Semifinalists",
    tag: "Semifinalists",
    description:
      "Selected as semifinalists in the Diamond Challenge, one of the most competitive high school entrepreneurship competitions in the world.",
  },
  {
    title: "VCEE Lean Pitch",
    tag: "Top 6 in Virginia",
    description:
      "Finished top 6 in the state at the Virginia Council on Economic Education Lean Pitch competition, recognized for business model clarity and market fit.",
  },
  {
    title: "Henrico Innovation Challenge",
    tag: "2nd Place · HIC",
    description:
      "Awarded 2nd place at the Henrico Innovation Challenge, demonstrating technical innovation and real-world impact in the district's flagship competition.",
  },
];

export default function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative z-10 px-6 pt-20 pb-24 max-w-[1200px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "#999999" }}>
          Recognition &amp; Validation
        </p>
        <div className="flex items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-black heading-tight" style={{ color: "#111111" }}>
            Proven at every level.
          </h2>
          <div className="flex-1 h-px hidden md:block" style={{ background: "rgba(0,0,0,0.08)" }} />
        </div>
      </motion.div>

      {/* Mobile: horizontal scroll · Desktop: 3-col grid */}
      <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-2 md:pb-0 md:overflow-visible">
        {achievements.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-[6px] p-6 flex-shrink-0 w-72 md:w-auto flex flex-col gap-3 transition-all duration-200"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.08)",
              borderLeft: "3px solid #f97316",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(-2px)";
              el.style.borderColor = "rgba(249,115,22,0.5)";
              el.style.borderLeftColor = "#f97316";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(0)";
              el.style.borderColor = "rgba(0,0,0,0.08)";
              el.style.borderLeftColor = "#f97316";
            }}
          >
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full self-start"
              style={{ background: "rgba(249,115,22,0.10)", color: "#f97316" }}>
              {item.tag}
            </span>
            <h3 className="text-sm font-bold heading-tight leading-snug" style={{ color: "#111111" }}>
              {item.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#666666" }}>
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
