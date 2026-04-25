"use client";

import { FormEvent, useState } from "react";

export type AdminProject = {
  slug: string;
  title: string;
  businessType: string;
  clientName: string;
  location: string;
  description: string;
  images: string[];
  tags: string[];
};

export type AdminInspiration = {
  id: string;
  title: string;
  image: string;
  url: string;
  tags: string[];
};

export function AdminProjectManager({
  initialProjects,
  initialInspirations,
}: {
  initialProjects: AdminProject[];
  initialInspirations: AdminInspiration[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [inspirations, setInspirations] = useState(initialInspirations);
  const [status, setStatus] = useState("");

  async function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      slug: String(formData.get("slug") || "").trim(),
      title: String(formData.get("title") || "").trim(),
      businessType: String(formData.get("businessType") || "").trim(),
      clientName: String(formData.get("clientName") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      images: String(formData.get("images") || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setProjects((prev) => [payload, ...prev]);
      setStatus("Project added.");
      event.currentTarget.reset();
    } else {
      setStatus("Failed to add project.");
    }
  }

  async function removeProject(slug: string) {
    const response = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    if (response.ok) {
      setProjects((prev) => prev.filter((project) => project.slug !== slug));
      setStatus("Project deleted.");
    } else {
      setStatus("Delete failed.");
    }
  }

  async function addInspiration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || "").trim(),
      image: String(formData.get("image") || "").trim(),
      url: String(formData.get("url") || "").trim(),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/inspirations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      const created = data?.inspiration;
      setInspirations((prev) => [
        {
          id: String(created?._id || Date.now()),
          title: payload.title,
          image: payload.image,
          url: payload.url,
          tags: payload.tags,
        },
        ...prev,
      ]);
      setStatus("Reference added.");
      event.currentTarget.reset();
    } else {
      setStatus("Failed to add reference.");
    }
  }

  async function removeInspiration(id: string) {
    const response = await fetch("/api/inspirations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setInspirations((prev) => prev.filter((item) => item.id !== id));
      setStatus("Reference deleted.");
    } else {
      setStatus("Delete failed.");
    }
  }

  return (
    <section className="card admin-manager">
      <h2>Media / Project Manager</h2>
      <p>Add or delete projects. Uploaded entries update portfolio pages immediately.</p>

      <form className="admin-form" onSubmit={addProject}>
        <input name="slug" placeholder="slug-example" required />
        <input name="title" placeholder="Project title" required />
        <input name="businessType" placeholder="Business type" required />
        <input name="clientName" placeholder="Client name" required />
        <input name="location" placeholder="Location" required />
        <textarea name="description" placeholder="Description" required />
        <input name="images" placeholder="Image paths comma-separated" required />
        <input name="tags" placeholder="SEO tags comma-separated" required />
        <button className="btn" type="submit">Add Project</button>
      </form>

      {status ? <p className="form-message">{status}</p> : null}

      <div className="admin-project-list">
        {projects.map((project) => (
          <div key={project.slug} className="admin-project-item">
            <div>
              <strong>{project.title}</strong>
              <p>{project.location} - {project.businessType}</p>
            </div>
            <button className="btn btn-small btn-danger" onClick={() => removeProject(project.slug)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <hr style={{ margin: "22px 0", border: 0, borderTop: "1px solid var(--border)" }} />

      <h2>Explore Reference Board</h2>
      <p>Add reference images and links shown in Explore Ideas page.</p>

      <form className="admin-form" onSubmit={addInspiration}>
        <input name="title" placeholder="Reference title" required />
        <input name="image" placeholder="Image path (for example /images/projects/..jpg)" required />
        <input name="url" placeholder="Reference URL" required />
        <input name="tags" placeholder="Tags comma-separated" />
        <button className="btn" type="submit">Add Reference</button>
      </form>

      <div className="admin-project-list">
        {inspirations.map((item) => (
          <div key={item.id} className="admin-project-item">
            <div>
              <strong>{item.title}</strong>
              <p>{item.url}</p>
            </div>
            <button className="btn btn-small btn-danger" onClick={() => removeInspiration(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
