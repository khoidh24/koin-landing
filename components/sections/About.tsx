"use client";

import { useRef, useEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap";

const PILLARS = [
  {
    index: "01",
    title: "Provenance",
    body: "Every work on Koin carries an immutable chain of custody — from the moment of minting to every subsequent transfer. Ownership is not a claim. It is a cryptographic fact.",
  },
  {
    index: "02",
    title: "Curation",
    body: "We do not index the internet. We select. A dedicated council of critics, collectors, and technologists reviews every artist before their first work appears on the platform.",
  },
  {
    index: "03",
    title: "Longevity",
    body: "Koin stores all metadata and media on decentralized infrastructure. The art you collect today will be retrievable in a hundred years, regardless of what happens to us.",
  },
];

function KoinMark() {
  return (
    <svg
      className="about-logo-svg"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 4v20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M6 14L20 4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 14L20 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="23" cy="14" r="2" fill="white" />
    </svg>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: ReturnType<typeof gsap.context>;

    // Wait for fonts before SplitText so character bounds are correct
    document.fonts.ready.then(() => {
      ctx = gsap.context(() => {
        gsap.set(section.querySelectorAll(".about-line-h"), {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(section.querySelector(".about-logo-svg"), {
          opacity: 0,
          scale: 0.85,
        });
        gsap.set(section.querySelector(".about-tag"), { opacity: 0, y: 8 });

        const titleEl = section.querySelector<HTMLElement>(".about-title");
        const split = titleEl
          ? new SplitText(titleEl, { type: "chars" })
          : null;
        if (split) gsap.set(split.chars, { yPercent: 110, opacity: 0 });

        const bodyEl = section.querySelector<HTMLElement>(".about-body");
        const bodySplit = bodyEl
          ? new SplitText(bodyEl, { type: "lines" })
          : null;
        if (bodySplit) gsap.set(bodySplit.lines, { opacity: 0, x: -16 });

        gsap.set(section.querySelectorAll(".about-pillar"), {
          opacity: 0,
          y: 28,
        });
        gsap.set(section.querySelector(".about-newsletter"), {
          opacity: 0,
          y: 20,
        });
        gsap.set(section.querySelector(".about-manifesto"), { opacity: 0 });

        const st = { trigger: section, start: "top 80%" };

        gsap.to(section.querySelectorAll(".about-line-h"), {
          scaleX: 1,
          duration: 1,
          ease: "expo.inOut",
          stagger: 0.08,
          scrollTrigger: st,
        });
        gsap.to(section.querySelector(".about-logo-svg"), {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%" },
        });
        gsap.to(section.querySelector(".about-tag"), {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 75%" },
        });
        if (split) {
          gsap.to(split.chars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: { amount: 0.45, from: "start" },
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 72%" },
          });
        }
        if (bodySplit) {
          gsap.to(bodySplit.lines, {
            opacity: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 65%" },
          });
        }
        gsap.to(section.querySelectorAll(".about-pillar"), {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.querySelector(".about-pillars"),
            start: "top 80%",
          },
        });
        gsap.to(section.querySelector(".about-newsletter"), {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.querySelector(".about-newsletter"),
            start: "top 85%",
          },
        });
        gsap.to(section.querySelector(".about-manifesto"), {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section.querySelector(".about-manifesto"),
            start: "top 85%",
          },
        });
      }, section);
    }); // document.fonts.ready

    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      <div className="about-inner">
        {/* ── Hero block ── */}
        <div className="about-hero-block">
          {/* Left col */}
          <div className="about-hero-left">
            <div className="about-hero-top">
              <KoinMark />
              <span className="about-tag">Est. {new Date().getFullYear()}</span>
            </div>
            <h2 className="about-title">
              <span className="about-title-clip">
                <span>We built</span>
              </span>
              <span className="about-title-clip">
                <span>the market</span>
              </span>
              <span className="about-title-clip about-title-clip--outline">
                <span>art deserves.</span>
              </span>
            </h2>
          </div>

          {/* Right col */}
          <div className="about-hero-right">
            <p className="about-body">
              Koin was founded on a single conviction: that digital art is not a
              trend, a speculation vehicle, or a footnote in the history of
              technology. It is the defining creative medium of our era — and it
              has been systematically underserved by every platform that came
              before us. We exist to correct that. Not by building faster,
              cheaper, or louder — but by building with more care, more rigour,
              and more genuine respect for the people who make and collect
              extraordinary work.
            </p>
          </div>
        </div>

        <div className="about-line-h" />

        {/* ── Pillars ── */}
        <div className="about-pillars">
          {PILLARS.map((p) => (
            <div key={p.index} className="about-pillar">
              <span className="about-pillar-index">{p.index}</span>
              <div className="about-pillar-body">
                <h3 className="about-pillar-title">{p.title}</h3>
                <p className="about-pillar-text">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="about-line-h" />

        {/* ── Newsletter ── */}
        <div className="about-newsletter">
          <div className="about-newsletter-left">
            <p className="about-newsletter-label">Stay informed</p>
            <p className="about-newsletter-heading">
              Early access &amp; exclusive drops
            </p>
          </div>
          <div className="about-newsletter-right">
            <p className="about-newsletter-desc">
              Be the first to know about new artists, curated collections, and
              platform updates. No noise — only signal.
            </p>
            <form
              className="about-newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="about-newsletter-field">
                <svg
                  className="about-newsletter-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <rect
                    x="1"
                    y="3"
                    width="12"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M1 4.5l6 4 6-4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  id="newsletter"
                  type="email"
                  placeholder="your@email.com"
                  className="about-newsletter-input"
                  aria-label="Email address"
                />
              </div>
              <button type="submit" className="about-newsletter-btn">
                <span>Subscribe</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6h8M7 3l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
            <p className="about-newsletter-note">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="about-line-h" />

        {/* ── Manifesto ── */}
        <div className="about-manifesto">
          <p className="about-manifesto-text">
            "The blockchain does not care about taste. We do."
          </p>
          <span className="about-manifesto-attr">
            — Koin Founding Manifesto, {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </section>
  );
}
