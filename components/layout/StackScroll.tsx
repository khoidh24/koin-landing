"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { onLenisScroll } from "@/hooks/useLenis";
import { useAppStore } from "@/store/appStore";

export default function StackScroll() {
  const loaderDone = useAppStore((s) => s.loaderDone);

  useEffect(() => {
    if (!loaderDone) return;

    const nft = document.querySelector<HTMLElement>(".nft-section");
    if (!nft) return;

    // Start NFT below viewport
    gsap.set(nft, { y: window.innerHeight });

    const update = (scroll: number) => {
      const vh = window.innerHeight;

      if (scroll <= 0) {
        // Top of page — NFT fully below
        gsap.set(nft, { y: vh });
        return;
      }

      if (scroll >= vh) {
        // Past Hero zone — NFT fully in place, normal flow takes over
        gsap.set(nft, { y: 0 });
        return;
      }

      // Slide up: scroll 0→vh maps to y vh→0
      gsap.set(nft, { y: vh - scroll });
    };

    const unsub = onLenisScroll(update);

    const onResize = () => {
      gsap.set(nft, { y: window.innerHeight });
      update(window.scrollY);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
      gsap.set(nft, { clearProps: "transform" });
    };
  }, [loaderDone]);

  return null;
}
