"use client";

import { motion } from "framer-motion";
import TechnologySection from "@/components/TechnologySection";
import HowItWorks from "@/components/HowItWorks";

export default function TechnologyPage() {
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
            Technology
          </p>
          <h1 className="text-5xl md:text-6xl font-black heading-tight mb-6" style={{ color: "#111111" }}>
            Engineering Student Safety
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: "#666666" }}>
            A deep look at the computer vision, hardware, and software systems
            that power BusGuard&apos;s real-time detection capabilities.
          </p>
        </motion.div>
      </section>

      {/* Spec Table */}
      <section className="relative z-10 py-16 px-6" style={{ background: "#f2f2ef" }}>
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[8px] overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            {[
              { spec: "Detection Model", value: "Custom CNN, trained on proprietary dataset" },
              { spec: "True Positive Rate", value: "95.3% (211 trials)" },
              { spec: "False Positive Rate", value: "< 2%" },
              { spec: "Alert Latency", value: "< 200ms" },
              { spec: "Operating Temperature", value: "-20°C to 60°C" },
              { spec: "Enclosure Rating", value: "IP67 weatherproof" },
              { spec: "Power", value: "12V bus electrical" },
              { spec: "Storage", value: "256GB onboard (expandable)" },
              { spec: "Connectivity", value: "4G LTE + WiFi sync" },
              { spec: "Camera", value: "1080p wide-angle, WDR" },
            ].map((row, i) => (
              <div
                key={row.spec}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-2"
                style={{
                  background: i % 2 === 0 ? "#ffffff" : "#f8f8f5",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <span className="text-sm font-medium" style={{ color: "#666666" }}>{row.spec}</span>
                <span className="text-sm font-mono font-semibold" style={{ color: "#111111" }}>{row.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <HowItWorks />
      <TechnologySection />
    </>
  );
}
