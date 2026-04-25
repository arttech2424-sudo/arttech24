import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { VisitorTracker } from "@/components/VisitorTracker";

export const metadata: Metadata = {
  title: "Contact Commercial Interior Designers | ArtTech24",
  description: "Contact ArtTech24 for cafe, restaurant, bakery, hotel, office, and retail interior design projects.",
};

export default function ContactPage() {
  return (
    <main className="container page-section">
      <VisitorTracker path="/contact" />
      <h1>Contact ArtTech24</h1>
      <p className="page-intro">Tell us your business type, location, and timeline. We will call you quickly.</p>

      <div className="contact-grid">
        <LeadForm source="contact" title="Get a Free Commercial Consultation" />
        <div className="card">
          <h3>Direct Contact</h3>
          <p>Phone: <a href="tel:+919597217144">+91 9597217144</a></p>
          <p>Email: yamunaprabhu89@gmail.com</p>
          <p>WhatsApp: <a href="https://wa.me/919597217144" target="_blank" rel="noopener noreferrer">+91 9597217144</a></p>
          <p><strong>Office Addresses</strong></p>
          <p>Chennai: Guindy, Chennai, Tamil Nadu</p>
          <p>Coimbatore: Gandhipuram, Coimbatore, Tamil Nadu</p>
          <p>Bangalore: Indiranagar, Bengaluru, Karnataka</p>
          <p>Serving South India and global commercial projects.</p>
          <iframe
            title="ArtTech24 Map"
            src="https://www.google.com/maps?q=Chennai&output=embed"
            loading="lazy"
            className="map-frame"
          />
        </div>
      </div>
    </main>
  );
}
