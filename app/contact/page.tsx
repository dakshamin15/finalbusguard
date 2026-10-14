import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageHero from "@/components/sections/PageHero";
import ContactForm from "@/components/sections/ContactForm";
import { contact, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Sales",
  description: "Contact sales, ask about pricing, or discuss a district deployment. We respond within one business day.",
  alternates: { canonical: "/contact" },
};

const details = [
  { k: "Email", v: site.email, href: `mailto:${site.email}` },
  { k: "Location", v: site.location },
  { k: "Response time", v: contact.response },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow={contact.eyebrow} title={contact.title} sub={contact.sub} accent={["safety"]} />
      <section aria-label="Contact details and form" className="relative pb-[clamp(96px,12vw,180px)]">
        <div className="frame grid-12 gap-y-12">
          <dl className="col-span-4 md:col-span-8 lg:col-span-4">
            {details.map((d, i) => (
              <div key={d.k} className="fade-load border-t border-line py-6" style={{ "--d": `${650 + i * 90}ms` } as CSSProperties}>
                <dt className="mono text-[11px] uppercase tracking-[0.14em] text-fg-3">{d.k}</dt>
                <dd className="font-display mt-2 text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-semibold tracking-[-0.02em] text-fg">
                  {d.href ? (
                    <a href={d.href} className="link-u always">
                      {d.v}
                    </a>
                  ) : (
                    d.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="fade-load col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6" style={{ "--d": "700ms" } as CSSProperties}>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
