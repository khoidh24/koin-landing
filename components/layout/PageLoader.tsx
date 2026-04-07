"use client";

import { useRef, useEffect, memo } from "react";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/appStore";

const BG = "#0a0a0a";

const PATHS = [
  // K — stem + two arms, width ~58, arms meet at optical midpoint (46%)
  { d: "M10 8 L10 82", len: 74 },
  { d: "M10 42 L58 8", len: 57 },
  { d: "M10 42 L58 82", len: 57 },
  // O — r=37 so top=8, bottom=82, matching cap height of K/I/N exactly
  {
    d: "M111 8 A37 37 0 0 1 148 45 A37 37 0 0 1 111 82 A37 37 0 0 1 74 45 A37 37 0 0 1 111 8 Z",
    len: 232,
  },
  // I — single stroke, width 0
  { d: "M168 8 L168 82", len: 74 },
  // N — width 64 to match K/O proportions, stems at 196 & 260
  { d: "M196 8 L196 82", len: 74 },
  { d: "M196 8 L260 82", len: 92 },
  { d: "M260 8 L260 82", len: 74 },
];

/** Memoized — never re-renders after mount */
const PageLoader = memo(function PageLoader() {
  const setLoaderDone = useAppStore((s) => s.setLoaderDone);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  // Stable ref to avoid stale closure in GSAP callbacks
  const onDoneRef = useRef(setLoaderDone);

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    const progress = { val: 0 };
    const paths = Array.from(
      root.querySelectorAll<SVGPathElement>(".koin-svg-path"),
    );

    paths.forEach((el, i) => {
      const len = PATHS[i]?.len ?? 300;
      el.setAttribute("stroke-dasharray", String(len));
      el.setAttribute("stroke-dashoffset", String(len));
      // Hide completely until drawn — prevents round-cap dots showing at endpoints
      el.setAttribute("opacity", "0");
    });

    const tl = gsap.timeline();

    // Draw strokes sequentially
    paths.forEach((el, i) => {
      tl.to(
        el,
        {
          attr: { "stroke-dashoffset": 0, opacity: 1 },
          duration: 0.28,
          ease: "power2.inOut",
        },
        i === 0 ? 0 : ">-0.06",
      );
    });

    // Progress bar — parallel from t=0
    tl.to(
      progress,
      {
        val: 100,
        duration: 2.0,
        ease: "power2.inOut",
        onUpdate() {
          const v = Math.round(progress.val);
          if (fillRef.current) fillRef.current.style.width = `${v}%`;
          if (countRef.current)
            countRef.current.textContent = String(v).padStart(3, "0");
        },
      },
      0,
    );

    tl.to({}, { duration: 0.25 });

    // Fade content
    tl.to(content, { opacity: 0, duration: 0.15, ease: "power2.in" });

    // Slide root up — fire store update + custom event on start
    tl.to(root, {
      yPercent: -100,
      duration: 0.75,
      ease: "expo.inOut",
      onStart() {
        onDoneRef.current();
        window.dispatchEvent(new Event("koin:loader-done"));
      },
    });

    tl.set(root, { display: "none" });

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once on mount

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        overflow: "hidden",
        background: BG,
      }}
    >
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "0 6vw 2.5rem",
        }}
      >
        {/* Top */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1.75rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            Koin
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 300,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            NFT Marketplace
          </span>
        </div>

        {/* Center — KOIN SVG draw-on */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <svg
            viewBox="6 4 260 84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: "clamp(180px, 36vw, 340px)",
              height: "auto",
              display: "block",
            }}
          >
            {PATHS.map((p, i) => (
              <path
                key={i}
                className="koin-svg-path"
                d={p.d}
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
          </svg>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 300,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Digital Art Marketplace
          </span>
        </div>

        {/* Bottom — progress */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 300,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              Loading
            </span>
            <span
              ref={countRef}
              style={{
                fontSize: "0.6rem",
                fontWeight: 400,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.3)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              000
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              position: "relative",
            }}
          >
            <div
              ref={fillRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "0%",
                background: "#fff",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -1,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 0 8px 3px rgba(255,255,255,0.6)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PageLoader;
