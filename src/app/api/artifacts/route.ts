import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artifacts, artifactVersions } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// GET /api/artifacts - List all artifacts
export async function GET() {
  try {
    const allArtifacts = await db
      .select()
      .from(artifacts)
      .orderBy(desc(artifacts.updatedAt));

    return NextResponse.json({ artifacts: allArtifacts });
  } catch (error) {
    console.error("Error fetching artifacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch artifacts" },
      { status: 500 }
    );
  }
}

// POST /api/artifacts - Create a new artifact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, code, meta } = body;

    // Basic validation
    if (!type || !name || !code) {
      return NextResponse.json(
        { error: "Missing required fields: type, name, code" },
        { status: 400 }
      );
    }

    // Create the artifact
    const [newArtifact] = await db
      .insert(artifacts)
      .values({
        type,
        name,
        code,
        meta: meta || {},
      })
      .returning();

    // Create the initial version
    await db.insert(artifactVersions).values({
      artifactId: newArtifact.id,
      version: 1,
      code,
      meta: meta || {},
    });

    return NextResponse.json({ artifact: newArtifact }, { status: 201 });
  } catch (error) {
    console.error("Error creating artifact:", error);
    return NextResponse.json(
      { error: "Failed to create artifact" },
      { status: 500 }
    );
  }
}
