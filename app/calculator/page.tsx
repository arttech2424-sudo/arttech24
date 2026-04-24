import type { Metadata } from "next";
import { CostCalculator } from "@/components/CostCalculator";
import { VisitorTracker } from "@/components/VisitorTracker";

export const metadata: Metadata = {
  title: "Commercial Interior Cost Calculator | ArtTech24",
  description:
    "Estimate your commercial interior project cost for cafe, restaurant, bakery, hotel, office, and retail spaces.",
};

export default function CalculatorPage() {
  return (
    <main className="calc-page">
      <VisitorTracker path="/calculator" />
      <div className="container">
        <div className="calc-page-header">
          <p className="section-eyebrow">Free Cost Estimate</p>
          <h1>Commercial Interior Cost Calculator</h1>
          <p>
            Get a realistic budget estimate in under 2 minutes — no sign-up, no commitment.
          </p>
        </div>
        <CostCalculator />
      </div>
    </main>
  );
}

