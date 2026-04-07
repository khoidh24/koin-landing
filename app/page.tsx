import {
  HeroClient,
  HeaderClient,
  LoaderClient,
  NFTCollectionClient,
  StackScrollClient,
  AboutClient,
  FooterClient,
} from "@/components/layout/ClientOnly";

export default function Home() {
  return (
    <>
      <LoaderClient />
      <HeaderClient />
      <StackScrollClient />
      <main>
        {/* Hero fixed behind — spacer creates 100vh scroll zone for it */}
        <HeroClient />
        <div className="stack-spacer" aria-hidden="true" />

        {/* NFT starts at translateY(100vh), slides up over Hero via StackScroll */}
        {/* After slide completes, About + Footer flow normally after it */}
        <NFTCollectionClient />
        <AboutClient />
        <FooterClient />
      </main>
    </>
  );
}
