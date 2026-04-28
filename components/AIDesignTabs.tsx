"use client";

import { ArchitecturalStudio } from "@/components/ArchitecturalStudio";

export function AIDesignTabs({ children: _children }: { children?: React.ReactNode }) {
  return (
    <div className="ai-tabs-shell">
      <div className="ai-tabs-bar">
        <div className="ai-tab-btn active">
          <span className="ai-tab-icon">🏛️</span>
          Architectural Studio
          <span className="ai-tab-badge ai-tab-badge--new">AI Powered</span>
        </div>
      </div>
      <ArchitecturalStudio />
    </div>
  );
}
