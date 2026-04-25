import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead, Visit, Project, Inspiration } from "@/lib/models";
import { projectSeeds } from "@/lib/data";
import { AdminProjectManager } from "@/components/AdminProjectManager";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const db = await connectDB();

  const [
    leadCount,
    visitCount,
    recentLeads,
    projects,
    inspirations,
    topProjectClicks,
    exploreTabClicks,
    mostReadArticles,
    faqInteractions,
  ] = db
    ? await Promise.all([
        Lead.countDocuments().catch(() => 0),
        Visit.countDocuments().catch(() => 0),
        Lead.find().sort({ createdAt: -1 }).limit(8).lean().catch(() => []),
        Project.find().sort({ createdAt: -1 }).lean().catch(() => []),
        Inspiration.find().sort({ createdAt: -1 }).lean().catch(() => []),
        Visit.aggregate([
          {
            $match: {
              event: "click",
              target: { $regex: "^/portfolio/" },
            },
          },
          {
            $group: {
              _id: "$target",
              count: { $sum: 1 },
              label: { $first: "$label" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]).catch(() => []),
        Visit.countDocuments({ event: "click", target: "/explore" }).catch(() => 0),
        Visit.aggregate([
          { $match: { event: "article_view" } },
          {
            $group: {
              _id: "$target",
              count: { $sum: 1 },
              label: { $first: "$label" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]).catch(() => []),
        Visit.aggregate([
          { $match: { event: "faq_view" } },
          {
            $group: {
              _id: "$target",
              count: { $sum: 1 },
              label: { $first: "$label" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]).catch(() => []),
      ])
    : [0, 0, [], [], [], [], 0, [], []];

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

  const displayInspirations = inspirations.map((item) => ({
    id: String(item._id),
    title: String(item.title || ""),
    image: String(item.image || ""),
    url: String(item.url || ""),
    tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
  }));

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
          <p>{session?.user?.name || session?.user?.email}</p>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 20 }}>
        <h2>Engagement Overview</h2>
        <div className="metrics-grid" style={{ marginTop: 12, marginBottom: 0 }}>
          <div className="metric">
            <h3>Explore Tab Clicks</h3>
            <p>{exploreTabClicks}</p>
          </div>
          <div className="metric">
            <h3>Top Project Clicks</h3>
            <p>{topProjectClicks.length}</p>
          </div>
          <div className="metric">
            <h3>Most Read Articles</h3>
            <p>{mostReadArticles.length}</p>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginBottom: 20 }}>
        <h2>Top Clicked Projects</h2>
        <div className="lead-table">
          {topProjectClicks.length ? (
            topProjectClicks.map((item: { _id: string; count: number; label?: string }) => (
              <div key={item._id} className="lead-row">
                <strong>{item.label || item._id}</strong>
                <span>{item._id}</span>
                <span>Clicks</span>
                <span>{item.count}</span>
              </div>
            ))
          ) : (
            <p>No project click data yet.</p>
          )}
        </div>
      </section>

      <section className="card" style={{ marginBottom: 20 }}>
        <h2>Most Read Articles</h2>
        <div className="lead-table">
          {mostReadArticles.length ? (
            mostReadArticles.map((item: { _id: string; count: number; label?: string }) => (
              <div key={item._id} className="lead-row">
                <strong>{item.label || item._id}</strong>
                <span>{item._id}</span>
                <span>Reads</span>
                <span>{item.count}</span>
              </div>
            ))
          ) : (
            <p>No article view data yet.</p>
          )}
        </div>
      </section>

      <section className="card" style={{ marginBottom: 20 }}>
        <h2>FAQ Interactions</h2>
        <div className="lead-table">
          {faqInteractions.length ? (
            faqInteractions.map((item: { _id: string; count: number; label?: string }) => (
              <div key={item._id} className="lead-row">
                <strong>{item.label || item._id}</strong>
                <span>{item._id}</span>
                <span>Opens</span>
                <span>{item.count}</span>
              </div>
            ))
          ) : (
            <p>No FAQ interaction data yet.</p>
          )}
        </div>
      </section>

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

      <AdminProjectManager initialProjects={displayProjects} initialInspirations={displayInspirations} />
    </main>
  );
}
