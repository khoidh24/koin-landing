"use client";

import { useRef, useEffect, memo } from "react";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/appStore";
import { getLenis } from "@/hooks/useLenis";

const NAV_LINKS = [
  { label: "Collections", target: "nft" },
  { label: "About", target: "about" },
] as const;

function scrollTo(target: "nft" | "about") {
  const lenis = getLenis();
  if (target === "nft") {
    // NFT section sits right after the 100vh stack-spacer in the scroll timeline
    const y = window.innerHeight;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  } else {
    const el = document.querySelector("#about") as HTMLElement | null;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -72 });
    else el.scrollIntoView({ behavior: "smooth" });
  }
}

const Header = memo(function Header() {
  const loaderDone = useAppStore((s) => s.loaderDone);
  const headerRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0, y: -8 });
  }, []);

  useEffect(() => {
    if (!loaderDone || animatedRef.current) return;
    animatedRef.current = true;
    const el = headerRef.current;
    if (!el) return;
    gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" });
  }, [loaderDone]);

  return (
    <header ref={headerRef} className="koin-header">
      <button
        className="koin-header-logo"
        onClick={() => {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <svg className="koin-header-logo-mark" viewBox="0 0 28 28" fill="none">
          <path
            d="M6 4v20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
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
        <span className="koin-header-logo-text">Koin</span>
      </button>

      <nav>
        <ul className="koin-header-nav">
          {NAV_LINKS.map(({ label, target }) => (
            <li key={label}>
              <a
                className="koin-header-nav-link"
                onClick={() => scrollTo(target)}
                style={{ cursor: "pointer" }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="koin-header-right">
        <button
          className="koin-header-btn"
          onClick={() => {
            const el = document.getElementById("newsletter");
            if (!el) return;
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(el, { offset: -120 });
            else el.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => el.focus(), 600);
          }}
        >
          <span className="koin-header-btn-label">Contact</span>
        </button>
      </div>
    </header>
  );
});

export default Header;
