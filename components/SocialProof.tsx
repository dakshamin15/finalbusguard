"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative z-10 w-full py-24" style={{ background: "#111111" }}>
      <div className="max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="rounded-[6px] px-6 sm:px-10 md:px-16 py-10 md:py-14"
          style={{
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "2px solid #f97316",
          }}
        >
          <svg className="mb-8 opacity-20" width="36" height="28" viewBox="0 0 36 28" fill="none">
            <path d="M0 28V18C0 7.955 5.856 2.473 17.569 0L18.9 3.417C13.938 4.651 11.008 7.393 10.108 11.641H16.2V28H0ZM19.8 28V18C19.8 7.955 25.656 2.473 37.369 0L38.7 3.417C33.738 4.651 30.808 7.393 29.908 11.641H36V28H19.8Z"
              fill="#ffffff" />
          </svg>

          <blockquote className="text-lg md:text-2xl font-light leading-relaxed mb-10"
            style={{ color: "#ffffff", fontStyle: "italic" }}>
            "What stands out about BusGuard is its prevention-first approach, alerting students in real time when a vehicle-violated stop arm can save a child's life, and the ability to track and map violations gives our district critical insight to make smarter, safer decisions about where to focus our efforts."
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-px h-8" style={{ background: "#f97316" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>
                Jim Ellis
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#aaaaaa" }}>
                Director of Pupil Transportation, Henrico County Public Schools
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
