import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Explore Interior Design Ideas",
  description:
    "Explore curated design references and inspiration for commercial cafe, restaurant, bakery, and retail interiors.",
  path: "/explore",
  keywords: ["explore interior ideas", "commercial inspiration", "restaurant design ideas"],
});

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
