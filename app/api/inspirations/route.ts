import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { Inspiration } from "@/lib/models";
import { authOptions } from "@/lib/auth";

async function isAdminAuthorized() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return true;
  }

  const mobileAuth = (await cookies()).get("admin_mobile_auth")?.value;
  return !!mobileAuth;
}

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json([]);
    }

    const references = await Inspiration.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(references);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const created = await Inspiration.create(body);
    return NextResponse.json({ success: true, inspiration: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create inspiration" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Id required" }, { status: 400 });
    }

    await Inspiration.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete inspiration" }, { status: 500 });
  }
}
