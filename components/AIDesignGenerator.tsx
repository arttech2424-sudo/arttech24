"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";

// ── Types ──────────────────────────────────────────────────────────────────
type DesignStyle = "Luxury" | "Premium" | "Classic" | "Modern" | "Traditional";
type SpaceType =
  | "Bakery"
  | "Restaurant"
  | "Jewellery Shop"
  | "Coffee Shop"
  | "Theater"
  | "Home"
  | "Others";

interface FormState {
  uploadedFiles: File[];
  spaceType: SpaceType | "";
  sqft: number;
  designStyle: DesignStyle | "";
  customPrompt: string;
}

// ── Step config ────────────────────────────────────────────────────────────
const SPACE_TYPES: { value: SpaceType; icon: string; sub: string }[] = [
  { value: "Bakery", icon: "🥐", sub: "Bakery / Patisserie" },
  { value: "Restaurant", icon: "🍽️", sub: "Dine-in / Fine dining" },
  { value: "Jewellery Shop", icon: "💎", sub: "Jewellery / Luxury retail" },
  { value: "Coffee Shop", icon: "☕", sub: "Café / Bistro" },
  { value: "Theater", icon: "🎭", sub: "Theater / Mall / Events" },
  { value: "Home", icon: "🏠", sub: "Residential interior" },
  { value: "Others", icon: "✨", sub: "Other commercial space" },
];

const DESIGN_STYLES: {
  value: DesignStyle;
  icon: string;
  desc: string;
  color: string;
}[] = [
  { value: "Luxury", icon: "👑", desc: "Gold accents, marble, opulent", color: "#b8901e" },
  { value: "Premium", icon: "⭐", desc: "Refined, high-end finishes", color: "#7c5cbf" },
  { value: "Classic", icon: "🏛️", desc: "Timeless, ornate, symmetrical", color: "#8b5e3c" },
  { value: "Modern", icon: "🔷", desc: "Clean lines, minimalist", color: "#1a7abf" },
  { value: "Traditional", icon: "🌿", desc: "Warm, heritage, earthy tones", color: "#3d7a4a" },
];

// ── Image helpers ──────────────────────────────────────────────────────────
/** Compress + resize a File to JPEG base64 (no data: prefix) */
async function fileToCompressedBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      resolve(dataUrl.split(",")[1]); // strip "data:image/jpeg;base64,"
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Overlay brand logo watermark on a base64 image, return dataURL */
async function addWatermark(base64: string, mimeType: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const mainImg = new window.Image();
    mainImg.crossOrigin = "anonymous";

    mainImg.onload = () => {
      canvas.width = mainImg.width;
      canvas.height = mainImg.height;
      ctx.drawImage(mainImg, 0, 0);

      const logo = new window.Image();
      logo.onload = () => {
        const logoW = Math.round(canvas.width * 0.16);
        const logoH = Math.round((logo.height / logo.width) * logoW);
        const pad = Math.round(canvas.width * 0.015);
        const x = canvas.width - logoW - pad;
        const y = canvas.height - logoH - pad;

        // semi-transparent white pill behind logo
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = "#ffffff";
        const r = 8;
        ctx.beginPath();
        ctx.roundRect(x - 8, y - 6, logoW + 16, logoH + 12, r);
        ctx.fill();
        ctx.restore();

        ctx.globalAlpha = 0.9;
        ctx.drawImage(logo, x, y, logoW, logoH);
        ctx.globalAlpha = 1;

        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      logo.onerror = () => resolve(`data:${mimeType};base64,${base64}`);
      logo.src = "/logo-01.png";
    };

    mainImg.onerror = () => resolve(`data:${mimeType};base64,${base64}`);
    mainImg.src = `data:${mimeType};base64,${base64}`;
  });
}

// ── Main component ─────────────────────────────────────────────────────────
export function AIDesignGenerator() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [form, setForm] = useState<FormState>({
    uploadedFiles: [],
    spaceType: "",
    sqft: 500,
    designStyle: "",
    customPrompt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ dataUrl: string }[]>([]);
  const [generationCount, setGenerationCount] = useState(0);
  const [showLeadGate, setShowLeadGate] = useState(false);
  const [leadDone, setLeadDone] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File upload handler ──────────────────────────────────────────────────
  function handleFiles(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    setForm((p) => ({
      ...p,
      uploadedFiles: [...p.uploadedFiles, ...valid].slice(0, 5),
    }));
  }

  function removeFile(idx: number) {
    setForm((p) => ({
      ...p,
      uploadedFiles: p.uploadedFiles.filter((_, i) => i !== idx),
    }));
  }

  // ── Generate ─────────────────────────────────────────────────────────────
  async function generate() {
    // gate: only first generation is free
    if (generationCount > 0 && !leadDone) {
      setShowLeadGate(true);
      return;
    }

    if (!form.spaceType || !form.designStyle) {
      setError("Please complete all selections before generating.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      // compress uploaded images to base64
      const images: string[] = [];
      for (const file of form.uploadedFiles.slice(0, 3)) {
        images.push(await fileToCompressedBase64(file));
      }

      const res = await fetch("/api/ai-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceType: form.spaceType,
          sqft: form.sqft,
          designStyle: form.designStyle,
          customPrompt: form.customPrompt || undefined,
          images: images.length ? images : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.images) {
        throw new Error(data.error ?? "Generation failed. Please try again.");
      }

      // add watermark to each image
      const watermarked = await Promise.all(
        (data.images as { data: string; mimeType: string }[]).map((img) =>
          addWatermark(img.data, img.mimeType)
        )
      );

      setResults(watermarked.map((dataUrl) => ({ dataUrl })));
      setGenerationCount((c) => c + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function downloadImage(dataUrl: string, idx: number) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `arttech-design-variation-${idx + 1}.jpg`;
    a.click();
  }

  function regenerate() {
    if (generationCount > 0 && !leadDone) {
      setShowLeadGate(true);
    } else {
      generate();
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const TOTAL_STEPS = 4;

  return (
    <div className="ai-gen-shell">
      {/* ── Lead Gate Modal ── */}
      {showLeadGate && (
        <div className="ai-lead-backdrop">
          <div className="ai-lead-modal">
            <button
              className="ai-lead-close"
              onClick={() => setShowLeadGate(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="ai-lead-icon">✨</div>
            <h3>Get Unlimited AI Designs</h3>
            <p>
              Your first design is free! Leave your contact details and our
              team will call you with a personalised quote — plus unlock
              unlimited AI design generations.
            </p>
            <LeadForm
              source="ai_design_gate"
              title=""
              onSuccess={() => {
                setLeadDone(true);
                setShowLeadGate(false);
                generate();
              }}
            />
          </div>
        </div>
      )}

      {/* ── Step Progress ── */}
      {results.length === 0 && (
        <div className="ai-progress">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="ai-prog-item">
              <div
                className={`ai-prog-dot ${step > n ? "done" : step === n ? "active" : ""}`}
              >
                {step > n ? "✓" : n}
              </div>
              {n < TOTAL_STEPS && (
                <div className={`ai-prog-line ${step > n ? "done" : ""}`} />
              )}
            </div>
          ))}
          <span className="ai-prog-label">
            {["Upload Space Photos", "Choose Space Type", "Size & Style", "Generate"][step - 1]}
          </span>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 1 – Upload photos
      ═══════════════════════════════════════════════════════════════ */}
      {results.length === 0 && step === 1 && (
        <div className="ai-step">
          <p className="ai-step-num">Step 1 of 4</p>
          <h2 className="ai-step-title">Upload Your Space Photos</h2>
          <p className="ai-step-sub">
            Upload photos of your existing or empty space for an AI redesign, or
            skip to generate from scratch.
          </p>

          <div
            className="ai-upload-zone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="ai-upload-icon">📷</div>
            <p className="ai-upload-label">
              Drag & drop or <span>click to upload</span>
            </p>
            <p className="ai-upload-hint">JPG, PNG, WEBP · up to 5 photos</p>
          </div>

          {form.uploadedFiles.length > 0 && (
            <div className="ai-preview-row">
              {form.uploadedFiles.map((file, i) => (
                <div key={i} className="ai-preview-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`upload ${i + 1}`}
                  />
                  <button
                    className="ai-preview-remove"
                    onClick={() => removeFile(i)}
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="ai-nav">
            <button
              className="btn btn-ghost"
              onClick={() => setStep(2)}
            >
              Skip — generate from scratch
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(2)}
              disabled={form.uploadedFiles.length === 0}
            >
              Next — Choose Space Type →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 2 – Space type
      ═══════════════════════════════════════════════════════════════ */}
      {results.length === 0 && step === 2 && (
        <div className="ai-step">
          <p className="ai-step-num">Step 2 of 4</p>
          <h2 className="ai-step-title">What Kind of Space Is This?</h2>
          <p className="ai-step-sub">Select the type that best describes your business.</p>

          <div className="ai-option-grid">
            {SPACE_TYPES.map((s) => (
              <button
                key={s.value}
                className={`ai-option-card ${form.spaceType === s.value ? "selected" : ""}`}
                onClick={() => setForm((p) => ({ ...p, spaceType: s.value }))}
              >
                <span className="ai-opt-icon">{s.icon}</span>
                <span className="ai-opt-label">{s.value}</span>
                <span className="ai-opt-sub">{s.sub}</span>
              </button>
            ))}
          </div>

          <div className="ai-nav">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(3)}
              disabled={!form.spaceType}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 3 – Sqft + Design style
      ═══════════════════════════════════════════════════════════════ */}
      {results.length === 0 && step === 3 && (
        <div className="ai-step">
          <p className="ai-step-num">Step 3 of 4</p>
          <h2 className="ai-step-title">Size &amp; Design Style</h2>

          {/* Sqft */}
          <p className="ai-field-label">How large is the space?</p>
          <div className="ai-sqft-row">
            <input
              type="number"
              min={50}
              max={50000}
              value={form.sqft}
              onChange={(e) =>
                setForm((p) => ({ ...p, sqft: Number(e.target.value) || 100 }))
              }
              className="ai-sqft-input"
            />
            <span className="ai-sqft-unit">sq ft</span>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={50}
            value={form.sqft}
            onChange={(e) =>
              setForm((p) => ({ ...p, sqft: Number(e.target.value) }))
            }
            className="ai-range"
          />
          <div className="ai-range-labels">
            <span>100 sq ft</span><span>10,000 sq ft</span>
          </div>

          {/* Design Style */}
          <p className="ai-field-label" style={{ marginTop: 28 }}>
            What design style are you looking for?
          </p>
          <div className="ai-style-grid">
            {DESIGN_STYLES.map((s) => (
              <button
                key={s.value}
                className={`ai-style-card ${form.designStyle === s.value ? "selected" : ""}`}
                style={
                  form.designStyle === s.value
                    ? { borderColor: s.color, background: s.color + "18" }
                    : {}
                }
                onClick={() => setForm((p) => ({ ...p, designStyle: s.value }))}
              >
                <span className="ai-style-icon">{s.icon}</span>
                <span className="ai-style-name" style={{ color: form.designStyle === s.value ? s.color : undefined }}>
                  {s.value}
                </span>
                <span className="ai-style-desc">{s.desc}</span>
              </button>
            ))}
          </div>

          <div className="ai-nav">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(4)}
              disabled={!form.designStyle}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 4 – Review + Custom prompt + Generate
      ═══════════════════════════════════════════════════════════════ */}
      {results.length === 0 && step === 4 && (
        <div className="ai-step">
          <p className="ai-step-num">Step 4 of 4</p>
          <h2 className="ai-step-title">Review &amp; Generate</h2>

          {/* Summary chips */}
          <div className="ai-summary">
            {form.spaceType && (
              <span className="ai-chip">
                {SPACE_TYPES.find((s) => s.value === form.spaceType)?.icon}{" "}
                {form.spaceType}
              </span>
            )}
            <span className="ai-chip">📐 {form.sqft.toLocaleString()} sq ft</span>
            {form.designStyle && (
              <span className="ai-chip">
                {DESIGN_STYLES.find((s) => s.value === form.designStyle)?.icon}{" "}
                {form.designStyle}
              </span>
            )}
            {form.uploadedFiles.length > 0 && (
              <span className="ai-chip">
                📷 {form.uploadedFiles.length} photo{form.uploadedFiles.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Custom prompt */}
          <p className="ai-field-label" style={{ marginTop: 20 }}>
            Any specific requirements? <em style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</em>
          </p>
          <textarea
            className="ai-custom-prompt"
            placeholder="e.g. Add a feature wall with greenery, use blue and gold colour palette, include a separate VIP section..."
            value={form.customPrompt}
            onChange={(e) =>
              setForm((p) => ({ ...p, customPrompt: e.target.value }))
            }
            rows={3}
          />

          {error && <p className="ai-error">{error}</p>}

          <p className="ai-free-note">
            ✨ First generation is <strong>free</strong> — no sign-up needed.
          </p>

          <div className="ai-nav">
            <button className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
            <button
              className="btn btn-primary btn-lg ai-gen-btn"
              onClick={generate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="ai-spinner" /> Generating designs…
                </>
              ) : (
                "✨ Generate 2 AI Designs"
              )}
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          RESULTS
      ═══════════════════════════════════════════════════════════════ */}
      {results.length > 0 && (
        <div className="ai-results">
          <div className="ai-results-header">
            <h2>Your AI Interior Design Concepts</h2>
            <p>
              2 unique variations based on your selections.{" "}
              {form.spaceType} · {form.sqft.toLocaleString()} sq ft ·{" "}
              {form.designStyle} style
            </p>
          </div>

          <div className="ai-results-grid">
            {results.map((r, i) => (
              <div key={i} className="ai-result-card">
                <div className="ai-result-badge">Variation {i === 0 ? "A" : "B"}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.dataUrl}
                  alt={`AI design variation ${i + 1}`}
                  className="ai-result-img"
                />
                <div className="ai-result-footer">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => downloadImage(r.dataUrl, i)}
                  >
                    ⬇ Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="ai-results-actions">
            <button className="btn btn-primary" onClick={regenerate}>
              {generationCount > 0 && !leadDone ? "🔒 Generate Again (Free After Sign-up)" : "🔄 Generate New Variations"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setResults([]);
                setStep(1);
                setForm({
                  uploadedFiles: [],
                  spaceType: "",
                  sqft: 500,
                  designStyle: "",
                  customPrompt: "",
                });
              }}
            >
              Start Over
            </button>
            <a
              href={`https://wa.me/919597217144?text=Hi ArtTech, I used your AI design tool for a ${form.spaceType} (${form.sqft} sqft, ${form.designStyle} style). I'd like a real quote!`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ background: "#25D366", borderColor: "#25D366" }}
            >
              📲 Get Real Quote on WhatsApp
            </a>
          </div>

          <p className="ai-watermark-note">
            Images include ArtTech watermark. Contact us to receive
            high-resolution watermark-free renders.
          </p>
        </div>
      )}
    </div>
  );
}
