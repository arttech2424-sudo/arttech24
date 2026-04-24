import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/data";
import { LeadForm } from "@/components/LeadForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return { title: "Article Not Found | ArtTech24" };
  }

  return {
    title: `${post.title} | ArtTech24`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container page-section article-page">
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
