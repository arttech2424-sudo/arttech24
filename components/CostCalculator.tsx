"use client";

import { useMemo, useState } from "react";
import type { CalculatorInput } from "@/lib/pricing";
import { estimateCost } from "@/lib/pricing";
import { LeadForm } from "@/components/LeadForm";

const TOTAL_STEPS = 5;

const businessTypes: { value: CalculatorInput["businessType"]; icon: string; sub: string }[] = [
  { value: "Cafe",       icon: "☕", sub: "Coffee shop / Bistro" },
  { value: "Restaurant", icon: "🍽️", sub: "Full-service dining" },
  { value: "Bakery",     icon: "🥐", sub: "Bakery / Dessert café" },
  { value: "Hotel",      icon: "🏨", sub: "Boutique / Budget hotel" },
  { value: "Office",     icon: "💼", sub: "Corporate / Co-working" },
  { value: "Retail",     icon: "🛍️", sub: "Showroom / Store" },
];

const designTiers: { value: CalculatorInput["designTier"]; label: string; desc: string; price: string }[] = [
  { value: "Basic",   label: "Essential",    desc: "Clean, functional design",    price: "₹800–1,000/sqft" },
  { value: "Premium", label: "Premium",      desc: "Refined aesthetics & quality", price: "₹1,100–1,500/sqft" },
  { value: "Luxury",  label: "Luxury",       desc: "Trophy project, no limits",    price: "₹1,600+/sqft" },
];

export function CostCalculator() {
  const [step, setStep] = useState(1);
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState<CalculatorInput>({
    businessType:    "Cafe",
    areaSqft:        1000,
    designTier:      "Premium",
    materialTier:    "High-end",
    furnitureRequired: "Yes",
    timeline:        "Normal",
  });

  const estimate = useMemo(() => estimateCost(input), [input]);

  const set = <K extends keyof CalculatorInput>(key: K, val: CalculatorInput[K]) =>
    setInput((p) => ({ ...p, [key]: val }));

  const stepLabels = ["Business Type", "Area", "Design Level", "Preferences", "Contact"];

  return (
    <div className="calc-shell">
      {/* Progress bar */}
      <div className="calc-progress">
        <div className="step-track">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const isActive = step === n;
            const isDone   = step > n || unlocked;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", flex: i < stepLabels.length - 1 ? 1 : "none" }}>
                <div className={`step-dot${isDone ? " done" : isActive ? " active" : ""}`}>
                  {isDone ? "✓" : n}
                </div>
                {i < stepLabels.length - 1 && <div className={`step-line${isDone ? " done" : ""}`} />}
              </div>
            );
          })}
        </div>
        <span className={`calc-step-label${step <= TOTAL_STEPS ? " active" : ""}`}>
          {unlocked ? "Your Estimate" : stepLabels[step - 1]}
        </span>
      </div>

      <div className="calc-body">
        {/* STEP 1 — Business Type */}
        {step === 1 && (
          <>
            <p className="calc-q-step">Step 1 of 5</p>
            <p className="calc-q-title">What type of space are you designing?</p>
            <div className="option-cards">
              {businessTypes.map((bt) => (
                <div
                  key={bt.value}
                  className={`option-card${input.businessType === bt.value ? " selected" : ""}`}
                  onClick={() => set("businessType", bt.value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && set("businessType", bt.value)}
                >
                  <div className="opt-icon">{bt.icon}</div>
                  <div className="opt-label">{bt.value}</div>
                  <div className="opt-sub">{bt.sub}</div>
                </div>
              ))}
            </div>
            <div className="calc-nav">
              <button className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 2 — Area */}
        {step === 2 && (
          <>
            <p className="calc-q-step">Step 2 of 5</p>
            <p className="calc-q-title">What is the approximate area of your space?</p>
            <div className="area-wrap">
              <div className="area-input-row">
                <input
                  type="number"
                  min={200}
                  max={20000}
                  value={input.areaSqft}
                  onChange={(e) => set("areaSqft", Number(e.target.value) || 200)}
                />
                <span className="area-unit">sq ft</span>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={input.areaSqft}
                onChange={(e) => set("areaSqft", Number(e.target.value))}
                className="range-slider"
              />
              <div className="range-labels"><span>200 sq ft</span><span>10,000 sq ft</span></div>
            </div>
            <div className="calc-nav">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 3 — Design Tier */}
        {step === 3 && (
          <>
            <p className="calc-q-step">Step 3 of 5</p>
            <p className="calc-q-title">What design level are you targeting?</p>
            <div className="tier-cards">
              {designTiers.map((t) => (
                <div
                  key={t.value}
                  className={`tier-card${input.designTier === t.value ? " selected" : ""}`}
                  onClick={() => set("designTier", t.value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && set("designTier", t.value)}
                >
                  <h4>{t.label}</h4>
                  <p>{t.desc}</p>
                  <div className="tier-price">{t.price}</div>
                </div>
              ))}
            </div>
            <div className="calc-nav">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 4 — Preferences */}
        {step === 4 && (
          <>
            <p className="calc-q-step">Step 4 of 5</p>
            <p className="calc-q-title">A few more preferences…</p>

            <p className="toggle-label">Material Quality</p>
            <div className="toggle-options">
              {(["Standard", "High-end"] as CalculatorInput["materialTier"][]).map((m) => (
                <button
                  key={m}
                  className={`toggle-btn${input.materialTier === m ? " selected" : ""}`}
                  onClick={() => set("materialTier", m)}
                >
                  {m === "Standard" ? "🪵 Standard" : "💎 High-end"}
                </button>
              ))}
            </div>

            <p className="toggle-label" style={{ marginTop: 18 }}>Furniture Required?</p>
            <div className="toggle-options">
              {(["Yes", "No"] as CalculatorInput["furnitureRequired"][]).map((f) => (
                <button
                  key={f}
                  className={`toggle-btn${input.furnitureRequired === f ? " selected" : ""}`}
                  onClick={() => set("furnitureRequired", f)}
                >
                  {f === "Yes" ? "🪑 Yes, include furniture" : "🚫 No furniture"}
                </button>
              ))}
            </div>

            <p className="toggle-label" style={{ marginTop: 18 }}>Timeline</p>
            <div className="toggle-options">
              {(["Normal", "Urgent"] as CalculatorInput["timeline"][]).map((tl) => (
                <button
                  key={tl}
                  className={`toggle-btn${input.timeline === tl ? " selected" : ""}`}
                  onClick={() => set("timeline", tl)}
                >
                  {tl === "Normal" ? "🗓️ Normal (6–10 weeks)" : "⚡ Urgent (< 4 weeks)"}
                </button>
              ))}
            </div>

            <div className="calc-nav">
              <button className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(5)}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 5 — Lead Gate */}
        {step === 5 && !unlocked && (
          <>
            <p className="calc-q-step">Step 5 of 5</p>
            <p className="calc-q-title">Almost there! Where should we send your estimate?</p>
            <LeadForm
              source="calculator"
              defaults={{
                businessType:      input.businessType,
                areaSqft:          input.areaSqft,
                designTier:        input.designTier,
                materialTier:      input.materialTier,
                furnitureRequired: input.furnitureRequired,
                timeline:          input.timeline,
                estimatedCostMin:  estimate.min,
                estimatedCostMax:  estimate.max,
              }}
              onSuccess={() => setUnlocked(true)}
            />
            <div className="calc-nav">
              <button className="btn btn-ghost" onClick={() => setStep(4)}>← Back</button>
            </div>
          </>
        )}

        {/* RESULT */}
        {(unlocked || (step === 5 && unlocked)) && (
          <>
            <div className="estimate-result">
              <h3>Your Estimated Project Cost</h3>
              <div className="estimate-range">
                ₹{estimate.min.toLocaleString("en-IN")} – ₹{estimate.max.toLocaleString("en-IN")}
              </div>
              <small>
                {input.businessType} · {input.areaSqft.toLocaleString()} sq ft · {input.designTier} · {input.materialTier} materials
              </small>
            </div>
            <p style={{ textAlign: "center", fontSize: "0.84rem", color: "var(--text-sec)", marginBottom: 18 }}>
              Our team will call you within 24 hours to discuss your project in detail and give a precise quote.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={`https://wa.me/919000000000?text=Hi, I used the cost calculator. I need ${input.designTier} interiors for my ${input.businessType} (${input.areaSqft} sq ft).`}
                 target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                WhatsApp Us Now
              </a>
              <button className="btn btn-ghost" onClick={() => { setStep(1); setUnlocked(false); }}>
                Recalculate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

