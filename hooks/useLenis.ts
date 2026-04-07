"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Global Lenis instance so other hooks can subscribe
let globalLenis: Lenis | null = null;
const scrollListeners = new Set<(scroll: number) => void>();

export function getLenis() {
  return globalLenis;
}

export function onLenisScroll(fn: (scroll: number) => void) {
  scrollListeners.add(fn);
  return () => scrollListeners.delete(fn);
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true });
    lenisRef.current = lenis;
    globalLenis = lenis;

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      ScrollTrigger.update();
      scrollListeners.forEach((fn) => fn(scroll));
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      globalLenis = null;
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
