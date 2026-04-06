"use client";

import dynamic from "next/dynamic";

export const HeroClient = dynamic(() => import("@/components/sections/Hero"), {
  ssr: false,
});
