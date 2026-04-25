import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { defaultKeywords, metadataBase } from "@/lib/seo";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "ArtTech24 | Commercial Interior Design at Factory Pricing",
    template: "%s | ArtTech24",
  },
  description:
    "South India based commercial interior design brand with 20+ years experience, 1253+ projects, and premium quality at lowest market cost.",
  keywords: defaultKeywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "ArtTech24 | Commercial Interior Design at Factory Pricing",
    description:
      "South India based commercial interior design brand with 20+ years experience, 1253+ projects, and premium quality at lowest market cost.",
    siteName: "ArtTech24",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtTech24 | Commercial Interior Design at Factory Pricing",
    description:
      "South India based commercial interior design brand with 20+ years experience, 1253+ projects, and premium quality at lowest market cost.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ArtTech24",
              url: metadataBase.toString(),
              description:
                "Commercial interior design brand delivering cafe, restaurant, retail, and hotel interiors at factory pricing.",
              sameAs: ["https://wa.me/918110000533"],
            }),
          }}
        />
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
