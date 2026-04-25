import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arttech24.vercel.app";

export const defaultKeywords = [
  "commercial interior design",
  "cafe interior design chennai",
  "restaurant interior design india",
  "hotel interior design",
  "premium interiors low cost",
  "commercial interior design south india",
  "factory direct interior design",
];

export const defaultOgImage = `${siteUrl}/images/projects/20230629-BlackCanaryCoffee-Sansa-30-min.webp`;

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const ogImage = image ?? defaultOgImage;

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "ArtTech24",
      images: [{ url: ogImage, width: 1200, height: 800, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export const metadataBase = new URL(siteUrl);
