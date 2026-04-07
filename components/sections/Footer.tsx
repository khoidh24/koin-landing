"use client";

import { useRef, useEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap";

const LINKS = {
  Marketplace: [
    "Explore",
    "Collections",
    "Artists",
    "Live Auctions",
    "New Drops",
  ],
  Company: ["About", "Manifesto", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // KOIN wordmark — slides down from above
      const wordmark = section.querySelector<HTMLElement>(".footer-wordmark");
      gsap.set(wordmark, { yPercent: -60, opacity: 0 });
      gsap.to(wordmark, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 85%" },
      });

      // Top line
      gsap.set(section.querySelector(".footer-top-line"), {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.to(section.querySelector(".footer-top-line"), {
        scaleX: 1,
        duration: 1,
        ease: "expo.inOut",
        scrollTrigger: { trigger: section, start: "top 85%" },
      });

      // Nav columns stagger
      gsap.set(section.querySelectorAll(".footer-col"), { opacity: 0, y: 24 });
      gsap.to(section.querySelectorAll(".footer-col"), {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.querySelector(".footer-nav"),
          start: "top 88%",
        },
      });

      // Bottom bar
      gsap.set(section.querySelectorAll(".footer-bottom-item"), { opacity: 0 });
      gsap.to(section.querySelectorAll(".footer-bottom-item"), {
        opacity: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.querySelector(".footer-bottom"),
          start: "top 95%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className="footer-section">
      <div className="footer-inner">
        {/* Top line */}
        <div className="footer-top-line" />

        {/* KOIN wordmark — large SVG text */}
        <div className="footer-wordmark-wrap" aria-hidden="true">
          <svg
            className="footer-wordmark"
            viewBox="0 0 400 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* K — starts flush left, half strokeWidth=4.5 padding */}
            <line
              x1="5"
              y1="15"
              x2="5"
              y2="105"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="60"
              x2="55"
              y2="15"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="60"
              x2="55"
              y2="105"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* O — true circle */}
            <circle
              cx="125"
              cy="60"
              r="50"
              stroke="white"
              strokeWidth="9"
              fill="none"
            />
            {/* I */}
            <line
              x1="215"
              y1="15"
              x2="215"
              y2="105"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* N */}
            <line
              x1="260"
              y1="105"
              x2="260"
              y2="15"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <line
              x1="260"
              y1="15"
              x2="330"
              y2="105"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <line
              x1="330"
              y1="15"
              x2="330"
              y2="105"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Tagline */}
        <p className="footer-tagline">
          The premier marketplace for extraordinary digital art.
        </p>

        {/* Nav grid */}
        <nav className="footer-nav" aria-label="Footer navigation">
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group} className="footer-col">
              <span className="footer-col-label">{group}</span>
              <ul className="footer-col-list">
                {links.map((link) => (
                  <li key={link}>
                    <a className="footer-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter col */}
          <div className="footer-col footer-col--newsletter">
            <span className="footer-col-label">Stay in the loop</span>
            <p className="footer-newsletter-desc">
              New drops, curated picks, and market intelligence — delivered
              weekly.
            </p>
            <div className="footer-newsletter-form">
              <input
                type="email"
                placeholder="your@email.com"
                className="footer-newsletter-input"
                aria-label="Email address"
              />
              <button className="footer-newsletter-btn" aria-label="Subscribe">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-row">
            <span className="footer-bottom-item footer-bottom-copy">
              © {new Date().getFullYear()} Koin Inc. All rights reserved.
            </span>
            <div className="footer-bottom-item footer-bottom-badges">
              <span className="footer-badge">Ethereum</span>
              <span className="footer-badge">Polygon</span>
              <span className="footer-badge">Solana</span>
            </div>
            <span className="footer-bottom-item footer-bottom-made">
              Crafted with obsession.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
