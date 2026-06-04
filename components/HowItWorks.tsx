"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Camera Detects Violation",
    description:
      "Computer vision continuously monitors the stop arm and surrounding traffic. When the arm extends and a vehicle approaches, the system initiates analysis.",
  },
  {
    number: "02",
    title: "System Confirms Threat",
    description:
      "The ML model validates the true positive in under 200ms, filtering out false positives from parked cars, cyclists, or other non-threatening movement.",
  },
  {
    number: "03",
    title: "Buzzer Alerts Students",
    description:
      "An audible warning fires immediately through the onboard buzzer, and the incident is timestamped and logged for district reporting and compliance.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative z-10 pt-20 pb-28 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-5 mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#999999" }}>
              Process
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.07)" }} />
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="heading-tight font-black" style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "#111111",
              lineHeight: 1.0,
            }}>
              Violation to alert.<br />
              <span style={{ fontWeight: 400, fontSize: "0.65em", color: "#666666" }}>
                In under 200 milliseconds.
              </span>
            </h2>
            <p className="text-sm max-w-xs md:text-right" style={{ color: "#666666" }}>
              Three discrete steps. No human intervention required.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col md:flex-row md:items-center gap-6 py-8"
              style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
            >
              <div className="md:w-[30%] flex-shrink-0">
                <span className="stat-num heading-tight font-black"
                  style={{ fontSize: "clamp(4rem, 8vw, 6.5rem)", color: "rgba(249,115,22,0.15)", lineHeight: 1 }}>
                  {step.number}
                </span>
              </div>
              <div className="md:w-[70%]">
                <h3 className="text-lg font-bold mb-2 heading-tight" style={{ color: "#111111" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
          <div className="h-px" style={{ background: "rgba(0,0,0,0.07)" }} />
        </div>
      </div>
    </section>
  );
}
