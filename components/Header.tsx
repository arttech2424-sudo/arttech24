"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/trackEvent";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Our Work" },
  { href: "/explore", label: "Explore Ideas" },
  { href: "/blog", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          Art<span>Tech</span>24
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
            href="/admin/login"
            className="nav-profile"
            aria-label="Google admin login"
            title="Google admin login"
            onClick={() => trackEvent({ path: "/", event: "click", section: "header_nav", target: "/admin/login", label: "Google Admin Login" })}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.6C16.8 2.9 14.6 2 12 2 6.9 2 2.8 6.3 2.8 11.8S6.9 21.5 12 21.5c6.9 0 9.2-4.9 9.2-7.4 0-.5-.1-.9-.1-1.3H12z"/>
            </svg>
          </Link>
          <Link
            href="/calculator"
            className="btn btn-primary btn-sm"
            onClick={() => trackEvent({ path: "/", event: "click", section: "header_cta", target: "/calculator", label: "Get Free Estimate" })}
          >
            Get Free Estimate
          </Link>
        </div>

        <div className="nav-actions-mobile">
          <Link
            href="/admin/login"
            className="icon-btn"
            aria-label="Google admin login"
            title="Google admin login"
            onClick={() => trackEvent({ path: "/", event: "click", section: "mobile_nav", target: "/admin/login", label: "Google Admin Login" })}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.6C16.8 2.9 14.6 2 12 2 6.9 2 2.8 6.3 2.8 11.8S6.9 21.5 12 21.5c6.9 0 9.2-4.9 9.2-7.4 0-.5-.1-.9-.1-1.3H12z"/>
            </svg>
          </Link>
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

        </nav>
      </div>
    </header>
  );
}
