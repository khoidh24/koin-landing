import type { Metadata } from "next";
import { Geist, DM_Sans } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Koin — NFT Marketplace",
  description: "Discover, collect, and trade extraordinary NFTs on Koin.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", dmSans.variable)}>
      <body className="bg-[#080808] text-white antialiased overflow-x-hidden">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
