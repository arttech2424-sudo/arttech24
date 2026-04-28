"use client";

import { useState, useRef, ChangeEvent } from "react";
import styles from "./LuxDesigner.module.css";

type DesignStyle = "Premium" | "Classic" | "Luxury" | "Modern" | "Traditional";
type SpaceType = "Shop" | "Restaurant" | "Bakery" | "Coffee Shop" | "Theater" | "Gallery" | "Home" | "Office";

interface Settings {
  style: DesignStyle;
  spaceType: SpaceType;
  squareFeet: string;
}

const SPACE_TYPES: SpaceType[] = ["Shop", "Restaurant", "Bakery", "Coffee Shop", "Theater", "Gallery", "Home", "Office"];
const STYLES: DesignStyle[] = ["Premium", "Classic", "Luxury", "Modern", "Traditional"];

export function LuxDesigner() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    style: "Modern",
    spaceType: "Restaurant",
    squareFeet: "1000",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const compressImage = (dataUrl: string): Promise<string> =>
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
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82).split(",")[1]);
      };
      img.src = dataUrl;
    });

  const generate = async () => {
    if (!previewImage) return;
    setIsGenerating(true);
    setError(null);
    setStep(3);
    try {
      const base64 = await compressImage(previewImage);
      const res = await fetch("/api/ai-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceType: settings.spaceType,
          sqft: Number(settings.squareFeet) || 1000,
          designStyle: settings.style,
          images: [base64],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed");
      const img = data.images?.[0];
      if (!img?.data) throw new Error("No image returned");
      setGeneratedImage(`data:${img.mimeType || "image/png"};base64,${img.data}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.");
      setStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setPreviewImage(null);
    setGeneratedImage(null);
    setStep(1);
    setError(null);
    setSettings({ style: "Modern", spaceType: "Restaurant", squareFeet: "1000" });
  };

  const download = () => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `arttech-ai-design-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className={styles.shell}>

      {/* â”€â”€ STEP 1: Upload â”€â”€ */}
      {step === 1 && (
        <div className={styles.stepUpload}>
          <div className={styles.badge}>Step 01 / Upload Your Space</div>
          <h2 className={styles.headline}>
            Transform your <em>vision</em> into reality.
          </h2>
          <p className={styles.subtext}>
            Upload a photo of your space and let AI reimagine it with luxury
            finishes and sophisticated styling.
          </p>

          <div
            className={styles.uploadZone}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          >
            <div className={styles.uploadIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className={styles.uploadText}>Drop image or click to upload</p>
            <p className={styles.uploadHint}>Supports JPG, PNG, WEBP Â· up to 10MB</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className={styles.hiddenInput}
              accept="image/*"
            />
          </div>

          <div className={styles.stylePreviewRow}>
            {STYLES.map((s) => (
              <div key={s} className={styles.stylePreviewItem}>
                <span className={styles.stylePreviewName}>{s}</span>
                <span className={styles.stylePreviewLabel}>Style</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* â”€â”€ STEP 2: Settings â”€â”€ */}
      {step === 2 && (
        <div className={styles.stepSettings}>
          <div>
            <button className={styles.backBtn} onClick={() => setStep(1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <div className={styles.badge}>Step 02 / Refine Details</div>
            <h2 className={`${styles.headline} ${styles.headlineSm}`}>
              <em>Customize</em> your aesthetic.
            </h2>

            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.card}>
              <div className={styles.field}>
                <label className={styles.label}>Space Type</label>
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

              <div className={styles.field}>
                <label className={styles.label}>Design Style</label>
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

              <div className={styles.field}>
                <label className={styles.label}>Estimated Area</label>
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

              <button className={styles.generateBtn} onClick={generate}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate AI Design
              </button>
            </div>
          </div>

          <div className={styles.previewCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage!} alt="Your space" className={styles.previewImg} />
            <div className={styles.previewOverlay}>
              <p className={styles.previewTag}>Your original space</p>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ STEP 3: Result â”€â”€ */}
      {step === 3 && (
        <div>
          <div className={styles.resultHeader}>
            <div>
              <div className={styles.badge}>Step 03 / AI Masterpiece</div>
              <h2 className={`${styles.headline} ${styles.headlineSm}`}>
                <em>Your reinvented space</em> is ready.
              </h2>
            </div>
            {!isGenerating && (
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
                  Download Render
                </button>
              </div>
            )}
          </div>

          <div className={styles.comparison}>
            <div className={styles.compareCol}>
              <p className={styles.compareLabel}>Before</p>
              <div className={`${styles.compareImgWrap} ${styles.compareImgWrapBefore}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewImage!} alt="Original space" className={styles.compareImg} />
              </div>
            </div>

            <div className={styles.compareCol}>
              <div className={styles.compareLabelRow}>
                <p className={styles.compareLabel}>After AI Reinvention</p>
                {isGenerating && (
                  <span className={styles.renderingTag}>
                    <span className={styles.spinner} /> Renderingâ€¦
                  </span>
                )}
              </div>
              <div className={styles.compareImgWrap}>
                {isGenerating ? (
                  <div className={styles.loadingState}>
                    <div className={styles.loaderRing} />
                    <p className={styles.loaderText}>
                      <em>Analyzing geometry and lightâ€¦</em>
                    </p>
                    <p className={styles.loaderHint}>
                      AI Architect is rendering your vision
                    </p>
                  </div>
                ) : generatedImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={generatedImage} alt="AI generated design" className={styles.compareImg} />
                    <div className={styles.resultBadge}>
                      <span className={styles.aiTag}>AI Render</span>
                      <span className={styles.resultMeta}>
                        {settings.style} Â· {settings.spaceType} Â· {settings.squareFeet} sq ft
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {!isGenerating && generatedImage && (
            <div className={styles.whatsappRow}>
              <p>
                Love the concept? Get a <strong>free consultation</strong> with
                our designers.
              </p>
              <a
                href={`https://wa.me/919597217144?text=${encodeURIComponent(
                  "Hi ArtTech! I tried the AI Design Generator and loved the concept. Can we discuss a project?"
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
    </div>
  );
}
