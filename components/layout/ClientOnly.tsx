"use client";

import dynamic from "next/dynamic";

export const LoaderClient = dynamic(
  () => import("@/components/layout/PageLoader"),
  { ssr: false },
);

export const HeaderClient = dynamic(
  () => import("@/components/layout/Header"),
  { ssr: false },
);

export const HeroClient = dynamic(() => import("@/components/sections/Hero"), {
  ssr: false,
});

export const NFTCollectionClient = dynamic(
  () => import("@/components/sections/NFTCollection"),
  { ssr: false },
);

export const AboutClient = dynamic(
  () => import("@/components/sections/About"),
  { ssr: false },
);

export const FooterClient = dynamic(
  () => import("@/components/sections/Footer"),
  { ssr: false },
);

export const StackScrollClient = dynamic(
  () => import("@/components/layout/StackScroll"),
  { ssr: false },
);
