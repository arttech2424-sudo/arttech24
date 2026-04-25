"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type LoginMode = "google" | "otp";

export default function AdminLoginPage() {
  const [mode, setMode] = useState<LoginMode>("google");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", phone }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setStatus(data.error || "Could not send OTP.");
      } else {
        setStatus(data.message || "OTP sent.");
      }
    } catch {
      setStatus("Could not send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", phone, otp }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus(data.error || "OTP verification failed.");
      } else {
        window.location.href = "/admin";
      }
    } catch {
      setStatus("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container page-section admin-login">
      <h1>Admin Login</h1>
      <p>Use Google sign-in (yamunaprabhu89@gmail.com) or mobile OTP (+91 9597217144) to access the ArtTech24 dashboard.</p>

      <div className="toggle-options" style={{ maxWidth: 420, margin: "0 auto 14px" }}>
        <button
          type="button"
          className={`toggle-btn ${mode === "google" ? "selected" : ""}`}
          onClick={() => setMode("google")}
        >
          Google
        </button>
        <button
          type="button"
          className={`toggle-btn ${mode === "otp" ? "selected" : ""}`}
          onClick={() => setMode("otp")}
        >
          Mobile OTP
        </button>
      </div>

      {mode === "google" ? (
        <Link className="btn" href="/api/auth/signin/google?callbackUrl=/admin">
          Continue with Google
        </Link>
      ) : (
        <div className="card" style={{ maxWidth: 420, margin: "0 auto", textAlign: "left" }}>
          <form className="lead-form" onSubmit={sendOtp}>
            <label className="toggle-label" htmlFor="phone">Mobile Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+919597217144"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          <form className="lead-form" onSubmit={verifyOtp} style={{ marginTop: 14 }}>
            <label className="toggle-label" htmlFor="otp">Enter OTP</label>
            <input
              id="otp"
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify and Continue"}
            </button>
          </form>
        </div>
      )}

      {status ? <p className="form-message" style={{ marginTop: 14 }}>{status}</p> : null}
    </main>
  );
}
