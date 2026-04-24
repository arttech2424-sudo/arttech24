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
            <p>+91 90000 00000</p>
            <p>hello@arttech24.com</p>
            <p>1253+ Projects Delivered</p>
            <p>5 Countries Served</p>
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
