export type CalculatorInput = {
  businessType: "Cafe" | "Restaurant" | "Bakery" | "Hotel" | "Office" | "Retail" | "Other";
  areaSqft: number;
  designTier: "Basic" | "Premium" | "Luxury";
  materialTier: "Standard" | "High-end";
  furnitureRequired: "Yes" | "No";
  timeline: "Urgent" | "Normal";
};

const typeMultiplier: Record<CalculatorInput["businessType"], number> = {
  Cafe: 1.0,
  Restaurant: 1.1,
  Bakery: 1.0,
  Hotel: 1.2,
  Office: 0.95,
  Retail: 1.05,
  Other: 1.0,
};

const designMultiplier: Record<CalculatorInput["designTier"], number> = {
  Basic: 1,
  Premium: 1.25,
  Luxury: 1.6,
};

const materialMultiplier: Record<CalculatorInput["materialTier"], number> = {
  Standard: 1,
  "High-end": 1.35,
};

const furnitureMultiplier: Record<CalculatorInput["furnitureRequired"], number> = {
  No: 1,
  Yes: 1.2,
};

const timelineMultiplier: Record<CalculatorInput["timeline"], number> = {
  Normal: 1,
  Urgent: 1.15,
};

export function estimateCost(input: CalculatorInput) {
  const baseRatePerSqft = 1150;
  const raw =
    input.areaSqft *
    baseRatePerSqft *
    typeMultiplier[input.businessType] *
    designMultiplier[input.designTier] *
    materialMultiplier[input.materialTier] *
    furnitureMultiplier[input.furnitureRequired] *
    timelineMultiplier[input.timeline];

  const min = Math.round(raw * 0.92);
  const max = Math.round(raw * 1.12);

  return { min, max };
}
