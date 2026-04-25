import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const defaultKeywords = [
  "commercial interior design",
  "cafe interior design chennai",
  "restaurant interior design india",
  "hotel interior design",
  "premium interiors low cost",
];

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteUrl}${path}`;

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const metadataBase = new URL(siteUrl);
