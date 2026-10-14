"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Arrow } from "@/components/system/Icons";
import { contact, site } from "@/lib/content";
import { bezier } from "@/lib/motion";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl bg-[rgba(var(--fg-rgb),0.035)] px-4 py-3.5 text-[15px] text-fg placeholder:text-fg-3 shadow-[inset_0_0_0_1px_var(--line-2)] outline-none transition-shadow duration-200 hover:shadow-[inset_0_0_0_1px_rgba(var(--fg-rgb),0.28)] focus-visible:shadow-[inset_0_0_0_1.5px_var(--accent)] focus-visible:outline-none";
const label = "mb-2 block text-[13px] text-fg-2";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", organization: "", role: "", message: "", type: "sales" });
  const errRef = useRef<HTMLParagraphElement>(null);

  const change = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("botcheck")) return;
    setStatus("sending");
    setError("");
    const typeLabel = contact.types.find((t) => t.value === form.type)?.label ?? form.type;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: site.web3formsKey,
          subject: `BusGuard Inquiry, ${typeLabel}, ${form.organization || form.name}`,
          from_name: form.name,
          ...form,
          type: typeLabel,
        }),
      });
      const json = await res.json();
      if (json.success) setStatus("sent");
      else throw new Error(json.message || "Submission failed");
    } catch {
      setStatus("error");
      setError(`Something went wrong sending your message. Please try again, or email us at ${site.email}.`);
      requestAnimationFrame(() => errRef.current?.focus());
    }
  };

  return (
    <div className="card relative overflow-hidden p-6 md:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: bezier.out }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
            role="status"
          >
            <div className="relative grid h-24 w-24 place-items-center">
              <span className="brackets" style={{ inset: 0 }}>
                <i />
                <i />
                <i />
                <i />
              </span>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <path d="M8 18.5l6.5 6.5L28 11.5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="t-m mt-8 text-fg">Message sent!</h2>
            <p className="mt-3 max-w-sm text-fg-2">Thanks for reaching out. We&apos;ll get back to you within one business day.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} aria-describedby={error ? "form-error" : undefined}>
            <h2 className="t-title text-fg">Send a message</h2>
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={label}>
                  Full name <span aria-hidden="true" className="text-accent-ink">*</span>
                </label>
                <input id="name" name="name" required autoComplete="name" value={form.name} onChange={change} placeholder="Jane Smith" className={field} />
              </div>
              <div>
                <label htmlFor="email" className={label}>
                  Email <span aria-hidden="true" className="text-accent-ink">*</span>
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={change} placeholder="jane@district.edu" className={field} />
              </div>
              <div>
                <label htmlFor="organization" className={label}>
                  Organization
                </label>
                <input id="organization" name="organization" autoComplete="organization" value={form.organization} onChange={change} placeholder="County School District" className={field} />
              </div>
              <div>
                <label htmlFor="role" className={label}>
                  I am a&hellip;
                </label>
                <div className="relative">
                  <select id="role" name="role" value={form.role} onChange={change} className={`${field} appearance-none pr-10`}>
                    <option value="">Select role</option>
                    {contact.roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-fg-2" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className={label}>Inquiry type</legend>
              <div className="flex flex-wrap gap-2">
                {contact.types.map((t) => (
                  <label key={t.value} className="relative cursor-pointer">
                    <input type="radio" name="type" value={t.value} checked={form.type === t.value} onChange={change} className="peer sr-only" />
                    <span className="inline-flex h-10 items-center rounded-full px-4 text-[14px] text-fg-2 shadow-[inset_0_0_0_1px_var(--line-2)] transition-all duration-200 hover:text-fg peer-checked:bg-accent peer-checked:text-ink peer-checked:shadow-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="message" className={label}>
                Message
              </label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={change} placeholder="Tell us about your district, fleet size, or specific questions..." className={`${field} resize-none`} />
            </div>

            {error && (
              <p id="form-error" ref={errRef} tabIndex={-1} role="alert" className="mt-5 rounded-xl px-4 py-3 text-[14px] text-fg shadow-[inset_0_0_0_1px_var(--accent)] outline-none">
                {error}
              </p>
            )}

            <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-8 w-full justify-between disabled:opacity-70 sm:w-auto">
              {status === "sending" ? "Sending…" : "Send message"}
              <span className="btn-arrow">
                <Arrow />
              </span>
            </button>
            <p className="mt-4 text-[13px] text-fg-3">
              <span aria-hidden="true" className="text-accent-ink">*</span> Required
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
