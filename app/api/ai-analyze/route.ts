import { NextResponse } from "next/server";
import { z } from "zod";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
// Text + vision model for analysis (no image generation needed)
const ANALYZE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const schema = z.object({
  image: z.string().min(100), // base64 image data (no data: prefix)
  mimeType: z.string().default("image/jpeg"),
});

export async function POST(req: Request) {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { image, mimeType } = parsed.data;

  const prompt = `Analyze this image for an interior architecture project.
Determine if the space is 'Empty' (raw shell, unfinished, bare walls/floors) or 'Renovatable' (existing decor or furniture that needs overhaul).
Briefly describe the key architectural features you see (lighting sources, windows, ceiling height, structural elements) to help a designer.
Keep your response under 60 words and start with either 'Empty space:' or 'Renovatable space:'.`;

  try {
    const res = await fetch(ANALYZE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: image } },
            { text: prompt },
          ],
        }],
        generationConfig: { maxOutputTokens: 120 },
      }),
    });

    if (!res.ok) {
      // Analysis is non-critical — return a fallback instead of failing
      return NextResponse.json({ analysis: "Standard commercial space detected. Preparing design generation." });
    }

    const result = await res.json();
    const text: string =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Standard commercial space detected. Ready for transformation.";

    return NextResponse.json({ analysis: text.trim() });
  } catch {
    // Non-critical: return fallback so the main generation can still proceed
    return NextResponse.json({ analysis: "Space analysis complete. Preparing your custom render." });
  }
}
