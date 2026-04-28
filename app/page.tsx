import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { projectSeeds } from "@/lib/data";
import { VisitorTracker } from "@/components/VisitorTracker";
import styles from "./page.module.css";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { TrackedLink } from "@/components/TrackedLink";
import { HomeFaq } from "../components/HomeFaq";
import { buildPageMetadata } from "@/lib/seo";
import { HeroLogo } from "@/components/HeroLogo";

export const metadata: Metadata = buildPageMetadata({
  title: "Commercial Interior Design at Factory Pricing",
  description:
    "Premium cafe, restaurant, hotel, and retail commercial interiors with factory-direct execution and lead-focused design strategy.",
  path: "/",
  keywords: ["commercial interiors chennai", "restaurant design company", "cafe interiors low cost"],
});

const industries = [
  { label: "Cafe Interiors", img: "/images/projects/home-2.png" },
  { label: "Restaurant Interiors", img: "/images/projects/bar-and-resterent-1.jpeg" },
  { label: "Bakery Interiors", img: "/images/projects/backery-2.png" },
  { label: "Hotel Interiors", img: "/images/projects/hotal-2.png" },
  { label: "Office Interiors", img: "/images/projects/theater-3.png" },
  { label: "Retail Showrooms", img: "/images/projects/jewelry-shop-1.png" },
  { label: "Cap & Fashion Stores", img: "/images/projects/home-3.png" },
  { label: "Jewellery Showrooms", img: "/images/projects/jewelry-shop-2.png" },
  { label: "Theater & Mall Spaces", img: "/images/projects/theater-5.png" },
];

export default function Home() {
  const featuredProjects = projectSeeds.filter((p) => p.featured);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a commercial interior project cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on space size, business type, and material tier. Most commercial interior projects range from ₹800 to ₹3500 per sq ft. Use our calculator to get a budget range and then speak with our team for a tailored estimate.",
        },
      },
      {
        "@type": "Question",
        name: "How long does commercial interior execution take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most projects are delivered in 30 to 90 days based on scope. Our factory-led workflow helps us control quality and timeline.",
        },
      },
      {
        "@type": "Question",
        name: "Do you provide warranty and post-handover support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. ArtTech24 provides warranty coverage based on materials used and offers post-handover maintenance guidance for long-term durability.",
        },
      },
      {
        "@type": "Question",
        name: "Which cities does ArtTech24 serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ArtTech24 executes projects across Chennai, Coimbatore, Bangalore, and selected pan-India locations for high-value commercial spaces.",
        },
      },
    ],
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <VisitorTracker path="/" />

      <section className={styles.hero}>
        <div className={styles.heroImageWrap}>
          <Image
            src="/images/projects/cover-bar-restaurant.jpeg"
            alt="ArtTech24 commercial interior"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <HeroLogo />
              <span className={styles.heroBadge}>South India's #1 Commercial Interior Brand</span>
              <h1>Transform Your Commercial Space Into a Brand Statement</h1>
              <p>Premium interiors for cafes, restaurants, hotels and retail spaces, delivered on time and within budget.</p>
              <div className={styles.heroActions}>
                <TrackedLink href="/calculator" className="btn btn-primary" path="/" section="hero_cta" target="/calculator" label="Get Free Estimate">
                  Get Free Estimate
                </TrackedLink>
                <a href="tel:+919597217144" className={`${styles.callBtn} btn btn-outline-white`}>Call Us Now</a>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}><strong><AnimatedCounter end={7000} suffix="+" /></strong><span>Projects Completed</span></div>
                <div className={styles.heroStat}><strong><AnimatedCounter end={6500} suffix="+" /></strong><span>Happy Customers</span></div>
                <div className={styles.heroStat}><strong><AnimatedCounter end={14} suffix="+" /></strong><span>Years Experience</span></div>
                <div className={styles.heroStat}><strong>100-100000</strong><span>Sq Ft Project Range</span></div>
              </div>
            </div>

            <div className={styles.heroFormWrap}>
              <p className={styles.heroFormEyebrow}>Free Consultation</p>
              <h2 className={styles.heroFormTitle}>Start Your Project Today</h2>
              <p className={styles.heroFormSub}>Get expert advice and a free cost estimate within 24 hours.</p>
              <LeadForm source="homepage_hero" />
              <div className={styles.heroTrust}>
                <span>No spam, ever</span>
                <span>24-hour response</span>
                <span>Free site visit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statsBand}>
        <div className={`container ${styles.statsGrid}`}>
          {[
            { num: 7000, suffix: "+", label: "Projects Completed", static: null },
            { num: 6500, suffix: "+", label: "Happy Customers", static: null },
            { num: 14, suffix: "+ Yrs", label: "Experience", static: null },
            { num: null, suffix: "", label: "Sq Ft Project Range", static: "100-100000" },
          ].map((s) => (
            <div className={styles.statItem} key={s.label}>
              <strong>
                {s.static ? s.static : <AnimatedCounter end={s.num!} suffix={s.suffix} />}
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">What We Design</p>
            <h2>Commercial Spaces We Specialise In</h2>
          </div>
          <div className={styles.industriesGrid}>
            {industries.map((ind) => (
              <TrackedLink
                href="/portfolio"
                key={ind.label}
                className={styles.industryCard}
                path="/"
                section="industry_tile"
                target="/portfolio"
                label={ind.label}
              >
                <Image src={ind.img} alt={ind.label} fill style={{ objectFit: "cover" }} />
                <div className={styles.industryOverlay} />
                <span className={styles.industryLabel}>{ind.label}</span>
              </TrackedLink>
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
            <TrackedLink href="/portfolio" className="section-link" path="/" section="portfolio_section" target="/portfolio" label="View All Projects">
              View All Projects →
            </TrackedLink>
          </div>
          <div className={styles.projectsGrid}>
            {featuredProjects.map((project) => (
              <TrackedLink
                href={`/portfolio/${project.slug}`}
                key={project.slug}
                className={styles.projectCard}
                path="/"
                section="home_project"
                target={`/portfolio/${project.slug}`}
                label={project.title}
              >
                <div className={styles.projectImgWrap}>
                  <Image src={project.images[0]} alt={project.title} fill style={{ objectFit: "cover" }} />
                  <span className={styles.projectTypeChip}>{project.businessType}</span>
                </div>
                <div className={styles.projectInfo}>
                  <p className={styles.projectLocation}>{project.location}</p>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <span className={styles.projectCta}>View Case Study →</span>
                </div>
              </TrackedLink>
            ))}
          </div>
        </div>
      </section>

      <HomeFaq />

      {/* ── COST CALCULATOR STRIP ── */}
      <section className={styles.calcStrip}>
        <div className={`container ${styles.calcStripInner}`}>
          <div className={styles.calcStripLeft}>
            <div className={styles.calcStripIcon}>🧮</div>
            <div className={styles.calcStripText}>
              <h3>Know Your Budget Before You Begin</h3>
              <p>Get a realistic cost estimate in under 2 minutes — no sign-up required.</p>
            </div>
          </div>
          <div className={styles.calcStripPrices}>
            <div className={styles.calcPrice}>
              <strong>₹800+</strong>
              <span>per sq.ft</span>
            </div>
            <div className={styles.calcPrice}>
              <strong>₹1,100+</strong>
              <span>Premium tier</span>
            </div>
            <div className={styles.calcPrice}>
              <strong>₹1,600+</strong>
              <span>Luxury tier</span>
            </div>
          </div>
          <TrackedLink
            href="/calculator"
            className={styles.calcStripBtn}
            path="/"
            section="calc_strip"
            target="/calculator"
            label="Calculate My Project Cost"
          >
            Calculate My Project Cost →
          </TrackedLink>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">Our Process</p>
            <h2>How We Bring Your Vision to Life</h2>
          </div>
          <div className={styles.howGrid}>
            {[
              { n: "01", title: "Free Consultation", desc: "Share your requirements — we listen, understand, and plan your space from day one." },
              { n: "02", title: "Design & Estimate", desc: "Our designers create concept boards with a transparent cost breakdown — no hidden charges." },
              { n: "03", title: "Factory Execution", desc: "We manufacture in our own facility for quality control and 40% lower cost than market." },
              { n: "04", title: "On-Time Delivery", desc: "Project handed over on schedule, snag-free, ready for your grand opening." },
            ].map((step) => (
              <div className={styles.howStep} key={step.n}>
                <div className={styles.howNumber}>{step.n}</div>
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
          <div className={styles.whySplit}>
            <div className={styles.whyContent}>
              <p className="section-eyebrow">Why Choose Us</p>
              <h2>The ArtTech24 Difference</h2>
              <p className={styles.whyIntro}>We're not just designers — we own the entire supply chain. That means better quality at a fraction of the cost.</p>
              <ul className={styles.whyList}>
                {[
                  { icon: "🏭", title: "Own Manufacturing Factory", desc: "Direct production cuts cost by up to 40% vs. outsourced work." },
                  { icon: "🎯", title: "Dedicated Project Manager", desc: "One point of contact from brief to handover." },
                  { icon: "⏱️", title: "On-Time Guarantee", desc: "We've never missed a deadline in 20+ years." },
                  { icon: "🌿", title: "Sustainable Materials", desc: "Eco-certified materials that look premium and last longer." },
                ].map((f) => (
                  <li key={f.title} className={styles.whyFeature}>
                    <div className={styles.whyIcon}>{f.icon}</div>
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.whyImage}>
              <Image
                src="/images/projects/home-4.png"
                alt="ArtTech24 quality interiors"
                fill
                style={{ objectFit: "cover", borderRadius: "var(--radius-lg)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── AI DESIGN GENERATOR CTA ── */}
      <section className="section-pad">
        <div className="container">
          <div className={styles.aiCtaBanner}>
            <div className={styles.aiCtaContent}>
              <span className="section-eyebrow">✨ Powered by Google Gemini AI</span>
              <h2>See Your Space Transformed in 60 Seconds</h2>
              <p>
                Upload your space photos or start from scratch — our AI generates 2
                photorealistic design concepts tailored to your business type and
                style. First design is completely free.
              </p>
              <div className={styles.aiCtaBadges}>
                <span>✅ Free first generation</span>
                <span>✅ Bakery · Restaurant · Café · Hotel · Jewellery · Theater</span>
                <span>✅ Luxury · Premium · Classic · Modern · Traditional</span>
              </div>
              <div className={styles.aiCtaActions}>
                <TrackedLink
                  href="/ai-design"
                  className="btn btn-primary btn-lg"
                  path="/"
                  section="ai_cta"
                  target="/ai-design"
                  label="Try AI Design Generator"
                >
                  ✨ Try AI Design Generator — Free
                </TrackedLink>
              </div>
            </div>
            <div className={styles.aiCtaVisual}>
              <div className={styles.aiCtaCard}>
                <div className={styles.aiCtaCardTop}>
                  <span className={styles.aiCtaCardDot} style={{ background: "#ef4444" }} />
                  <span className={styles.aiCtaCardDot} style={{ background: "#f59e0b" }} />
                  <span className={styles.aiCtaCardDot} style={{ background: "#22c55e" }} />
                </div>
                <div className={styles.aiCtaMockup}>
                  <div className={styles.aiMockStep}>📷 Upload space photos</div>
                  <div className={styles.aiMockStep}>🏪 Select space type</div>
                  <div className={styles.aiMockStep}>👑 Choose design style</div>
                  <div className={`${styles.aiMockStep} ${styles.aiMockGenerate}`}>
                    ✨ Generate 2 AI Designs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className={`cta-section ${styles.ctaSection}`}>
        <div className={`container cta-inner ${styles.ctaInner}`}>
          <h2>Ready to Transform Your Space?</h2>
          <p>Get a free cost estimate in under 2 minutes. No commitment required.</p>
          <div className={styles.ctaButtons}>
            <TrackedLink href="/calculator" className="btn btn-primary btn-lg" path="/" section="bottom_cta" target="/calculator" label="Calculate Cost Now">
              🧮 Calculate Cost Now
            </TrackedLink>
            <a href="https://wa.me/919597217144" target="_blank" rel="noopener noreferrer" className="btn btn-outline-white btn-lg">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
