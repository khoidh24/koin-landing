"use client";

import { useRef, useEffect, memo } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { onLenisScroll, getLenis } from "@/hooks/useLenis";
import { useAppStore } from "@/store/appStore";

const STATS = [
  { value: "142K+", label: "Artworks" },
  { value: "38K+", label: "Artists" },
  { value: "$2.4B", label: "Volume" },
] as const;

/** Memoized — only re-renders when loaderDone flips from false → true (once) */
const Hero = memo(function Hero() {
  const loaderDone = useAppStore((s) => s.loaderDone);
  const sectionRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);

  // Hide section on mount
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0 });
  }, []);

  // Animate in once loaderDone becomes true
  useEffect(() => {
    if (!loaderDone || animatedRef.current) return;
    animatedRef.current = true;

    const section = sectionRef.current;
    if (!section) return;

    // Video parallax removed — Hero is position:fixed, no parallax needed

    const ctx = gsap.context(() => {
      gsap.set(section, { autoAlpha: 1 });

      const solidEls = section.querySelectorAll<HTMLElement>(
        ".koin-hero-line-solid",
      );
      const shimmerWrap = section.querySelector<HTMLElement>(
        ".koin-hero-line-shimmer-wrap",
      );
      const descEl = section.querySelector<HTMLElement>(".koin-hero-desc");
      const lineH = section.querySelectorAll<HTMLElement>(".koin-line-h");
      const lineV = section.querySelectorAll<HTMLElement>(".koin-line-v");

      const solidSplits = Array.from(solidEls).map(
        (el) => new SplitText(el, { type: "chars" }),
      );
      const solidChars = solidSplits.flatMap((sp) => sp.chars);
      const descSplit = descEl
        ? new SplitText(descEl, { type: "lines" })
        : null;

      gsap.set(solidChars, { yPercent: 115, opacity: 0 });
      gsap.set(shimmerWrap, { yPercent: 108, opacity: 0 });
      if (descSplit) gsap.set(descSplit.lines, { x: -28, opacity: 0 });
      gsap.set(section.querySelector(".koin-hero-cta"), {
        scale: 0.9,
        opacity: 0,
      });
      gsap.set(section.querySelectorAll(".koin-hero-stat"), {
        x: 20,
        opacity: 0,
      });
      gsap.set(section.querySelector(".koin-hero-scroll"), { opacity: 0 });
      gsap.set(lineH, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(lineV, { scaleY: 0, transformOrigin: "top center" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(lineH, {
        scaleX: 1,
        duration: 0.7,
        ease: "expo.inOut",
        stagger: 0.05,
      });
      tl.to(
        lineV,
        { scaleY: 1, duration: 0.7, ease: "expo.inOut", stagger: 0.05 },
        "<",
      );

      tl.to(
        solidChars,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: { amount: 0.3, from: "start" },
          ease: "power3.out",
        },
        "-=0.3",
      );

      tl.to(
        shimmerWrap,
        { yPercent: 0, opacity: 1, duration: 0.65, ease: "power3.out" },
        "-=0.45",
      );

      if (descSplit) {
        tl.to(
          descSplit.lines,
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: "power3.out",
          },
          "-=0.35",
        );
      }

      tl.to(
        section.querySelector(".koin-hero-cta"),
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
        "-=0.3",
      );
      tl.to(
        section.querySelectorAll(".koin-hero-stat"),
        { x: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power3.out" },
        "-=0.3",
      );
      tl.to(
        section.querySelector(".koin-hero-scroll"),
        { opacity: 1, duration: 0.35 },
        "-=0.2",
      );

      // Scroll dot — travels top→bottom, resets instantly, loops
      const dot = section.querySelector<HTMLElement>(".koin-hero-scroll-dot");
      if (dot) {
        gsap.fromTo(
          dot,
          { y: -14 },
          {
            y: 52,
            duration: 1.2,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 0.1,
            delay: 1.0,
          },
        );
      }

      // Video parallax — driven by Lenis (handled outside ctx above)
    }, section);

    return () => {
      ctx.revert();
    };
  }, [loaderDone]);

  return (
    <section ref={sectionRef} className="koin-hero">
      <video
        className="koin-hero-video"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="koin-hero-overlay" />

      <div className="koin-line-h koin-line-bottom" />
      <div className="koin-line-v koin-line-left" />
      <div className="koin-line-v koin-line-right" />

      <div className="koin-hero-inner">
        <div className="koin-hero-heading-wrap">
          <h1 className="koin-hero-heading">
            <span className="koin-hero-line">
              <span className="koin-hero-line-solid">Collect</span>
            </span>
            <span className="koin-hero-line">
              <span className="koin-hero-line-shimmer-wrap">
                <span className="koin-hero-line-shimmer">Rare Digital</span>
              </span>
            </span>
            <span className="koin-hero-line">
              <span className="koin-hero-line-solid">Art.</span>
            </span>
          </h1>
        </div>

        <div className="koin-hero-bottom">
          <div className="koin-hero-left">
            <p className="koin-hero-desc">
              The premier marketplace for extraordinary digital art. Discover,
              bid, and own the future of digital ownership — where creators and
              collectors meet.
            </p>
            <button
              className="koin-hero-cta"
              onClick={() => {
                const y = window.innerHeight;
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(y);
                else window.scrollTo({ top: y, behavior: "smooth" });
              }}
            >
              <span className="koin-hero-cta-inner">
                Explore Collection
                <span className="koin-hero-cta-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6h8M7 2.5L10.5 6 7 9.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </button>
          </div>

          <div className="koin-hero-right">
            <div className="koin-hero-stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="koin-hero-stat">
                  <span className="koin-hero-stat-val">{stat.value}</span>
                  <span className="koin-hero-stat-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="koin-hero-scroll">
              <span className="koin-hero-scroll-lbl">Scroll</span>
              <div className="koin-hero-scroll-track">
                <div className="koin-hero-scroll-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
