import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models";
import { projectSeeds } from "@/lib/data";
import { authOptions } from "@/lib/auth";

async function isAdminAuthorized() {
  const session = await getServerSession(authOptions);
  return !!session?.user?.email;
}

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json(projectSeeds);
    }
    const projects = await Project.find().sort({ createdAt: -1 }).lean();

    if (!projects.length) {
      return NextResponse.json(projectSeeds);
    }

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(projectSeeds);
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
    const created = await Project.create(body);
    return NextResponse.json({ success: true, project: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create project" }, { status: 500 });
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
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }
    await Project.deleteOne({ slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete project" }, { status: 500 });
  }
}
