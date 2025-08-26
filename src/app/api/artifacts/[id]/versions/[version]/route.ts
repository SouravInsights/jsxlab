import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artifactVersions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

interface RouteContext {
  params: { id: string; version: string };
}

// GET /api/artifacts/[id]/versions/[version] - Get a specific version
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id, version } = params;
    const versionNumber = parseInt(version);

    if (isNaN(versionNumber)) {
      return NextResponse.json(
        { error: "Invalid version number" },
        { status: 400 }
      );
    }

    const artifactVersion = await db
      .select()
      .from(artifactVersions)
      .where(
        and(
          eq(artifactVersions.artifactId, id),
          eq(artifactVersions.version, versionNumber)
        )
      )
      .limit(1);

    if (!artifactVersion.length) {
      return NextResponse.json(
        { error: "Artifact version not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ version: artifactVersion[0] });
  } catch (error) {
    console.error("Error fetching artifact version:", error);
    return NextResponse.json(
      { error: "Failed to fetch artifact version" },
      { status: 500 }
    );
  }
}
