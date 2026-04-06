"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

/**
 * Page-out curtain: call triggerOut() before navigating away.
 * Exposed via ref so parent/router can trigger it.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const curtainRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Page-in: curtain slides up on mount
      gsap.set(curtainRef.current, { yPercent: 0 });
      gsap.to(curtainRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
        delay: 0.05,
      });
    },
    { scope: curtainRef },
  );

  return (
    <>
      {/* Curtain overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-90 bg-[#080808] pointer-events-none"
      />
      {children}
    </>
  );
}
