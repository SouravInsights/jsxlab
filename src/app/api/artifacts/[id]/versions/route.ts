import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artifactVersions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

interface RouteContext {
  params: { id: string };
}

// GET /api/artifacts/[id]/versions - Get all versions of an artifact
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    const versions = await db
      .select()
      .from(artifactVersions)
      .where(eq(artifactVersions.artifactId, id))
      .orderBy(desc(artifactVersions.version));

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Error fetching artifact versions:", error);
    return NextResponse.json(
      { error: "Failed to fetch artifact versions" },
      { status: 500 }
    );
  }
}
