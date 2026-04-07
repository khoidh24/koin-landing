import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const BASE_URL = "https://koin.art";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Koin — The Premier Marketplace for Extraordinary Digital Art",
    template: "%s — Koin",
  },
  description:
    "Koin is a curated NFT marketplace for abstract digital art. Discover generative works, rare collectibles, and one-of-one pieces from the world's most uncompromising digital artists.",

  keywords: [
    "NFT marketplace",
    "digital art",
    "abstract NFT",
    "generative art",
    "crypto art",
    "blockchain art",
    "curated NFT",
    "rare digital collectibles",
    "on-chain art",
    "NFT auction",
  ],

  authors: [{ name: "Koin", url: BASE_URL }],
  creator: "Koin",
  publisher: "Koin Inc.",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Koin",
    title: "Koin — The Premier Marketplace for Extraordinary Digital Art",
    description:
      "A curated marketplace for abstract digital entities. Generative systems, recursive algorithms, and one-of-one works from artists who build with code.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Koin — Extraordinary Digital Art",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@koin_art",
    creator: "@koin_art",
    title: "Koin — The Premier Marketplace for Extraordinary Digital Art",
    description:
      "A curated marketplace for abstract digital entities. Generative systems, recursive algorithms, and one-of-one works from artists who build with code.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",

  category: "marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Koin",
              url: BASE_URL,
              description:
                "A curated marketplace for abstract digital art and NFTs.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Koin",
              url: BASE_URL,
              logo: `${BASE_URL}/icon-512.png`,
              sameAs: [
                "https://twitter.com/koin_art",
                "https://instagram.com/koin_art",
              ],
              description:
                "Koin is a curated NFT marketplace for extraordinary abstract digital art.",
            }),
          }}
        />
      </head>
      <body className={dmSans.className}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
