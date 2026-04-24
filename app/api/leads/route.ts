import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Lead } from "@/lib/models";
import { sendLeadEmail } from "@/lib/email";

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  location: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  businessType: z.string().optional(),
  areaSqft: z.number().optional(),
  designTier: z.string().optional(),
  materialTier: z.string().optional(),
  furnitureRequired: z.string().optional(),
  timeline: z.string().optional(),
  estimatedCostMin: z.number().optional(),
  estimatedCostMax: z.number().optional(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const db = await connectDB();
    const doc = db ? await Lead.create(parsed.data) : { _id: "no-db" };

    await sendLeadEmail({
      name: parsed.data.name,
      phone: parsed.data.phone,
      location: parsed.data.location,
      businessType: parsed.data.businessType,
      areaSqft: parsed.data.areaSqft,
      estimatedCostMin: parsed.data.estimatedCostMin,
      estimatedCostMax: parsed.data.estimatedCostMax,
    });

    return NextResponse.json({ success: true, id: doc._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
