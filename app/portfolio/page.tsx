import type { Metadata } from "next";
import { projectSeeds } from "@/lib/data";
import { ProjectCard } from "@/components/ProjectCard";
import { LeadForm } from "@/components/LeadForm";
import { VisitorTracker } from "@/components/VisitorTracker";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Commercial Interior Design Portfolio",
  description:
    "Explore cafe, restaurant, bakery, hotel, and retail commercial interior projects delivered by ArtTech24.",
  path: "/portfolio",
  keywords: ["interior portfolio", "cafe interior project", "restaurant interior portfolio"],
});

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
        <p style={{ color: "var(--text-sec)", marginBottom: "20px" }}>
          Get a free cost estimate for your space — restaurant, cafe, hotel, retail, or office.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          <a href="/calculator" className="btn btn-primary btn-sm">🧮 Calculate Project Cost</a>
          <a href="https://wa.me/919597217144" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">WhatsApp Us</a>
        </div>
        <LeadForm source="portfolio" />
      </section>
    </main>
  );
}
