import { NextResponse } from "next/server";
import { z } from "zod";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

const schema = z.object({
  spaceType: z.string(),
  sqft: z.number().min(50).max(50000),
  designStyle: z.string(),
  customPrompt: z.string().optional(),
  images: z.array(z.string()).optional(), // base64 JPEG strings (no data: prefix)
});

// ── Style descriptors fed into the prompt ──────────────────────────────────
const STYLE_DESC: Record<string, string> = {
  Luxury:
    "ultra-luxury opulent design, rich marble surfaces, gold and brass accents, crystal chandeliers, hand-crafted details, bespoke furniture",
  Premium:
    "premium quality design, sophisticated materials, refined neutral palette, statement lighting, high-end finishes",
  Classic:
    "timeless classic design, symmetrical layouts, ornate mouldings, warm wood tones, traditional furniture silhouettes",
  Modern:
    "contemporary modern design, clean straight lines, minimalist aesthetic, monochrome palette with bold accents, open-plan flow",
  Traditional:
    "warm traditional design, heritage materials, earthy tones, cultural motifs, handmade textures, cozy atmosphere",
};

// ── Space descriptors ──────────────────────────────────────────────────────
const SPACE_DESC: Record<string, string> = {
  Bakery:
    "artisan bakery with glass product display counters, warm ambient lighting, bread and pastry showcase shelving, customer seating nook",
  Restaurant:
    "full-service restaurant with dining tables and chairs, ambient pendant lighting, bar counter, open or semi-open kitchen concept, host station",
  "Jewellery Shop":
    "premium jewellery showroom with illuminated glass display cases, accent spotlights on products, secure display pedestals, VIP customer seating",
  "Coffee Shop":
    "specialty coffee shop with espresso bar counter, cozy lounge seating, communal tables, warm Edison bulb lighting, coffee aroma ambience",
  Theater:
    "entertainment venue or theater with tiered seating arrangement, dramatic stage lighting, acoustic wall panels, premium seat upholstery",
  Home:
    "residential living space with comfortable furniture arrangement, balanced natural and artificial lighting, personal décor accents",
  Others:
    "commercial interior space with functional furniture, professional lighting, clean and welcoming design",
};

// ── Prompt builder ─────────────────────────────────────────────────────────
function buildPrompt(
  data: z.infer<typeof schema>,
  variation: 1 | 2
): string {
  const styleDesc = STYLE_DESC[data.designStyle] ?? data.designStyle;
  const spaceDesc = SPACE_DESC[data.spaceType] ?? data.spaceType;

  const variationInstruction =
    variation === 1
      ? "Variation A: warm inviting colour palette, maximise customer appeal and brand identity, emphasise comfort and flow"
      : "Variation B: bold contemporary colour palette, maximise visual impact and space efficiency, emphasise modern aesthetics";

  const refNote = (data.images?.length ?? 0) > 0
    ? "Using the uploaded reference photo of the existing space as the base layout, redesign and transform it with the following specifications:"
    : "Generate a brand-new interior design concept with the following specifications:";

  return `Photorealistic interior design render.

${refNote}

Space type: ${data.spaceType}
Space details: ${spaceDesc}
Floor area: approximately ${data.sqft} square feet
Design style: ${data.designStyle} — ${styleDesc}
${variationInstruction}
${data.customPrompt ? `Client special requirements: ${data.customPrompt}` : ""}

Render requirements:
- Ultra-photorealistic architectural visualisation, indistinguishable from a real photograph
- Complete interior view showing furniture placement, flooring, walls, ceiling, and lighting
- Professional commercial-grade quality suitable for a ${data.spaceType} business
- Accurate perspective from main entrance or primary viewing angle
- 8K resolution detail, sharp textures, physically-based rendering quality
- Mood and atmosphere consistent with ${data.designStyle} style`;
}

// ── Call Gemini once for one variation ────────────────────────────────────
async function callGemini(
  prompt: string,
  imageBase64?: string
): Promise<{ data: string; mimeType: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = [{ text: prompt }];

  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: "image/jpeg",
        data: imageBase64,
      },
    });
  }

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) {
      throw new Error("API quota exceeded. Please try again in a minute, or contact us on WhatsApp for a personalised design.");
    }
    if (res.status === 403 || res.status === 401) {
      throw new Error("AI service authentication error. Please try again later.");
    }
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const result = await res.json();
  const candidate = result?.candidates?.[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imgPart = candidate?.content?.parts?.find((p: any) => p.inlineData);

  if (!imgPart?.inlineData?.data) {
    throw new Error("Gemini returned no image in this response");
  }

  return {
    data: imgPart.inlineData.data as string,
    mimeType: (imgPart.inlineData.mimeType as string) ?? "image/png",
  };
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!GEMINI_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured on this server." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input: " + parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const firstImage = data.images?.[0]; // use first uploaded image as reference

  try {
    const [v1, v2] = await Promise.all([
      callGemini(buildPrompt(data, 1), firstImage),
      callGemini(buildPrompt(data, 2), firstImage),
    ]);

    return NextResponse.json({ success: true, images: [v1, v2] });
  } catch (err) {
    console.error("[ai-design] generation failed:", err);
    const message =
      err instanceof Error ? err.message : "Unknown generation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
