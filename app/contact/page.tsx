"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    message: "",
    type: "demo",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors";
  const inputStyle = {
    background: "#f2f2ef",
    border: "1px solid rgba(0,0,0,0.12)",
    color: "#111111",
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-[600px] mx-auto"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#999999" }}>
            Contact
          </p>
          <h1 className="text-5xl md:text-6xl font-black heading-tight mb-6" style={{ color: "#111111" }}>
            Get in Touch
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: "#666666" }}>
            Request a demo, ask about pricing, or discuss a district deployment.
            We respond within one business day.
          </p>
        </motion.div>
      </section>

      {/* Form + Info */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Left — Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 flex flex-col gap-8"
          >
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#111111" }}>Contact Details</h3>
              <div className="flex flex-col gap-4 text-sm" style={{ color: "#666666" }}>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "#111111" }}>Email</p>
                  <a href="mailto:busguardhelp@gmail.com"
                    className="transition-colors duration-200"
                    style={{ color: "#f97316" }}>
                    busguardhelp@gmail.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "#111111" }}>Location</p>
                  <p>Henrico County, Virginia</p>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "#111111" }}>Response Time</p>
                  <p>Within 1 business day</p>
                </div>
              </div>
            </div>

            <div className="rounded-[8px] p-6" style={{ background: "#f2f2ef", border: "1px solid rgba(0,0,0,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#999999" }}>
                Status
              </p>
              <p className="font-semibold" style={{ color: "#111111" }}>In Active Discussions</p>
              <p className="text-sm mt-1" style={{ color: "#666666" }}>Virginia school districts</p>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                <p className="text-xs" style={{ color: "#999999" }}>
                  211 trials · 95.3% accuracy · Seeking district partners
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3"
          >
            {submitted ? (
              <div className="rounded-[8px] p-10 text-center"
                style={{ background: "#f2f2ef", border: "1px solid #f97316" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(249,115,22,0.12)" }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l6 6 12-12" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#111111" }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: "#666666" }}>
                  Thanks for reaching out. We&apos;ll get back to you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-[8px] p-8 flex flex-col gap-5"
                style={{ background: "#f2f2ef", border: "1px solid rgba(0,0,0,0.08)" }}>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#111111" }}>Send a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: "#999999" }}>Full Name *</label>
                    <input required type="text" name="name" value={form.name}
                      onChange={handleChange} placeholder="Jane Smith"
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: "#999999" }}>Email *</label>
                    <input required type="email" name="email" value={form.email}
                      onChange={handleChange} placeholder="jane@district.edu"
                      className={inputClass} style={inputStyle} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: "#999999" }}>Organization</label>
                    <input type="text" name="organization" value={form.organization}
                      onChange={handleChange} placeholder="County School District"
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: "#999999" }}>I am a...</label>
                    <select name="role" value={form.role} onChange={handleChange}
                      className={inputClass} style={{ ...inputStyle, appearance: "none" as const }}>
                      <option value="">Select role</option>
                      <option value="director">Transportation Director</option>
                      <option value="superintendent">Superintendent</option>
                      <option value="safety">Safety Officer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: "#999999" }}>Inquiry Type</label>
                  <div className="flex gap-3 flex-wrap">
                    {["demo", "pricing", "technical", "partnership"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                        className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200"
                        style={
                          form.type === t
                            ? { background: "#f97316", color: "#fff" }
                            : { background: "#ffffff", border: "1px solid rgba(0,0,0,0.15)", color: "#666666" }
                        }
                      >
                        {t === "demo" ? "Request Demo" : t === "pricing" ? "Pricing" : t === "technical" ? "Technical" : "Partnership"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: "#999999" }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us about your district, fleet size, or specific questions..."
                    rows={4} className={inputClass + " resize-none"} style={inputStyle} />
                </div>

                <button type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:opacity-90"
                  style={{ background: "#f97316" }}>
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
