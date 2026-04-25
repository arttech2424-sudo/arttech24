import type { Metadata } from "next";
import { blogPosts } from "@/lib/data";
import { LeadForm } from "@/components/LeadForm";
import { VisitorTracker } from "@/components/VisitorTracker";
import { TrackedLink } from "@/components/TrackedLink";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Commercial Interior Guides",
  description:
    "Articles on commercial interior cost, maintenance, and material choices for cafes, restaurants, hotels, and retail spaces.",
  path: "/blog",
  keywords: ["interior design guide", "commercial interior tips", "interior cost articles"],
});

export default function BlogPage() {
  return (
    <main className="container page-section">
      <VisitorTracker path="/blog" />
      <h1>Commercial Interior Design Guidance</h1>
      <div className="blog-list">
        {blogPosts.map((post) => (
          <article key={post.slug} className="card blog-card">
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <TrackedLink
              href={`/blog/${post.slug}`}
              className="link-btn"
              path="/blog"
              section="blog_list"
              target={`/blog/${post.slug}`}
              label={post.title}
            >
              Read Article
            </TrackedLink>
          </article>
        ))}
      </div>

      <section className="card cta-block">
        <h2>Need Expert Guidance for Your Space?</h2>
        <LeadForm source="blog" />
      </section>
    </main>
  );
}
