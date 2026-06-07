"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function ContactPage() {
  const formRef = useRef(null);
  const formIn  = useInView(formRef, { once: true, margin: "-80px" });

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", organization: "", role: "", message: "", type: "sales",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`BusGuard Inquiry , ${form.type} , ${form.organization || form.name}`);
    const body    = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization}\nRole: ${form.role}\nType: ${form.type}\n\n${form.message}`
    );
    window.location.href = `mailto:info@busguard.net?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputStyle = {
    background: "#f8f8f5",
    border: "1px solid rgba(0,0,0,0.12)",
    color: "#111111",
  };

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative pt-44 pb-20 px-6 overflow-hidden"
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
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>Contact</span>
            <div className="flex-1 h-px" style={{ background: "rgba(249,115,22,0.25)" }} />
          </div>
          <h1
            className="font-black heading-tight mb-5"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#111111", lineHeight: 1.0 }}
          >
            Let&apos;s Talk<br />
            <span style={{ color: "#f97316" }}>Safety.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-lg" style={{ color: "#555555" }}>
            Contact sales, ask about pricing, or discuss a district deployment.
            We respond within one business day.
          </p>
        </motion.div>
      </section>

      {/* ── FORM + INFO ───────────────────────────────────────────── */}
      <section
        ref={formRef}
        className="relative py-20 px-6"
        style={{ background: "#ffffff" }}
      >
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Left , contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={formIn ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 flex flex-col gap-8"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-5" style={{ color: "#f97316" }}>
                Contact Details
              </p>
              <div className="flex flex-col gap-5">
                {[
                  { label: "Email",         value: "info@busguard.net", href: "mailto:info@busguard.net" },
                  { label: "Location",      value: "Henrico County, Virginia" },
                  { label: "Response Time", value: "Within 1 business day" },
                ].map(({ label, value, href }) => (
                  <div key={label}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: "#aaa" }}>{label}</p>
                    {href
                      ? <a href={href} className="text-sm font-semibold" style={{ color: "#f97316" }}>{value}</a>
                      : <p className="text-sm font-semibold" style={{ color: "#111" }}>{value}</p>
                    }
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Right , form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={formIn ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3"
          >
            {submitted ? (
              <div className="rounded-[10px] p-12 text-center"
                style={{ background: "#f8f8f5", border: "1px solid rgba(249,115,22,0.3)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.25)" }}>
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l6 6 12-12" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#111" }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: "#666" }}>
                  Thanks for reaching out. We&apos;ll get back to you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}
                className="rounded-[10px] p-8 flex flex-col gap-5"
                style={{ background: "#f8f8f5", border: "1px solid rgba(0,0,0,0.08)" }}
              >
                <h3 className="text-base font-bold mb-1" style={{ color: "#111" }}>Send a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block font-medium" style={{ color: "#666" }}>Full Name *</label>
                    <input required type="text" name="name" value={form.name}
                      onChange={handleChange} placeholder="Jane Smith"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                      style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block font-medium" style={{ color: "#666" }}>Email *</label>
                    <input required type="email" name="email" value={form.email}
                      onChange={handleChange} placeholder="jane@district.edu"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                      style={inputStyle} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block font-medium" style={{ color: "#666" }}>Organization</label>
                    <input type="text" name="organization" value={form.organization}
                      onChange={handleChange} placeholder="County School District"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                      style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block font-medium" style={{ color: "#666" }}>I am a...</label>
                    <select name="role" value={form.role} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                      style={{ ...inputStyle, appearance: "none" as const }}>
                      <option value="">Select role</option>
                      <option value="director">Transportation Director</option>
                      <option value="superintendent">Superintendent</option>
                      <option value="safety">Safety Officer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs mb-1.5 block font-medium" style={{ color: "#666" }}>Inquiry Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {["sales", "pricing", "technical", "partnership"].map(t => (
                      <button key={t} type="button"
                        onClick={() => setForm(prev => ({ ...prev, type: t }))}
                        className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                        style={form.type === t
                          ? { background: "#f97316", color: "#fff" }
                          : { background: "#fff", border: "1px solid rgba(0,0,0,0.15)", color: "#666" }
                        }
                      >
                        {t === "sales" ? "Contact Sales" : t === "pricing" ? "Pricing" : t === "technical" ? "Technical" : "Partnership"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs mb-1.5 block font-medium" style={{ color: "#666" }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us about your district, fleet size, or specific questions..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors resize-none"
                    style={inputStyle} />
                </div>

                <button type="submit"
                  className="w-full py-3 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:opacity-90"
                  style={{ background: "#f97316" }}>
                  Send Message →
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
