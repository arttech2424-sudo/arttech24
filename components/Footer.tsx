import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">Art<span style={{color:"#C75B2A"}}>Tech</span>24</Link>
            <p>South India&apos;s premium commercial interior design brand. Factory-direct pricing with uncompromised quality.</p>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            <Link href="/calculator">Cost Calculator</Link>
            <Link href="/portfolio">Our Portfolio</Link>
            <Link href="/explore">Explore Designs</Link>
            <Link href="/blog">Commercial Guides</Link>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <Link href="/contact">Contact Us</Link>
            <Link href="/admin">Admin Panel</Link>
            <p>Founded 2004</p>
            <p>South India</p>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <p><a href="tel:+919597217144">+91 9597217144</a></p>
            <p><a href="https://wa.me/919597217144" target="_blank" rel="noopener noreferrer">WhatsApp Chat</a></p>
            <p>yamunaprabhu89@gmail.com</p>
            <p>Chennai &bull; Coimbatore &bull; Bangalore</p>
            <p>7000+ Projects Delivered</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ArtTech24. All rights reserved.</p>
          <p>Premium Commercial Interiors at Factory Pricing</p>
        </div>
      </div>
    </footer>
  );
}
