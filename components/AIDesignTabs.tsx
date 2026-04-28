"use client";

import { useState } from "react";
import { ArchitecturalStudio } from "@/components/ArchitecturalStudio";

const STUDIO_APP_URL =
  "https://aistudio.google.com/apps/3d787aa7-51fb-442d-b6f0-7d9a1daa4a35";

export function AIDesignTabs({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<"studio" | "wizard" | "embed">("studio");

  return (
    <div className="ai-tabs-shell">
      {/* Tab bar */}
      <div className="ai-tabs-bar">
        <button
          className={`ai-tab-btn${tab === "studio" ? " active" : ""}`}
          onClick={() => setTab("studio")}
        >
          <span className="ai-tab-icon">🏛️</span>
          Architectural Studio
          <span className="ai-tab-badge ai-tab-badge--new">New</span>
        </button>
        <button
          className={`ai-tab-btn${tab === "wizard" ? " active" : ""}`}
          onClick={() => setTab("wizard")}
        >
          <span className="ai-tab-icon">🪄</span>
          Step-by-Step Wizard
        </button>
        <button
          className={`ai-tab-btn${tab === "embed" ? " active" : ""}`}
          onClick={() => setTab("embed")}
        >
          <span className="ai-tab-icon">✨</span>
          AI Studio App
          <span className="ai-tab-badge">Google AI</span>
        </button>
      </div>

      {/* Architectural Studio panel */}
      <div style={{ display: tab === "studio" ? "block" : "none" }}>
        <ArchitecturalStudio />
      </div>

      {/* Wizard panel */}
      <div style={{ display: tab === "wizard" ? "block" : "none" }}>
        {children}
      </div>

      {/* AI Studio embed panel */}
      {tab === "embed" && (
        <div className="ai-studio-embed">
          <div className="ai-studio-note">
            <span>🔗 Powered by Google AI Studio — Gemini 2.5 Flash Image</span>
            <a
              href={STUDIO_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-studio-open-link"
            >
              Open in full screen ↗
            </a>
          </div>
          <iframe
            src={STUDIO_APP_URL}
            title="ArtTech AI Design Studio"
            className="ai-studio-iframe"
            allow="camera; microphone; clipboard-write"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

  return (
    <div className="ai-tabs-shell">
      {/* Tab bar */}
      <div className="ai-tabs-bar">
        <button
          className={`ai-tab-btn${tab === "lux" ? " active" : ""}`}
          onClick={() => setTab("lux")}
        >
          <span className="ai-tab-icon">🏛️</span>
          Instant Before/After
          <span className="ai-tab-badge ai-tab-badge--new">New</span>
        </button>
        <button
          className={`ai-tab-btn${tab === "wizard" ? " active" : ""}`}
          onClick={() => setTab("wizard")}
        >
          <span className="ai-tab-icon">🪄</span>
          Step-by-Step Wizard
        </button>
        <button
          className={`ai-tab-btn${tab === "studio" ? " active" : ""}`}
          onClick={() => setTab("studio")}
        >
          <span className="ai-tab-icon">✨</span>
          AI Studio App
          <span className="ai-tab-badge">Google AI</span>
        </button>
      </div>

      {/* LuxDesigner panel */}
      <div style={{ display: tab === "lux" ? "block" : "none" }}>
        <LuxDesigner />
      </div>

      {/* Wizard panel */}
      <div style={{ display: tab === "wizard" ? "block" : "none" }}>
        {children}
      </div>

      {/* AI Studio embed panel */}
      {tab === "studio" && (
        <div className="ai-studio-embed">
          <div className="ai-studio-note">
            <span>🔗 Powered by Google AI Studio — Gemini 2.5 Flash Image</span>
            <a
              href={STUDIO_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-studio-open-link"
            >
              Open in full screen ↗
            </a>
          </div>
          <iframe
            src={STUDIO_APP_URL}
            title="ArtTech AI Design Studio"
            className="ai-studio-iframe"
            allow="camera; microphone; clipboard-write"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
