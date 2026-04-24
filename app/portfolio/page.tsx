import type { Metadata } from "next";
import { projectSeeds } from "@/lib/data";
import { ProjectCard } from "@/components/ProjectCard";
import { LeadForm } from "@/components/LeadForm";
import { VisitorTracker } from "@/components/VisitorTracker";

export const metadata: Metadata = {
  title: "Commercial Interior Design Portfolio | ArtTech24",
  description:
    "Explore cafe, restaurant, bakery, hotel, and retail commercial interior projects delivered by ArtTech24.",
};

export default function PortfolioPage() {
  return (
    <main className="container page-section">
      <VisitorTracker path="/portfolio" />
      <h1>Our Commercial Interior Projects</h1>
      <p className="page-intro">
        Real projects. Real outcomes. Premium quality materials, delivered on time.
      </p>

      <div className="project-grid">
        {projectSeeds.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <section className="card cta-block">
        <h2>Need Similar Design for Your Business?</h2>
        <LeadForm source="portfolio" />
      </section>
    </main>
  );
}
