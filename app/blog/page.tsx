import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/data";
import { LeadForm } from "@/components/LeadForm";
import { VisitorTracker } from "@/components/VisitorTracker";

export const metadata: Metadata = {
  title: "Commercial Interior Guides | ArtTech24",
  description:
    "Articles on commercial interior cost, maintenance, and material choices for cafes, restaurants, hotels, and retail spaces.",
};

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
            <Link href={`/blog/${post.slug}`} className="link-btn">
              Read Article
            </Link>
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
