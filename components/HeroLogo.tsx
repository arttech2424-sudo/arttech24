"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/page.module.css";

export function HeroLogo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SCROLL_START = 60;
    const SCROLL_END = 340;

    const onScroll = () => {
      if (!ref.current) return;
      const scroll = window.scrollY;
      const progress = Math.min(
        Math.max((scroll - SCROLL_START) / (SCROLL_END - SCROLL_START), 0),
        1
      );
      const opacity = 1 - progress;
      const scale = 1 - progress * 0.22;
      const translateY = -progress * 28;

      ref.current.style.opacity = String(opacity);
      ref.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={styles.heroLogoBrand}
      style={{ transformOrigin: "left center", willChange: "transform, opacity" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-hero.svg"
        alt="ArtTech"
        className={styles.heroLogoImg}
      />
    </div>
  );
}
