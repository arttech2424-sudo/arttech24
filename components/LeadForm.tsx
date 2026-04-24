"use client";

import { FormEvent, useState } from "react";

type LeadFormProps = {
  source?: string;
  defaults?: Record<string, string | number | undefined>;
  title?: string;
  onSuccess?: () => void;
};

export function LeadForm({ source = "website", defaults, title, onSuccess }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      location: String(formData.get("location") || ""),
      email: String(formData.get("email") || ""),
      source,
      ...defaults,
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setMessage("Thanks! Our team will call you soon.");
      event.currentTarget.reset();
      onSuccess?.();
    } else {
      setMessage("Unable to submit right now. Please try WhatsApp.");
    }

    setLoading(false);
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      {title ? <h3 style={{marginBottom:"14px",fontSize:"1.15rem",color:"var(--dark)"}}>{title}</h3> : null}
      <input name="name" placeholder="Full Name *" required />
      <input name="phone" placeholder="Phone Number *" required type="tel" />
      <input name="location" placeholder="City / Location *" required />
      <input name="email" placeholder="Email (optional)" type="email" />
      <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center"}} disabled={loading} type="submit">
        {loading ? "Submitting…" : "Get Free Consultation →"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
