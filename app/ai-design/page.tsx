import type { Metadata } from "next";
import { AIDesignGenerator } from "@/components/AIDesignGenerator";
import { VisitorTracker } from "@/components/VisitorTracker";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Interior Design Generator",
  description:
    "Upload your space photos and let AI create stunning commercial interior design concepts — bakery, restaurant, jewellery shop, café, theater, and more. Free first generation.",
  path: "/ai-design",
  keywords: [
    "ai interior design generator",
    "ai commercial interior design",
    "interior design ai india",
    "ai cafe design",
    "ai restaurant design",
  ],
});

export default function AIDesignPage() {
  return (
    <main className="container page-section">
      <VisitorTracker path="/ai-design" />

      <div className="ai-page-header">
        <p className="section-eyebrow">✨ Powered by Google Gemini AI</p>
        <h1>AI Interior Design Generator</h1>
        <p className="page-intro">
          Upload photos of your space (or start from scratch), select your
          preferences, and get 2 unique photorealistic design concepts in under
          60 seconds — completely free for your first generation.
        </p>
        <div className="ai-page-badges">
          <span>✅ First design free</span>
          <span>✅ No sign-up needed</span>
          <span>✅ 2 unique variations</span>
          <span>✅ Branded watermark</span>
        </div>
      </div>

      <AIDesignGenerator />
    </main>
  );
}
