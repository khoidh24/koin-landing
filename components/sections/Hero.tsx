"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import PageLoader from "@/components/layout/PageLoader";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [loaderDone, setLoaderDone] = useState(false);

  useGSAP(
    () => {
      if (!loaderDone) return;

      const heading = document.querySelector<HTMLElement>(".hero-heading");
      const sub = document.querySelector<HTMLElement>(".hero-sub");
      if (!heading || !sub) return;

      const headingSplit = new SplitText(heading, {
        type: "chars,words",
      });

      const subSplit = new SplitText(sub, {
        type: "lines",
      });

      // Wrap each word in a clip div so chars slide up from inside
      headingSplit.words.forEach((word) => {
        const wrapper = document.createElement("span");
        wrapper.style.cssText =
          "display:inline-block;overflow:hidden;vertical-align:bottom;";
        word.parentNode?.insertBefore(wrapper, word);
        wrapper.appendChild(word);
      });

      gsap.set(headingSplit.chars, { yPercent: 120 });
      gsap.set(subSplit.lines, { yPercent: 105, opacity: 0 });
      gsap.set(".hero-eyebrow", { opacity: 0, x: -20 });
      gsap.set(".hero-cta-primary", { opacity: 0, y: 28 });
      gsap.set(".hero-cta-secondary", { opacity: 0, y: 28 });
      gsap.set(".hero-stat", { opacity: 0, y: 40 });
      gsap.set(".hero-scroll-line", { scaleY: 0, transformOrigin: "top" });
      gsap.set(".hero-scroll-label", { opacity: 0 });
      gsap.set(".hero-nft-card", { opacity: 0, y: 60, rotation: 0 });
      gsap.set(".hero-marquee-wrap", { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Eyebrow
      tl.to(".hero-eyebrow", { opacity: 1, x: 0, duration: 0.7 });

      // Heading chars stagger
      tl.to(
        headingSplit.chars,
        {
          yPercent: 0,
          duration: 1.1,
          stagger: { amount: 0.55, from: "start" },
          ease: "power3.out",
        },
        "-=0.4",
      );

      // Sub lines
      tl.to(
        subSplit.lines,
        { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.1 },
        "-=0.7",
      );

      // CTAs
      tl.to(".hero-cta-primary", { opacity: 1, y: 0, duration: 0.65 }, "-=0.5");
      tl.to(
        ".hero-cta-secondary",
        { opacity: 1, y: 0, duration: 0.65 },
        "-=0.5",
      );

      // Stats
      tl.to(
        ".hero-stat",
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
        "-=0.4",
      );

      // NFT cards cascade
      tl.to(
        ".hero-nft-card",
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.8",
      );

      // Scroll indicator
      tl.to(".hero-scroll-label", { opacity: 1, duration: 0.5 }, "-=0.3");
      tl.to(
        ".hero-scroll-line",
        { scaleY: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4",
      );

      // Marquee
      tl.to(".hero-marquee-wrap", { opacity: 1, duration: 0.6 }, "-=0.4");

      // Looping scroll line pulse
      gsap.to(".hero-scroll-dot", {
        yPercent: 200,
        repeat: -1,
        duration: 1.4,
        ease: "power1.inOut",
        delay: 3,
        repeatDelay: 0.4,
      });

      // Parallax video on scroll
      gsap.to(".hero-video-wrap", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // NFT cards subtle float on scroll
      gsap.to(".hero-cards-col", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      });

      // Marquee infinite scroll
      gsap.to(".hero-marquee-inner", {
        xPercent: -50,
        repeat: -1,
        duration: 22,
        ease: "none",
      });
    },
    { scope: containerRef, dependencies: [loaderDone] },
  );

  return (
    <>
      {!loaderDone && <PageLoader onComplete={() => setLoaderDone(true)} />}

      <section
        ref={containerRef}
        className="relative w-full min-h-screen overflow-hidden bg-[#080808]"
      >
        {/* ── Background video ── */}
        <div className="hero-video-wrap absolute inset-0 w-full h-[115%] -top-[7%]">
          <video
            className="w-full h-full object-cover opacity-40"
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080808_100%)]" />
          <div className="absolute inset-0 bg-linear-to-b from-[#080808]/70 via-transparent to-[#080808]" />
        </div>

        {/* ── Noise texture overlay ── */}
        <div
          className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* ── Main grid ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] min-h-screen px-6 md:px-12 lg:px-20 pt-32 pb-20 gap-12">
          {/* Left column */}
          <div className="flex flex-col justify-center max-w-3xl">
            {/* Eyebrow */}
            <div className="hero-eyebrow flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                <span className="text-white/50 text-[11px] tracking-[0.35em] uppercase font-light">
                  NFT Marketplace — 2025
                </span>
              </span>
              <span className="flex-1 max-w-[60px] h-px bg-white/10" />
            </div>

            {/* Heading */}
            <h1
              className="hero-heading font-bold leading-[0.92] tracking-[-0.03em] text-white mb-8"
              style={{ fontSize: "clamp(3.8rem, 9vw, 8.5rem)" }}
            >
              Own the
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.35)" }}
              >
                Digital
              </span>
              <br />
              Future<span className="text-white/30">.</span>
            </h1>

            {/* Sub */}
            <div className="overflow-hidden mb-10">
              <p className="hero-sub text-white/45 text-base md:text-lg font-light leading-[1.75] max-w-md">
                Discover, collect, and trade extraordinary digital art. The most
                immersive NFT platform built for creators and collectors.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4 mb-20">
              <button className="hero-cta-primary group relative px-7 py-3.5 bg-white text-black text-sm font-medium tracking-wide overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Collection
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-black translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                <span className="absolute inset-0 bg-black translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] delay-75 opacity-50" />
                <span className="absolute z-10 inset-0 flex items-center justify-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  Explore Collection
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <button className="hero-cta-secondary flex items-center gap-3 text-white/50 text-sm font-light tracking-wide hover:text-white transition-colors duration-300 group">
                <span className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center group-hover:border-white/40 transition-colors duration-300">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 2l7 4-7 4V2z" fill="currentColor" />
                  </svg>
                </span>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-10 md:gap-16">
              {[
                { value: "142K+", label: "Artworks" },
                { value: "38K+", label: "Artists" },
                { value: "$2.4B", label: "Volume" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="hero-stat flex flex-col gap-1.5"
                >
                  <span className="text-white text-2xl md:text-3xl font-semibold tracking-tight tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-white/30 text-[10px] tracking-[0.25em] uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — NFT cards */}
          <div className="hero-cards-col hidden lg:flex flex-col justify-center gap-4 relative">
            {/* Glow behind cards */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,80,255,0.12)_0%,transparent_70%)] pointer-events-none" />

            {[
              {
                img: "/nft1.webp",
                name: "Void #001",
                price: "2.4 ETH",
                change: "+12%",
              },
              {
                img: "/nft2.webp",
                name: "Neon Soul #88",
                price: "1.8 ETH",
                change: "+7%",
              },
              {
                img: "/nft3.webp",
                name: "Glitch Era #44",
                price: "3.1 ETH",
                change: "+21%",
              },
            ].map((nft, i) => (
              <div
                key={nft.name}
                className="hero-nft-card group relative bg-white/4 border border-white/7 backdrop-blur-sm overflow-hidden cursor-pointer hover:border-white/20 transition-colors duration-500"
                style={{
                  transform: `translateX(${i % 2 === 0 ? "0px" : "24px"})`,
                }}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 shrink-0 overflow-hidden bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={nft.img}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {nft.name}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">{nft.price}</p>
                  </div>
                  {/* Change */}
                  <span className="text-emerald-400 text-xs font-medium shrink-0">
                    {nft.change}
                  </span>
                </div>
                {/* Hover shimmer */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </div>
            ))}

            {/* Live indicator */}
            <div className="flex items-center gap-2 mt-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase">
                Live trading
              </span>
            </div>
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <div className="absolute bottom-8 left-6 md:left-12 lg:left-20 z-10 flex items-center gap-4">
          <div className="relative w-px h-14 bg-white/10 overflow-hidden">
            <div className="hero-scroll-dot absolute top-0 left-0 w-full h-5 bg-white/50" />
          </div>
          <span className="hero-scroll-label text-white/25 text-[10px] tracking-[0.3em] uppercase">
            Scroll to explore
          </span>
        </div>

        {/* ── Bottom marquee ── */}
        <div className="hero-marquee-wrap absolute bottom-0 left-0 right-0 z-10 border-t border-white/6 overflow-hidden py-3">
          <div
            className="hero-marquee-inner flex whitespace-nowrap"
            style={{ width: "200%" }}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-8 pr-8"
                style={{ width: "50%" }}
              >
                {[
                  "Digital Art",
                  "Collectibles",
                  "Photography",
                  "Music",
                  "Virtual Worlds",
                  "Sports",
                  "Trading Cards",
                  "Utility",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-8 text-white/20 text-xs tracking-[0.25em] uppercase shrink-0"
                  >
                    {tag}
                    <span className="w-1 h-1 rounded-full bg-white/15 shrink-0" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
