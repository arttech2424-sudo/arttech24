"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { VisitorTracker } from "@/components/VisitorTracker";

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

export default function ExplorePage() {
  const [showPopup, setShowPopup] = useState(false);
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
