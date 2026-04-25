import { Schema, model, models } from "mongoose";

const leadSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String },
    businessType: { type: String },
    areaSqft: { type: Number },
    designTier: { type: String },
    materialTier: { type: String },
    furnitureRequired: { type: String },
    timeline: { type: String },
    estimatedCostMin: { type: Number },
    estimatedCostMax: { type: Number },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

const visitSchema = new Schema(
  {
    path: { type: String, required: true },
    event: { type: String, enum: ["view", "exit", "click", "article_view", "faq_view"], required: true },
    section: { type: String },
    target: { type: String },
    label: { type: String },
    durationMs: { type: Number },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
  },
  { timestamps: true }
);

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    businessType: { type: String, required: true },
    clientName: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    tags: [{ type: String, required: true }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const inspirationSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Lead = models.Lead || model("Lead", leadSchema);
export const Visit = models.Visit || model("Visit", visitSchema);
export const Project = models.Project || model("Project", projectSchema);
export const Inspiration = models.Inspiration || model("Inspiration", inspirationSchema);
