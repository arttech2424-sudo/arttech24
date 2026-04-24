import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { projectSeeds } from "@/lib/data";
import { VisitorTracker } from "@/components/VisitorTracker";

const industries = [
  { label: "Cafe Interiors", img: "/images/projects/Tobys-Cafe-for-cafe-inspriation.jpg" },
  { label: "Restaurant Interiors", img: "/images/projects/Restaurant_7_.jpg" },
  { label: "Bakery Interiors", img: "/images/projects/gMercato_SansaInteriors_BrunoBelli-4-min.webp" },
  { label: "Hotel Interiors", img: "/images/projects/Hale_Toronto_4.webp" },
  { label: "Office Interiors", img: "/images/projects/luxury-showroom-interior-design-trends-in-2024.webp" },
  { label: "Retail Showrooms", img: "/images/projects/gMercato_SansaInteriors_GMercato.webp" },
];

export default function Home() {
  const featuredProjects = projectSeeds.filter((p) => p.featured);

  return (
    <main>
      <VisitorTracker path="/" />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <Image
            src="/images/projects/gMercato_SansaInteriors_Toronto+Cafe+Interior+Design.webp"
            alt="ArtTech24 commercial interior"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-badge">South India's #1 Commercial Interior Brand</span>
            <h1>Transform Your Commercial Space Into a Brand Statement</h1>
            <p>Premium interiors for cafes, restaurants, hotels &amp; retail — delivered on time, within budget.</p>
            <div className="hero-actions">
              <Link href="/calculator" className="btn btn-primary">Calculate Your Cost</Link>
              <a href="tel:+919000000000" className="btn btn-ghost">☎ Call Us Now</a>
            </div>
            <div className="hero-stats">
              <div className="h-stat"><strong>1253+</strong><span>Projects Done</span></div>
              <div className="h-stat"><strong>750+</strong><span>Happy Clients</span></div>
              <div className="h-stat"><strong>20+</strong><span>Years Experience</span></div>
              <div className="h-stat"><strong>5</strong><span>Countries</span></div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-form-wrap">
            <p className="hero-form-eyebrow">Free Consultation</p>
            <h2 className="hero-form-title">Start Your Project Today</h2>
            <p className="hero-form-sub">Get expert advice and a free cost estimate within 24 hours.</p>
            <LeadForm source="homepage_hero" />
            <div className="hero-trust">
              <span>✔ No spam, ever</span>
              <span>✔ 24-hr response</span>
              <span>✔ Free site visit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="stats-grid">
          {[
            { num: "1253+", label: "Projects Completed" },
            { num: "750+", label: "Satisfied Clients" },
            { num: "20+", label: "Years of Excellence" },
            { num: "5", label: "Countries Served" },
          ].map((s) => (
            <div className="stat-item" key={s.label}>
              <strong>{s.num}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── INDUSTRIES ── */}
      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">What We Design</p>
            <h2>Commercial Spaces We Specialise In</h2>
          </div>
          <div className="industries-grid">
            {industries.map((ind) => (
              <Link href="/portfolio" key={ind.label} className="industry-card">
                <Image src={ind.img} alt={ind.label} fill style={{ objectFit: "cover" }} />
                <div className="industry-overlay" />
                <span className="industry-label">{ind.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="section-pad bg-surface">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">Portfolio</p>
            <h2>Recent Work We're Proud Of</h2>
            <Link href="/portfolio" className="section-link">View All Projects →</Link>
          </div>
          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <Link href={`/portfolio/${project.slug}`} key={project.slug} className="project-card">
                <div className="project-img-wrap">
                  <Image src={project.images[0]} alt={project.title} fill style={{ objectFit: "cover" }} />
                  <span className="project-type-chip">{project.businessType}</span>
                </div>
                <div className="project-info">
                  <p className="project-location">{project.location}</p>
                  <h3 className="project-title">{project.title}</h3>
                  <span className="project-cta">View Case Study →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">Our Process</p>
            <h2>How We Bring Your Vision to Life</h2>
          </div>
          <div className="how-grid">
            {[
              { n: "01", title: "Free Consultation", desc: "Share your requirements — we listen, understand, and plan your space from day one." },
              { n: "02", title: "Design & Estimate", desc: "Our designers create concept boards with a transparent cost breakdown — no hidden charges." },
              { n: "03", title: "Factory Execution", desc: "We manufacture in our own facility for quality control and 40% lower cost than market." },
              { n: "04", title: "On-Time Delivery", desc: "Project handed over on schedule, snag-free, ready for your grand opening." },
            ].map((step) => (
              <div className="how-step" key={step.n}>
                <div className="how-number">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ARTTECH24 ── */}
      <section className="section-pad bg-surface">
        <div className="container">
          <div className="why-split">
            <div className="why-content">
              <p className="section-eyebrow">Why Choose Us</p>
              <h2>The ArtTech24 Difference</h2>
              <p className="why-intro">We're not just designers — we own the entire supply chain. That means better quality at a fraction of the cost.</p>
              <ul className="why-list">
                {[
                  { icon: "🏭", title: "Own Manufacturing Factory", desc: "Direct production cuts cost by up to 40% vs. outsourced work." },
                  { icon: "🎯", title: "Dedicated Project Manager", desc: "One point of contact from brief to handover." },
                  { icon: "⏱️", title: "On-Time Guarantee", desc: "We've never missed a deadline in 20+ years." },
                  { icon: "🌿", title: "Sustainable Materials", desc: "Eco-certified materials that look premium and last longer." },
                ].map((f) => (
                  <li key={f.title} className="why-feature">
                    <div className="why-icon">{f.icon}</div>
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="why-image">
              <Image
                src="/images/projects/Restaurant_3_.jpg"
                alt="ArtTech24 quality interiors"
                fill
                style={{ objectFit: "cover", borderRadius: "var(--radius-lg)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Ready to Transform Your Space?</h2>
          <p>Get a free cost estimate in under 2 minutes. No commitment required.</p>
          <div className="cta-actions">
            <Link href="/calculator" className="btn btn-primary btn-lg">Calculate Cost Now</Link>
            <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
