"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/trackEvent";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Our Work" },
  { href: "/ai-design", label: "✨ AI Design" },
  { href: "/explore", label: "Explore Ideas" },
  { href: "/blog", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 280);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link
          href="/"
          className="nav-logo-link"
          aria-label="ArtTech Home"
          style={{
            opacity: scrolled ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: scrolled ? "auto" : "none",
          }}
        >
          <Image
            src="/logo-01.png"
            alt="ArtTech logo"
            width={140}
            height={48}
            priority
            style={{ height: 44, width: "auto", objectFit: "contain" }}
          />
        </Link>
        <nav className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() =>
                trackEvent({
                  path: "/",
                  event: "click",
                  section: "header_nav",
                  target: link.href,
                  label: link.label,
                })
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions-desktop">
          <Link
            href="/calculator"
            className="btn btn-primary btn-sm"
            onClick={() => trackEvent({ path: "/", event: "click", section: "header_cta", target: "/calculator", label: "Get Free Estimate" })}
          >
            Get Free Estimate
          </Link>
        </div>

        <div className="nav-actions-mobile">
          <button
            type="button"
            className="icon-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <Link
            href="/calculator"
            className="btn btn-primary btn-sm nav-mobile-estimate"
            onClick={() => {
              setOpen(false);
              trackEvent({ path: "/", event: "click", section: "mobile_nav", target: "/calculator", label: "Get Free Estimate" });
            }}
          >
            Get Free Estimate
          </Link>
        </div>
      </div>

      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        <nav className="mobile-nav-links" onClick={() => setOpen(false)}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() =>
                trackEvent({
                  path: "/",
                  event: "click",
                  section: "mobile_nav",
                  target: link.href,
                  label: link.label,
                })
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="mobile-admin-link"
            onClick={() =>
              trackEvent({ path: "/", event: "click", section: "mobile_nav", target: "/admin/login", label: "Admin Login" })
            }
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
