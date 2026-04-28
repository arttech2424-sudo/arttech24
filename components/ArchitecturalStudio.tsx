"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import styles from "./ArchitecturalStudio.module.css";

// ── Types ──────────────────────────────────────────────────────────────────
type DesignStyle = "Premium" | "Classic" | "Luxury" | "Modern" | "Traditional";
type SpaceType =
  | "Hotel" | "Restaurant" | "Bakery" | "Coffee Shop" | "Theater"
  | "Parlor" | "Gallery" | "Shop" | "Home" | "Office";
type ColorPalette =
  | "Warm Neutrals" | "Deep Forest" | "Midnight Soul"
  | "Minimalist Gray" | "Desert Sands" | "Royal Velvet";

interface Settings {
  style: DesignStyle;
  spaceType: SpaceType;
  squareFeet: string;
  colorPalette: ColorPalette;
}

// ── Constants ──────────────────────────────────────────────────────────────
const SPACE_TYPES: SpaceType[] = [
  "Hotel", "Restaurant", "Bakery", "Coffee Shop",
  "Theater", "Parlor", "Gallery", "Shop", "Home", "Office",
];
const STYLES: DesignStyle[] = ["Premium", "Classic", "Luxury", "Modern", "Traditional"];
const PALETTES: { label: ColorPalette; color: string }[] = [
  { label: "Warm Neutrals",  color: "#d2b48c" },
  { label: "Deep Forest",    color: "#228b22" },
  { label: "Midnight Soul",  color: "#191970" },
  { label: "Minimalist Gray",color: "#808080" },
  { label: "Desert Sands",   color: "#edc9af" },
  { label: "Royal Velvet",   color: "#4b0082" },
];

// ── Component ──────────────────────────────────────────────────────────────
export function ArchitecturalStudio() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    style: "Modern",
    spaceType: "Restaurant",
    squareFeet: "1000",
    colorPalette: "Warm Neutrals",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Image helpers ─────────────────────────────────────────────────────
  const compressImage = (dataUrl: string): Promise<{ base64: string; mimeType: string }> =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 1024;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        const jpeg = canvas.toDataURL("image/jpeg", 0.82);
        resolve({ base64: jpeg.split(",")[1], mimeType: "image/jpeg" });
      };
      img.src = dataUrl;
    });

  // ── Upload ────────────────────────────────────────────────────────────
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  // ── Generate ──────────────────────────────────────────────────────────
  const generate = async () => {
    if (!previewImage) return;
    setError(null);
    setIsAnalyzing(true);
    setGeneratedImages([]);
    setStep(3);

    let analysisText = "Standard commercial space detected.";

    try {
      // Step 1: Analyze the space
      const { base64, mimeType } = await compressImage(previewImage);
      const analyzeRes = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType }),
      });
      if (analyzeRes.ok) {
        const aData = await analyzeRes.json();
        if (aData.analysis) analysisText = aData.analysis;
      }
      setAnalysis(analysisText);
      setIsAnalyzing(false);
      setIsGenerating(true);

      // Step 2: Generate design
      const genRes = await fetch("/api/ai-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceType: settings.spaceType,
          sqft: Number(settings.squareFeet) || 1000,
          designStyle: settings.style,
          colorPalette: settings.colorPalette,
          spaceAnalysis: analysisText,
          images: [base64],
        }),
      });
      const genData = await genRes.json();
      if (!genRes.ok || !genData.success) throw new Error(genData.error || "Generation failed");

      const imgs: string[] = (genData.images ?? []).map(
        (img: { data: string; mimeType: string }) =>
          `data:${img.mimeType || "image/png"};base64,${img.data}`
      );
      if (imgs.length === 0) throw new Error("No images returned.");

      setGeneratedImages(imgs);
      setActiveResult(0);
      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      if (newCount >= 2) {
        setTimeout(() => setShowModal(true), 1800);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.");
      setStep(2);
    } finally {
      setIsAnalyzing(false);
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setPreviewImage(null); setGeneratedImages([]); setAnalysis(null);
    setStep(1); setError(null); setActiveResult(0);
    setSettings({ style: "Modern", spaceType: "Restaurant", squareFeet: "1000", colorPalette: "Warm Neutrals" });
  };

  const download = () => {
    const img = generatedImages[activeResult];
    if (!img) return;
    const a = document.createElement("a"); a.href = img;
    a.download = `arttech-ai-render-${Date.now()}.png`; a.click();
  };

  // ── Modal submit ──────────────────────────────────────────────────────
  const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        phone: fd.get("phone"),
        email: fd.get("email"),
        spaceType: settings.spaceType,
        message: `AI Design Studio lead — ${settings.style} ${settings.spaceType}, ${settings.squareFeet} sq ft, palette: ${settings.colorPalette}`,
        source: "ai_studio_modal",
      }),
    });
    setModalSubmitted(true);
    setTimeout(() => setShowModal(false), 2800);
  };

  const loadingPhase = isAnalyzing ? "analyzing" : "rendering";

  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className={styles.shell}>

      {/* ── STEP 1: UPLOAD ── */}
      {step === 1 && (
        <div className={styles.stepUpload}>
          <div className={styles.badge}>Step 01 / Visual Input</div>
          <h2 className={styles.headline}>
            Reimagine your space through{" "}
            <em>generative</em> intelligence.
          </h2>
          <p className={styles.subtext}>
            Upload an image of your space — empty shell or existing interior — and
            our AI architect crafts a bespoke photorealistic design masterpiece.
          </p>

          <div
            className={styles.uploadZone}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          >
            <div className={styles.uploadIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <p className={styles.uploadTitle}>Drop high-res capture or click to browse</p>
            <p className={styles.uploadHint}>Supports JPG, PNG, WEBP &middot; up to 15 MB</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className={styles.hiddenInput}
              accept="image/*"
            />
          </div>

          <div className={styles.styleShowcase}>
            {["Luxury", "Classic", "Modern", "Premium"].map((s) => (
              <div key={s} className={styles.styleItem}>
                <span className={styles.styleName}>{s}</span>
                <span className={styles.styleLabel}>Style</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2: SETTINGS ── */}
      {step === 2 && (
        <div className={styles.stepSettings}>
          <div>
            <button className={styles.backBtn} onClick={() => setStep(1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to capture
            </button>
            <div className={styles.badge}>Step 02 / Design Configuration</div>
            <h2 className={`${styles.headline} ${styles.headlineMd}`}>
              Define your <em>architectural intent.</em>
            </h2>

            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.card}>

              {/* Space type */}
              <div className={styles.field}>
                <label className={styles.label}>Functional Intent</label>
                <div className={styles.optionGrid}>
                  {SPACE_TYPES.map((t) => (
                    <button
                      key={t}
                      className={`${styles.optionBtn}${settings.spaceType === t ? ` ${styles.optionBtnActive}` : ""}`}
                      onClick={() => setSettings((s) => ({ ...s, spaceType: t }))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Design style */}
              <div className={styles.field}>
                <label className={styles.label}>Design Philosophy</label>
                <div className={styles.optionGrid}>
                  {STYLES.map((st) => (
                    <button
                      key={st}
                      className={`${styles.optionBtn}${settings.style === st ? ` ${styles.optionBtnActive}` : ""}`}
                      onClick={() => setSettings((s) => ({ ...s, style: st }))}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color palette */}
              <div className={styles.field}>
                <label className={styles.label}>Signature Color Palette</label>
                <div className={styles.paletteGrid}>
                  {PALETTES.map(({ label, color }) => (
                    <button
                      key={label}
                      className={`${styles.paletteBtn}${settings.colorPalette === label ? ` ${styles.paletteBtnActive}` : ""}`}
                      onClick={() => setSettings((s) => ({ ...s, colorPalette: label }))}
                    >
                      {label}
                      <span
                        className={styles.paletteSwatch}
                        style={{ background: color }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div className={styles.field}>
                <label className={styles.label}>Area Metrics</label>
                <div className={styles.sqftWrap}>
                  <input
                    type="number"
                    className={styles.sqftInput}
                    value={settings.squareFeet}
                    onChange={(e) => setSettings((s) => ({ ...s, squareFeet: e.target.value }))}
                    placeholder="e.g. 1500"
                  />
                  <span className={styles.sqftUnit}>SQ FT</span>
                </div>
              </div>

              <button className={styles.generateBtn} onClick={generate} disabled={!previewImage}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate AI Design Plan
              </button>
            </div>
          </div>

          {/* Right: sticky image preview */}
          <div className={styles.previewCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage!} alt="Your space" className={styles.previewImg} />
            <div className={styles.previewOverlay}>
              <p className={styles.previewTag}>Original Architecture</p>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: RESULT ── */}
      {step === 3 && (
        <div>
          <div className={styles.resultHeader}>
            <div>
              <div className={styles.badge}>Step 03 / AI Generation Complete</div>
              <h2 className={`${styles.headline} ${styles.headlineMd}`}>
                Architecture <em>Reinvented.</em>
              </h2>
            </div>
            {!isAnalyzing && !isGenerating && generatedImages.length > 0 && (
              <div className={styles.resultActions}>
                <button className={styles.iconBtn} onClick={reset} title="Start over">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                  </svg>
                </button>
                <button className={styles.downloadBtn} onClick={download}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export Render
                </button>
              </div>
            )}
          </div>

          {/* Analysis tag */}
          {analysis && !isAnalyzing && (
            <div className={styles.analysisTag}>
              <span className={styles.analysisTagIcon}>🔍</span>
              {analysis}
            </div>
          )}

          {/* Multi-result tabs (Variation A / B) */}
          {!isAnalyzing && !isGenerating && generatedImages.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {generatedImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveResult(i)}
                  className={`${styles.optionBtn}${activeResult === i ? ` ${styles.optionBtnActive}` : ""}`}
                  style={{ padding: "8px 20px", flex: "0 0 auto" }}
                >
                  Variation {i === 0 ? "A" : "B"}
                </button>
              ))}
            </div>
          )}

          <div className={styles.comparison}>
            {/* Before */}
            <div className={styles.compareCol}>
              <div className={styles.compareLabelRow}>
                <p className={styles.compareLabel}>Captured State</p>
              </div>
              <div className={`${styles.compareImgWrap} ${styles.compareImgWrapBefore}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewImage!} alt="Original space" className={styles.compareImg} />
              </div>
            </div>

            {/* After */}
            <div className={styles.compareCol}>
              <div className={styles.compareLabelRow}>
                <p className={styles.compareLabel}>
                  {isAnalyzing ? "Analyzing space…" : "Final AI Render"}
                </p>
                {(isAnalyzing || isGenerating) && (
                  <span className={styles.renderingTag}>
                    <span className={styles.spinner} />
                    {isAnalyzing ? "Vision Analysis…" : "Rendering…"}
                  </span>
                )}
              </div>
              <div className={styles.compareImgWrap}>
                {isAnalyzing || isGenerating ? (
                  <div className={styles.loadingState}>
                    <div className={styles.loaderRingWrap}>
                      <div className={styles.loaderRingPing} />
                      <div className={styles.loaderRing} />
                    </div>
                    <p className={styles.loaderText}>
                      <em>
                        {loadingPhase === "analyzing"
                          ? "Mapping spatial geometry…"
                          : `Synthesising ${settings.colorPalette} tones…`}
                      </em>
                    </p>
                    <p className={styles.loaderSub}>
                      {loadingPhase === "analyzing"
                        ? "Determining architectural potential"
                        : `Rendering ${settings.style} ${settings.spaceType}`}
                    </p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={generatedImages[activeResult]}
                      alt="AI generated design"
                      className={styles.compareImg}
                    />
                    <div className={styles.resultBadge}>
                      <span className={styles.aiTag}>AI Blueprint</span>
                      <span className={styles.resultMeta}>
                        Palette: {settings.colorPalette}
                      </span>
                      <span className={styles.resultMetaTitle}>
                        {settings.style} {settings.spaceType} / {settings.squareFeet} SQ FT
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* WhatsApp row */}
          {!isAnalyzing && !isGenerating && generatedImages.length > 0 && (
            <div className={styles.whatsappRow}>
              <p>
                Love the concept? Get a <strong>free consultation</strong> with
                our master architects.
              </p>
              <a
                href={`https://wa.me/919597217144?text=${encodeURIComponent(
                  "Hi ArtTech! I used the AI Architectural Studio and loved the design. Can we discuss a project?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                WhatsApp Us
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── CONTACT FORM MODAL ── */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className={styles.modal}>
            <button className={styles.modalCloseBtn} onClick={() => setShowModal(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {modalSubmitted ? (
              <div className={styles.modalSuccess}>
                <div className={styles.successIcon}>✓</div>
                <p className={styles.successTitle}>You&rsquo;re all set!</p>
                <p className={styles.successSub}>Our design team will reach out within 24 hours.</p>
              </div>
            ) : (
              <div className={styles.modalBody}>
                <span className={styles.modalEyebrow}>Exclusive Consultation</span>
                <h3 className={styles.modalTitle}>Bring your vision to life.</h3>
                <p className={styles.modalSub}>
                  You&rsquo;ve explored the possibilities. Let our master architects
                  turn these AI blueprints into a tangible reality.
                </p>

                <form className={styles.modalForm} onSubmit={handleModalSubmit}>
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Full Name</label>
                    <input name="name" type="text" required className={styles.modalInput} placeholder="Your name" />
                  </div>
                  <div className={styles.modalRow}>
                    <div className={styles.modalField}>
                      <label className={styles.modalLabel}>Phone</label>
                      <input name="phone" type="tel" required className={styles.modalInput} placeholder="+91 98765 43210" />
                    </div>
                    <div className={styles.modalField}>
                      <label className={styles.modalLabel}>Email</label>
                      <input name="email" type="email" className={styles.modalInput} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Project Type</label>
                    <select name="projectType" className={styles.modalSelect}>
                      <option>Commercial Transformation</option>
                      <option>Hospitality Design</option>
                      <option>Retail Showroom</option>
                      <option>Residential Luxury</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <button type="submit" className={styles.modalSubmitBtn}>
                    Book Architectural Review
                  </button>
                  <p className={styles.modalDisclaimer}>
                    Our team typically responds within 24 business hours.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
