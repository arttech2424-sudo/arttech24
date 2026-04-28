import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">

      {/* ── CTA Strip ── */}
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <p className="footer-cta-label">Ready to transform your space?</p>
            <p className="footer-cta-sub">
              Premium interiors at factory-direct pricing.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Get Free Estimate →
          </Link>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo-link">
              Art<span>Tech</span>
            </Link>
            <p>
              South India&apos;s premium commercial interior design brand.
              Factory-direct pricing with uncompromised quality.
            </p>
            <div className="footer-stats">
              <div className="footer-stat">
                <strong>7000+</strong>
                <span>Projects</span>
              </div>
              <div className="footer-stat">
                <strong>20+</strong>
                <span>Years</span>
              </div>
              <div className="footer-stat">
                <strong>3</strong>
                <span>Cities</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h5>Services</h5>
            <Link href="/calculator">Cost Calculator</Link>
            <Link href="/portfolio">Our Portfolio</Link>
            <Link href="/explore">Explore Designs</Link>
            <Link href="/ai-design">AI Design Tool</Link>
            <Link href="/blog">Commercial Guides</Link>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h5>Company</h5>
            <Link href="/contact">Contact Us</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/blog">Blog</Link>
            <p>Founded 2004</p>
            <p>South India</p>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h5>Reach Us</h5>
            <a href="tel:+919597217144">+91 9597217144</a>
            <a
              href="https://wa.me/919597217144"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Chat
            </a>
            <a href="mailto:yamunaprabhu89@gmail.com">
              yamunaprabhu89@gmail.com
            </a>
            <p>Chennai &bull; Coimbatore &bull; Bangalore</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© 2026 ArtTech. All rights reserved.</p>
          <p>Premium Commercial Interiors &middot; South India</p>
        </div>
      </div>
    </footer>
  );
}

