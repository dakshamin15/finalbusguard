import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import Testimonial from "@/components/sections/Testimonial";
import Explore from "@/components/sections/Explore";
import ClosingCta from "@/components/sections/ClosingCta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The landing page holds only what lives nowhere else: the 3D hero, the testimonial,
// and an index into the rest of the site. Detail lives on the inner pages.
export default function Home() {
  return (
    <>
      <Hero />
      <Testimonial />
      <Explore />
      <ClosingCta />
    </>
  );
}
