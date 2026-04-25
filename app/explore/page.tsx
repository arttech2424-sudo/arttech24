"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { VisitorTracker } from "@/components/VisitorTracker";
import { trackEvent } from "@/lib/trackEvent";

const gallery = [
  "/images/projects/Tobys-Cafe-for-cafe-inspriation.jpg",
  "/images/projects/Restaurant_4_.jpg",
  "/images/projects/bakery_store_counter_4_.png",
  "/images/projects/perfume_store_design_11_.png",
  "/images/projects/coffee_shop_design_6__3.png",
  "/images/projects/Restaurant_design_3__1.png",
  "/images/projects/gMercato_SansaInteriors_BrunoBelli-4-min.webp",
  "/images/projects/coffee_shop_7_.png",
  "/images/projects/02_48_.jpg",
  "/images/projects/05_42_.jpg",
];

const referenceLinks = [
  {
    title: "Commercial Cafe Moodboard",
    url: "https://www.livspace.com/in/landing-page/home-interiors/chennai",
    image: "/images/projects/Tobys-Cafe-for-cafe-inspriation.jpg",
  },
  {
    title: "Restaurant Ambience Concepts",
    url: "https://www.livspace.com/in/magazine",
    image: "/images/projects/Restaurant_4_.jpg",
  },
  {
    title: "Retail Display Inspiration",
    url: "https://www.livspace.com/in/design-ideas",
    image: "/images/projects/perfume_store_design_11_.png",
  },
];

type InspirationItem = {
  _id?: string;
  title: string;
  image: string;
  url: string;
};

export default function ExplorePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [references, setReferences] = useState(referenceLinks);
  const triggerPoint = useMemo(() => (typeof window !== "undefined" ? window.innerHeight * 4 : 2000), []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > triggerPoint) {
        setShowPopup(true);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [triggerPoint]);

  useEffect(() => {
    fetch("/api/inspirations")
      .then((response) => response.json())
      .then((data: InspirationItem[]) => {
        if (Array.isArray(data) && data.length) {
          setReferences(
            data
              .map((item) => ({
                title: item.title,
                image: item.image,
                url: item.url,
              }))
              .filter((item) => item.title && item.image && item.url)
          );
        }
      })
      .catch(() => {
        // Keep default references if API is unavailable.
      });
  }, []);

  return (
    <main className="container page-section">
      <VisitorTracker path="/explore" />
      <h1>Explore Commercial Interior Design Ideas</h1>
      <p className="page-intro">Browse design references for cafe, restaurant, bakery, hotel, and retail spaces.</p>

      <div className="masonry-grid">
        {gallery.map((image, index) => (
          <Image key={image + index} src={image} alt={`Commercial interior inspiration ${index + 1}`} width={900} height={700} className="masonry-item" />
        ))}
      </div>

      <section className="section-sm">
        <div className="section-heading" style={{ textAlign: "left", marginBottom: 20 }}>
          <p className="section-eyebrow">Reference Board</p>
          <h2>Explore More Design Ideas</h2>
          <p>Curated inspiration links for cafes, restaurants, and retail brand spaces.</p>
        </div>

        <div className="projects-grid">
          {references.map((ref) => (
            <a
              key={ref.url}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card"
              onClick={() =>
                trackEvent({
                  path: "/explore",
                  event: "click",
                  section: "explore_reference",
                  target: ref.url,
                  label: ref.title,
                })
              }
            >
              <div className="project-img-wrap">
                <Image src={ref.image} alt={ref.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="project-card-body">
                <h3>{ref.title}</h3>
                <p>Open reference</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {showPopup ? (
        <div className="popup-backdrop" role="dialog" aria-modal="true">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              Skip
            </button>
            <LeadForm source="explore_popup" title="Want Full Design Catalog + Quote?" />
          </div>
        </div>
      ) : null}
    </main>
  );
}
