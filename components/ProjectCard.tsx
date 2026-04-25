import Image from "next/image";
import type { ProjectSeed } from "@/lib/data";
import { TrackedLink } from "@/components/TrackedLink";

export function ProjectCard({ project }: { project: ProjectSeed }) {
  return (
    <article className="project-card">
      <Image
        src={project.images[0]}
        alt={project.title}
        width={900}
        height={600}
        className="project-image"
      />
      <div className="project-content">
        <p className="meta">{project.businessType} - {project.location}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <TrackedLink
          href={`/portfolio/${project.slug}`}
          className="link-btn"
          path="/portfolio"
          section="project_card"
          target={`/portfolio/${project.slug}`}
          label={project.title}
        >
          View Project
        </TrackedLink>
      </div>
    </article>
  );
}
