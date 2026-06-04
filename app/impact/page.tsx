"use client";

import { motion } from "framer-motion";
import StatsBento from "@/components/StatsBento";
import SocialProof from "@/components/SocialProof";

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
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-[800px] mx-auto"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#999999" }}>
            Impact
          </p>
          <h1 className="text-5xl md:text-6xl font-black heading-tight mb-6" style={{ color: "#111111" }}>
            Measurable Results,{" "}
            <span style={{ color: "#f97316" }}>Real Safety</span>
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: "#666666" }}>
            From 211 controlled trials to active district discussions, here is the
            data behind BusGuard&apos;s safety impact.
          </p>
        </motion.div>
      </section>

      <StatsBento />

      {/* Timeline */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-black heading-tight mb-12 text-center"
            style={{ color: "#111111" }}
          >
            Our Journey
          </motion.h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: "rgba(0,0,0,0.08)" }} />
            <div className="flex flex-col gap-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year + item.event}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="pl-16 relative"
                >
                  <div
                    className="absolute left-0 top-1 w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(249,115,22,0.4)",
                      color: "#f97316",
                    }}
                  >
                    {item.year}
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: "#111111" }}>{item.event}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{item.detail}</p>
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
