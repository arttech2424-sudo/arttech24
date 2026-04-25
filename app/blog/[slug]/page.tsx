import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/data";
import { LeadForm } from "@/components/LeadForm";
import { VisitorTracker } from "@/components/VisitorTracker";
import { TrackEventOnMount } from "@/components/TrackEventOnMount";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: ["commercial interior article", "interior guide", post.slug],
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container page-section article-page">
      <VisitorTracker path={`/blog/${post.slug}`} />
      <TrackEventOnMount
        path={`/blog/${post.slug}`}
        event="article_view"
        section="blog_detail"
        target={post.slug}
        label={post.title}
      />
      <h1>{post.title}</h1>
      <p className="page-intro">{post.excerpt}</p>
      <article className="card">
        <p>{post.content}</p>
      </article>

      <section className="card cta-block">
        <h2>Need Expert Help for Your Commercial Space?</h2>
        <LeadForm source={`blog_${post.slug}`} />
      </section>
    </main>
  );
}
