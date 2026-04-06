<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# Coding Rules

## Comments & Documentation

- Do NOT write inline comments randomly or to explain obvious code.
- Only write a comment when:
  - The logic is genuinely non-obvious or complex.
  - You are documenting a function/method using JSDoc format.
  - You are explaining _why_ something is done, not _what_ it does.
- Use JSDoc for all exported functions, hooks, and components.

```ts
/**
 * Calculates the eased progress value for a scroll-driven animation.
 * Uses cubic bezier to match the GSAP ease curve.
 */
function getEasedProgress(raw: number): number { ... }
```

---

## Animation Stack

This project is animation-first. Every interaction, transition, and scroll effect should feel like it belongs on an Awwwards-winning site.

### GSAP (primary animation engine)

- Always use the latest GSAP version. Do NOT rely on training data for API details — read from `node_modules/gsap/` or [gsap.com/docs](https://gsap.com/docs/v3/).
- Current latest: `gsap@3.14.x`
- Register all plugins before use:

```ts
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import Flip from "gsap/Flip";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  MorphSVGPlugin,
  DrawSVGPlugin,
  MotionPathPlugin,
  Flip,
);
```

- In React/Next.js, use `@gsap/react` and the `useGSAP()` hook instead of `useEffect` for all GSAP animations. It handles cleanup automatically.

```ts
import { useGSAP } from "@gsap/react";

useGSAP(
  () => {
    gsap.from(".hero-title", {
      opacity: 0,
      y: 80,
      duration: 1.2,
      ease: "power4.out",
    });
  },
  { scope: containerRef },
);
```

### Priority GSAP techniques (use these aggressively for Awwwards-level work)

- `ScrollTrigger` with `pin`, `scrub`, and `snap` for scroll-driven sequences.
- `SplitText` for per-character/word/line text animations.
- `DrawSVGPlugin` for SVG line draw-on effects.
- `MorphSVGPlugin` for shape morphing transitions.
- `MotionPathPlugin` for elements following SVG paths.
- `Flip` for layout-to-layout transitions (FLIP technique).
- `gsap.matchMedia()` for responsive animation breakpoints.
- `gsap.timeline()` for sequenced, orchestrated animations.
- `stagger` on all multi-element entrances.

### Lenis (smooth scroll)

- Always use the latest `lenis` package (not `@studio-freight/lenis` — that's deprecated).
- Current latest: `lenis@1.3.x`
- Always sync Lenis with GSAP ScrollTrigger:

```ts
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

- In Next.js, initialize Lenis in a client component using `useEffect` or `useLayoutEffect`, store the instance in a `useRef`, and clean up on unmount.

---

## General Code Style

- Write minimal, purposeful code. No boilerplate, no filler.
- Prefer TypeScript strict mode.
- No `any` types unless absolutely unavoidable — document why if used.
- Keep components small and focused. Extract animation logic into custom hooks when reused.
- Use `will-change: transform` and `transform: translateZ(0)` on animated elements to promote GPU layers — but only where needed, not globally.

---

## Architecture & Performance

### Folder Structure

Áp dụng split coding nghiêm ngặt. Mỗi concern có folder riêng, không để code lẫn lộn:

```
app/                        # Next.js App Router pages & layouts only
components/
  ui/                       # Primitive, stateless UI elements (Button, Icon, ...)
  sections/                 # Page sections (Hero, About, Work, ...)
  layout/                   # Header, Footer, Navigation, ...
hooks/                      # Custom React hooks (useScroll, useLenis, useMedia, ...)
lib/                        # Pure utility functions, no React deps
  gsap/                     # GSAP plugin registration, shared timelines, helpers
  lenis/                    # Lenis singleton setup & context
animations/                 # Reusable animation presets & variants (not tied to any component)
workers/                    # Web Worker scripts (*.worker.ts)
types/                      # Global TypeScript types & interfaces
constants/                  # App-wide constants (breakpoints, durations, eases, ...)
```

- Không được để logic animation trực tiếp trong page files.
- Không được để utility functions trong component files.
- Mỗi file chỉ export một responsibility chính.

### Code Splitting

- Dùng `next/dynamic` với `ssr: false` cho mọi component nặng (canvas, WebGL, heavy animation sections):

```ts
const HeroCanvas = dynamic(() => import("@/components/sections/HeroCanvas"), {
  ssr: false,
});
```

- Lazy load GSAP plugins — chỉ import plugin khi component mount, không import toàn bộ ở top-level nếu không cần thiết trên mọi route.
- Tách `animations/` thành các file nhỏ theo feature, không bundle tất cả vào một file.

### Tree-shaking

- Luôn import named exports thay vì default object khi có thể:

```ts
// good
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// bad — imports everything
import * as GSAP from "gsap";
```

- Không re-export toàn bộ module từ barrel files (`index.ts`) nếu chỉ dùng một phần nhỏ.
- Kiểm tra bundle size với `@next/bundle-analyzer` khi thêm dependency mới.

### Web Workers

- Offload mọi tác vụ CPU-heavy (data processing, physics calculations, noise generation) sang Web Worker:

```ts
// workers/noise.worker.ts
self.onmessage = (e) => {
  const result = heavyNoiseCalc(e.data);
  self.postMessage(result);
};

// usage
const worker = new Worker(
  new URL("@/workers/noise.worker.ts", import.meta.url),
);
```

- Dùng `Comlink` nếu cần interface phức tạp giữa main thread và worker.
- Không bao giờ block main thread với vòng lặp nặng — nếu thấy `for` loop lớn hoặc tính toán > vài ms, chuyển sang worker.

### Next.js Optimization

- Dùng `next/image` cho mọi ảnh, luôn set `sizes` prop đúng với layout thực tế.
- Dùng `next/font` để load font, không dùng `@import` trong CSS.
- Bật `turbopack` trong dev nếu Next.js version hỗ trợ.
- Dùng React Server Components (RSC) cho mọi component không cần interactivity — chỉ thêm `"use client"` khi thực sự cần.
- Tránh `"use client"` ở layout hoặc page level — đẩy xuống leaf component nhỏ nhất có thể.
- Dùng `Suspense` + `loading.tsx` để stream UI, tránh waterfall.
- Prefetch routes quan trọng với `<Link prefetch>`.
- Đặt `revalidate` hoặc `cache` strategy rõ ràng cho mọi data fetch, không để mặc định.
