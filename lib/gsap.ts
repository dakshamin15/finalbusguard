"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { bezier } from "./motion";

let registered = false;

export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const c = (b: readonly number[]) => `M0,0 C${b[0]},${b[1]} ${b[2]},${b[3]} 1,1`;
    CustomEase.create("bg.out", c(bezier.out));
    CustomEase.create("bg.inOut", c(bezier.inOut));
    CustomEase.create("bg.snap", c(bezier.snap));
    gsap.defaults({ ease: "bg.out" });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}
