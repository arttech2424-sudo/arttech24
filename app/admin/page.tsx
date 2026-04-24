import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead, Visit, Project } from "@/lib/models";
import { projectSeeds } from "@/lib/data";
import { AdminProjectManager } from "@/components/AdminProjectManager";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const db = await connectDB();

  const [leadCount, visitCount, recentLeads, projects] = db
    ? await Promise.all([
        Lead.countDocuments().catch(() => 0),
        Visit.countDocuments().catch(() => 0),
        Lead.find().sort({ createdAt: -1 }).limit(8).lean().catch(() => []),
        Project.find().sort({ createdAt: -1 }).lean().catch(() => []),
      ])
    : [0, 0, [], []];

  const displayProjects = projects.length
    ? projects.map((project) => ({
        slug: String(project.slug || ""),
        title: String(project.title || ""),
        businessType: String(project.businessType || ""),
        clientName: String(project.clientName || ""),
        location: String(project.location || ""),
        description: String(project.description || ""),
        images: Array.isArray(project.images) ? project.images.map(String) : [],
        tags: Array.isArray(project.tags) ? project.tags.map(String) : [],
      }))
    : projectSeeds;

  return (
    <main className="container page-section admin-page">
      <h1>ArtTech24 Admin Dashboard</h1>
      <div className="metrics-grid">
        <div className="card metric">
          <h3>Total Visitors</h3>
          <p>{visitCount}</p>
        </div>
        <div className="card metric">
          <h3>Total Leads</h3>
          <p>{leadCount}</p>
        </div>
        <div className="card metric">
          <h3>Logged-in Admin</h3>
          <p>{session.user.name || session.user.email}</p>
        </div>
      </div>

      <section className="card">
        <h2>Latest Leads</h2>
        <div className="lead-table">
          {recentLeads.length ? (
            recentLeads.map((lead) => (
              <div key={String(lead._id)} className="lead-row">
                <strong>{String(lead.name || "")}</strong>
                <span>{String(lead.phone || "")}</span>
                <span>{String(lead.location || "")}</span>
                <span>{lead.createdAt ? new Date(String(lead.createdAt)).toLocaleString() : "N/A"}</span>
              </div>
            ))
          ) : (
            <p>No leads yet.</p>
          )}
        </div>
      </section>

      <AdminProjectManager initialProjects={displayProjects} />
    </main>
  );
}
