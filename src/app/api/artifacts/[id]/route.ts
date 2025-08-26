import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artifacts, artifactVersions } from "@/lib/db/schema";
import { eq, max } from "drizzle-orm";

interface RouteContext {
  params: { id: string };
}

// GET /api/artifacts/[id] - Get a specific artifact
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    const artifact = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id))
      .limit(1);

    if (!artifact.length) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ artifact: artifact[0] });
  } catch (error) {
    console.error("Error fetching artifact:", error);
    return NextResponse.json(
      { error: "Failed to fetch artifact" },
      { status: 500 }
    );
  }
}

// PUT /api/artifacts/[id] - Update an artifact
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();
    const { type, name, code, meta } = body;

    // Check if artifact exists
    const existingArtifact = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id))
      .limit(1);

    if (!existingArtifact.length) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    // Get the latest version number
    const latestVersionResult = await db
      .select({ maxVersion: max(artifactVersions.version) })
      .from(artifactVersions)
      .where(eq(artifactVersions.artifactId, id));

    const nextVersion = (latestVersionResult[0]?.maxVersion || 0) + 1;

    // Update the artifact
    const [updatedArtifact] = await db
      .update(artifacts)
      .set({
        ...(type && { type }),
        ...(name && { name }),
        ...(code && { code }),
        ...(meta && { meta }),
        updatedAt: new Date(),
      })
      .where(eq(artifacts.id, id))
      .returning();

    // Create a new version if code changed
    if (code && code !== existingArtifact[0].code) {
      await db.insert(artifactVersions).values({
        artifactId: id,
        version: nextVersion,
        code,
        meta: meta || {},
      });
    }

    return NextResponse.json({ artifact: updatedArtifact });
  } catch (error) {
    console.error("Error updating artifact:", error);
    return NextResponse.json(
      { error: "Failed to update artifact" },
      { status: 500 }
    );
  }
}

// DELETE /api/artifacts/[id] - Delete an artifact
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    // Check if artifact exists
    const existingArtifact = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id))
      .limit(1);

    if (!existingArtifact.length) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    // Delete the artifact (versions will be cascade deleted)
    await db.delete(artifacts).where(eq(artifacts.id, id));

    return NextResponse.json({ message: "Artifact deleted successfully" });
  } catch (error) {
    console.error("Error deleting artifact:", error);
    return NextResponse.json(
      { error: "Failed to delete artifact" },
      { status: 500 }
    );
  }
}
