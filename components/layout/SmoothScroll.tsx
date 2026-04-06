"use client";

import { useLenis } from "@/hooks/useLenis";
import "lenis/dist/lenis.css";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis();
  return <>{children}</>;
}
