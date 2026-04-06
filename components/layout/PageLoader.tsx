"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = { val: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });

      // Draw SVG paths
      tl.fromTo(
        ".loader-path",
        { strokeDashoffset: 600 },
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
          stagger: 0.08,
        },
      );

      // Counter tick (runs in parallel from t=0)
      tl.to(
        progress,
        {
          val: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate() {
            const el = loaderRef.current?.querySelector(".loader-counter");
            if (el)
              el.textContent = String(Math.round(progress.val)).padStart(
                3,
                "0",
              );
          },
        },
        0,
      );

      // Hold
      tl.to({}, { duration: 0.35 });

      // Split wipe out
      tl.to(".loader-panel-top", {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
      });
      tl.to(
        ".loader-panel-bottom",
        { yPercent: 100, duration: 0.9, ease: "expo.inOut" },
        "<",
      );
      tl.to(".loader-center", { opacity: 0, duration: 0.3 }, "<");
    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-100 pointer-events-none">
      <div className="loader-panel-top absolute inset-x-0 top-0 h-1/2 bg-[#080808]" />
      <div className="loader-panel-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#080808]" />

      <div className="loader-center absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* SVG K logo — line draw */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-6"
        >
          <path
            className="loader-path"
            d="M10 6 L10 50"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset="600"
          />
          <path
            className="loader-path"
            d="M10 28 L40 6"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset="600"
          />
          <path
            className="loader-path"
            d="M10 28 L40 50"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset="600"
          />
          <circle
            className="loader-path"
            cx="47"
            cy="28"
            r="3.5"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="600"
            strokeDashoffset="600"
          />
        </svg>

        <div className="flex items-baseline gap-1">
          <span className="loader-counter font-mono text-white/70 text-sm tracking-widest tabular-nums">
            000
          </span>
          <span className="text-white/25 text-xs">%</span>
        </div>
      </div>
    </div>
  );
}
