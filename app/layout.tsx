import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { defaultKeywords, metadataBase, defaultOgImage } from "@/lib/seo";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const siteDescription =
  "South India based commercial interior design brand with 14+ years experience, 7000+ projects, and premium quality at lowest market cost.";

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "ArtTech24 | Commercial Interior Design at Factory Pricing",
    template: "%s | ArtTech24",
  },
  description: siteDescription,
  keywords: defaultKeywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "ArtTech24 | Commercial Interior Design at Factory Pricing",
    description: siteDescription,
    siteName: "ArtTech24",
    url: "/",
    images: [{ url: defaultOgImage, width: 1200, height: 800, alt: "ArtTech24 Commercial Interior Design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtTech24 | Commercial Interior Design at Factory Pricing",
    description: siteDescription,
    images: [defaultOgImage],
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
              "@type": "LocalBusiness",
              name: "ArtTech24",
              url: metadataBase.toString(),
              description:
                "South India's premium commercial interior design brand. 14+ years experience, 7000+ projects delivered across cafes, restaurants, hotels, and retail spaces.",
              telephone: "+919597217144",
              email: "yamunaprabhu89@gmail.com",
              image: defaultOgImage,
              priceRange: "₹₹-₹₹₹₹",
              address: [
                { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
                { "@type": "PostalAddress", addressLocality: "Coimbatore", addressRegion: "Tamil Nadu", addressCountry: "IN" },
                { "@type": "PostalAddress", addressLocality: "Bangalore", addressRegion: "Karnataka", addressCountry: "IN" },
              ],
              areaServed: ["Chennai", "Coimbatore", "Bangalore", "Hyderabad", "South India"],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "19:00",
              },
              sameAs: ["https://wa.me/919597217144"],
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
