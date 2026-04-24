import Image from "next/image";
import Link from "next/link";
import type { ProjectSeed } from "@/lib/data";

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
        <Link href={`/portfolio/${project.slug}`} className="link-btn">
          View Project
        </Link>
      </div>
    </article>
  );
}
