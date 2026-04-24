import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projectSeeds } from "@/lib/data";
import { LeadForm } from "@/components/LeadForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectSeeds.find((item) => item.slug === slug);

  if (!project) {
    return { title: "Project Not Found | ArtTech24" };
  }

  return {
    title: `${project.title} | ArtTech24`,
    description: project.description,
    keywords: project.tags,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projectSeeds.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="container page-section">
      <h1>{project.title}</h1>
      <p className="page-intro">
        {project.clientName} | {project.businessType} | {project.location}
      </p>
      <p>{project.description}</p>

      <div className="detail-gallery">
        {project.images.map((image) => (
          <Image key={image} src={image} alt={project.title} width={1200} height={800} className="detail-image" />
        ))}
      </div>

      <section className="card cta-block">
        <h2>Need Similar Project for Your Business?</h2>
        <LeadForm source={`project_${project.slug}`} />
      </section>
    </main>
  );
}
