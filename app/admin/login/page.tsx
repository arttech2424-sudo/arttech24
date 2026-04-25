"use client";

import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="container page-section admin-login">
      <h1>Admin Login</h1>
      <p>Continue with Google to access the ArtTech24 admin dashboard.</p>

      <Link className="btn" href="/api/auth/signin/google?callbackUrl=/admin" style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.6C16.8 2.9 14.6 2 12 2 6.9 2 2.8 6.3 2.8 11.8S6.9 21.5 12 21.5c6.9 0 9.2-4.9 9.2-7.4 0-.5-.1-.9-.1-1.3H12z"/>
        </svg>
        Continue with Google
      </Link>
    </main>
  );
}
