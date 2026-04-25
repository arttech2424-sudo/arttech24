import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Visit } from "@/lib/models";

const schema = z.object({
  path: z.string().min(1),
  event: z.enum(["view", "exit", "click", "article_view", "faq_view"]),
  section: z.string().optional(),
  target: z.string().optional(),
  label: z.string().optional(),
  durationMs: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const db = await connectDB();

    const forwarded = request.headers.get("x-forwarded-for") || "";
    const ip = forwarded.split(",")[0]?.trim();
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";
    const city = request.headers.get("x-vercel-ip-city") || "";
    const region = request.headers.get("x-vercel-ip-country-region") || "";
    const country = request.headers.get("x-vercel-ip-country") || "";

    if (db) {
      await Visit.create({
        ...parsed.data,
        ip,
        userAgent,
        referrer,
        city,
        region,
        country,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
